import { NextResponse } from "next/server";
import { z } from "zod";
import { getChatById, persistSummary } from "@/lib/data";
import { composeSummaryText, generateStructuredSummary } from "@/lib/summary";

const requestSchema = z.object({
  chatId: z.string().min(1),
  mode: z.enum(["messages", "window"]),
  messageCount: z.number().int().min(1).max(100).optional(),
  window: z.enum(["1h", "3h", "since_last_seen"]).optional(),
  simulatedOnDevice: z.boolean().default(true)
});

function selectCoverage({
  chat,
  mode,
  messageCount,
  window
}: {
  chat: Awaited<ReturnType<typeof getChatById>>;
  mode: "messages" | "window";
  messageCount?: number;
  window?: "1h" | "3h" | "since_last_seen";
}) {
  const unreadMessages = chat.messages.filter((message) =>
    chat.lastSeenAt ? +new Date(message.sentAt) > +new Date(chat.lastSeenAt) : true
  );

  if (unreadMessages.length === 0) {
    return {
      messages: [],
      coverageLabel: "No unread messages",
      requestMode: "EMPTY"
    };
  }

  if (mode === "messages") {
    const selected = unreadMessages.slice(-(messageCount ?? 8));
    return {
      messages: selected,
      coverageLabel: `Last ${selected.length} unread messages`,
      requestMode: "LAST_MESSAGES"
    };
  }

  if (window === "1h" || window === "3h") {
    const spanHours = window === "1h" ? 1 : 3;
    const referenceTime = Math.max(...unreadMessages.map((message) => +new Date(message.sentAt)));
    const threshold = referenceTime - spanHours * 60 * 60 * 1000;
    const selected = unreadMessages.filter((message) => +new Date(message.sentAt) >= threshold);
    return {
      messages: selected,
      coverageLabel: `Last ${spanHours} hour${spanHours === 1 ? "" : "s"} of unread messages`,
      requestMode: window === "1h" ? "TIME_WINDOW_1H" : "TIME_WINDOW_3H"
    };
  }

  return {
    messages: unreadMessages,
    coverageLabel: "Unread since last seen",
    requestMode: "SINCE_LAST_SEEN"
  };
}

function estimateTimeSaved(sourceMessages: string[], summaryText: string) {
  const sourceWords = sourceMessages.join(" ").split(/\s+/).filter(Boolean).length;
  const summaryWords = summaryText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(sourceWords / 180 - summaryWords / 220));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload for unread summarization." },
      { status: 400 }
    );
  }

  try {
    const chat = await getChatById(parsed.data.chatId);

    if (chat.summaryOptOut) {
      return NextResponse.json({ error: "Summaries are paused for this chat." }, { status: 409 });
    }

    const selection = selectCoverage({
      chat,
      mode: parsed.data.mode,
      messageCount: parsed.data.messageCount,
      window: parsed.data.window
    });

    if (selection.messages.length === 0) {
      return NextResponse.json(
        { error: "No unread messages matched the selected summary range." },
        { status: 422 }
      );
    }

    const startedAt = Date.now();
    const generated = await generateStructuredSummary(selection.messages, selection.coverageLabel);
    const summaryText = composeSummaryText(generated.summary);
    const latencyMs = Date.now() - startedAt;

    const saved = await persistSummary({
      chatId: chat.id,
      coverageLabel: selection.coverageLabel,
      requestMode: selection.requestMode,
      summaryText,
      keyUpdates: generated.summary.keyUpdates,
      decisions: generated.summary.decisions,
      actionItems: generated.summary.actionItems,
      importantContributors: generated.summary.importantContributors,
      sourceMessageCount: selection.messages.length,
      unreadMessageCount: chat.unreadCount,
      estimatedTimeSavedMin: estimateTimeSaved(
        selection.messages.map((message) => message.content),
        summaryText
      ),
      latencyMs,
      simulatedOnDevice: parsed.data.simulatedOnDevice,
      triggeredBy: "Demo user"
    });

    return NextResponse.json({
      summary: saved.summary,
      persisted: saved.persisted,
      provider: generated.provider
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The prototype could not summarize that unread slice."
      },
      { status: 500 }
    );
  }
}
