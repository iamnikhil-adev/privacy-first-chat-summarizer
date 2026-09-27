import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { AppContributor, AppMessage } from "@/lib/types";

const summarySchema = z.object({
  overview: z.string(),
  keyUpdates: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  importantContributors: z.array(
    z.object({
      name: z.string(),
      contribution: z.string()
    })
  )
});

export type StructuredSummary = z.infer<typeof summarySchema>;

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function truncate(text: string, max = 140) {
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function summarizeWithHeuristics(messages: AppMessage[]): StructuredSummary {
  const keyUpdates = messages.slice(-4).map((message) => truncate(message.content));

  const decisions = messages
    .filter((message) =>
      /(decision|decided|agreed|locked|freeze|ship|approved|use gate|stays in place)/i.test(
        message.content
      )
    )
    .slice(0, 3)
    .map((message) => truncate(message.content));

  const actionItems = messages
    .filter((message) =>
      /(action item|i will|i'll|please|need to|can someone|follow up|will share|will update)/i.test(
        message.content
      )
    )
    .slice(0, 4)
    .map((message) => truncate(message.content));

  const senderCounts = messages.reduce<Record<string, number>>((accumulator, message) => {
    if (message.sender !== "You") {
      accumulator[message.sender] = (accumulator[message.sender] ?? 0) + 1;
    }
    return accumulator;
  }, {});

  const importantContributors: AppContributor[] = Object.entries(senderCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([name]) => {
      const latestMessage = [...messages].reverse().find((message) => message.sender === name);
      return {
        name,
        contribution: latestMessage ? truncate(latestMessage.content, 90) : "Shared key updates."
      };
    });

  return {
    overview:
      "Unread activity clustered around operational updates, a few explicit decisions, and concrete follow-ups that need attention.",
    keyUpdates,
    decisions:
      decisions.length > 0
        ? decisions
        : ["No hard decision was stated explicitly in the unread slice."],
    actionItems:
      actionItems.length > 0
        ? actionItems
        : ["No direct owner was assigned in the unread slice."],
    importantContributors
  };
}

function buildPrompt(messages: AppMessage[], coverageLabel: string) {
  const transcript = messages
    .map(
      (message) =>
        `[${new Date(message.sentAt).toLocaleString("en-IN", { hour12: true })}] ${message.sender}: ${message.content}`
    )
    .join("\n");

  return [
    {
      role: "system" as const,
      content:
        "You summarize only unread messages from high-activity group chats and communities. Do not mention private 1-to-1 messaging. Keep the tone crisp, neutral, and operational. Mention who said what only when it matters."
    },
    {
      role: "user" as const,
      content: `Create a concise structured summary for this WhatsApp-style group chat slice.\nCoverage: ${coverageLabel}\n\nTranscript:\n${transcript}`
    }
  ];
}

export async function generateStructuredSummary(messages: AppMessage[], coverageLabel: string) {
  if (!client) {
    return {
      provider: "demo-fallback" as const,
      summary: summarizeWithHeuristics(messages)
    };
  }

  try {
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: buildPrompt(messages, coverageLabel),
      text: {
        format: zodTextFormat(summarySchema, "group_chat_summary")
      }
    });

    if (!response.output_parsed) {
      throw new Error("Structured summary was empty.");
    }

    return {
      provider: "openai" as const,
      summary: response.output_parsed
    };
  } catch {
    return {
      provider: "demo-fallback" as const,
      summary: summarizeWithHeuristics(messages)
    };
  }
}

export function composeSummaryText(summary: StructuredSummary) {
  const lines = [
    summary.overview,
    summary.keyUpdates.length > 0 ? `Key updates: ${summary.keyUpdates.join(" ")}` : "",
    summary.decisions.length > 0 ? `Decisions: ${summary.decisions.join(" ")}` : "",
    summary.actionItems.length > 0 ? `Action items: ${summary.actionItems.join(" ")}` : ""
  ].filter(Boolean);

  return lines.join(" ");
}
