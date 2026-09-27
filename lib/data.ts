import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { attachSummaries, getFallbackStore } from "@/lib/fallback-store";
import type {
  AppChat,
  AppFeedback,
  AppSummary,
  DashboardData,
  HomePageData,
  StorageMode
} from "@/lib/types";

type SupportedChatType = "GROUP" | "COMMUNITY";

type ChatWithMessagesAndSummaries = Prisma.ChatGetPayload<{
  include: {
    messages: true;
    summaries: true;
  };
}>;

type ChatWithMessages = Prisma.ChatGetPayload<{
  include: {
    messages: true;
  };
}>;

type RawSummary = Prisma.SummaryGetPayload<object>;
type RawFeedback = Prisma.FeedbackGetPayload<object>;

type PersistSummaryInput = Omit<AppSummary, "id" | "requestedAt"> & {
  id?: string;
  requestedAt?: string;
};

const supportedTypes: SupportedChatType[] = ["GROUP", "COMMUNITY"];

function computeUnreadCount(messages: { sentAt: string }[], lastSeenAt: string | null) {
  if (!lastSeenAt) {
    return messages.length;
  }

  return messages.filter((message) => +new Date(message.sentAt) > +new Date(lastSeenAt)).length;
}

function normalizeSummary(raw: {
  id: string;
  chatId: string;
  coverageLabel: string;
  requestMode: string;
  requestedAt: Date | string;
  summaryText: string;
  keyUpdates: unknown;
  decisions: unknown;
  actionItems: unknown;
  importantContributors: unknown;
  sourceMessageCount: number;
  unreadMessageCount: number;
  estimatedTimeSavedMin: number;
  latencyMs: number;
  simulatedOnDevice: boolean;
  triggeredBy: string;
}): AppSummary {
  return {
    id: raw.id,
    chatId: raw.chatId,
    coverageLabel: raw.coverageLabel,
    requestMode: raw.requestMode,
    requestedAt:
      raw.requestedAt instanceof Date ? raw.requestedAt.toISOString() : String(raw.requestedAt),
    summaryText: raw.summaryText,
    keyUpdates: Array.isArray(raw.keyUpdates) ? (raw.keyUpdates as string[]) : [],
    decisions: Array.isArray(raw.decisions) ? (raw.decisions as string[]) : [],
    actionItems: Array.isArray(raw.actionItems) ? (raw.actionItems as string[]) : [],
    importantContributors: Array.isArray(raw.importantContributors)
      ? (raw.importantContributors as AppSummary["importantContributors"])
      : [],
    sourceMessageCount: raw.sourceMessageCount,
    unreadMessageCount: raw.unreadMessageCount,
    estimatedTimeSavedMin: raw.estimatedTimeSavedMin,
    latencyMs: raw.latencyMs,
    simulatedOnDevice: raw.simulatedOnDevice,
    triggeredBy: raw.triggeredBy
  };
}

function normalizeFeedback(raw: {
  id: string;
  summaryId: string;
  rating: "UP" | "DOWN";
  isPrivacyComplaint: boolean;
  note?: string | null;
  createdAt: Date | string;
}): AppFeedback {
  return {
    id: raw.id,
    summaryId: raw.summaryId,
    rating: raw.rating,
    isPrivacyComplaint: raw.isPrivacyComplaint,
    note: raw.note ?? null,
    createdAt: raw.createdAt instanceof Date ? raw.createdAt.toISOString() : String(raw.createdAt)
  };
}

function normalizeChat(raw: {
  id: string;
  title: string;
  description: string | null;
  type: SupportedChatType;
  participantCount: number;
  isHighActivity: boolean;
  lastSeenAt: Date | string | null;
  simulatedOnDevice: boolean;
  summaryOptOut: boolean;
  unreadCount?: number | null;
  messages: { id: string; chatId: string; sender: string; content: string; sentAt: Date | string }[];
  summaries?: AppSummary[];
}): AppChat {
  const messages = raw.messages
    .map((message) => ({
      ...message,
      sentAt: message.sentAt instanceof Date ? message.sentAt.toISOString() : String(message.sentAt)
    }))
    .sort((left, right) => +new Date(left.sentAt) - +new Date(right.sentAt));

  const lastSeenAt =
    raw.lastSeenAt instanceof Date
      ? raw.lastSeenAt.toISOString()
      : raw.lastSeenAt
        ? String(raw.lastSeenAt)
        : null;

  const computedUnreadCount = computeUnreadCount(messages, lastSeenAt);

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    type: raw.type,
    participantCount: raw.participantCount,
    isHighActivity: raw.isHighActivity,
    lastSeenAt,
    simulatedOnDevice: raw.simulatedOnDevice,
    summaryOptOut: raw.summaryOptOut,
    messages,
    summaries: raw.summaries ?? [],
    unreadCount:
      typeof raw.unreadCount === "number" && raw.unreadCount > 0
        ? raw.unreadCount
        : computedUnreadCount
  };
}

function getNormalizedFallbackData() {
  const store = getFallbackStore();

  return {
    chats: attachSummaries(store.chats, store.summaries).map((chat) => normalizeChat(chat)),
    directChats: store.excludedDirectChats,
    summaries: [...store.summaries].map((summary) => normalizeSummary(summary)),
    feedback: [...store.feedback].map((item) => normalizeFeedback(item))
  };
}

async function tryDatabase<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!process.env.DATABASE_URL) {
    return {
      data: await fallback(),
      storageMode: "demo-fallback" as StorageMode
    };
  }

  try {
    return {
      data: await operation(),
      storageMode: "database" as StorageMode
    };
  } catch {
    return {
      data: await fallback(),
      storageMode: "demo-fallback" as StorageMode
    };
  }
}

export async function getHomePageData(selectedChatId?: string): Promise<HomePageData> {
  const result = await tryDatabase(
    async () => {
      const rawChats = await prisma.chat.findMany({
        where: {
          type: { in: supportedTypes },
          isHighActivity: true
        },
        include: {
          messages: {
            orderBy: {
              sentAt: "asc"
            }
          },
          summaries: {
            orderBy: {
              requestedAt: "desc"
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        }
      });

      const directChats = await prisma.chat.count({
        where: {
          type: "DIRECT"
        }
      });

      const chats = rawChats.map((chat: ChatWithMessagesAndSummaries) =>
        normalizeChat({
          ...chat,
          type: chat.type as SupportedChatType,
          summaries: chat.summaries.map((summary: RawSummary) => normalizeSummary(summary))
        })
      );

      const eligibleChats = chats.filter(
        (chat) =>
          supportedTypes.includes(chat.type) &&
          chat.isHighActivity &&
          !chat.summaryOptOut &&
          chat.unreadCount > 0
      );

      if (eligibleChats.length === 0) {
        const fallback = getNormalizedFallbackData();
        return {
          chats: fallback.chats,
          directChats: fallback.directChats
        };
      }

      return {
        chats,
        directChats
      };
    },
    () => {
      const fallback = getNormalizedFallbackData();
      return {
        chats: fallback.chats,
        directChats: fallback.directChats
      };
    }
  );

  const chats = (result.data.chats as AppChat[]).filter(
    (chat) => supportedTypes.includes(chat.type) && chat.isHighActivity
  );

  const selectedChat =
    chats.find((chat: AppChat) => chat.id === selectedChatId) ??
    chats.find((chat: AppChat) => !chat.summaryOptOut && chat.unreadCount > 0) ??
    chats.find((chat: AppChat) => !chat.summaryOptOut) ??
    chats[0] ??
    null;

  return {
    chats,
    selectedChat,
    storageMode: result.storageMode,
    excludedDirectChats: result.data.directChats
  };
}

export async function getChatById(chatId: string) {
  const result = await tryDatabase(
    async () => {
      const chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          type: { in: supportedTypes }
        },
        include: {
          messages: {
            orderBy: {
              sentAt: "asc"
            }
          },
          summaries: {
            orderBy: {
              requestedAt: "desc"
            }
          }
        }
      });

      if (!chat) {
        const fallback = getNormalizedFallbackData().chats.find((item) => item.id === chatId);

        if (!fallback) {
          throw new Error("Chat not found");
        }

        return fallback;
      }

      return normalizeChat({
        ...chat,
        type: chat.type as SupportedChatType,
        summaries: chat.summaries.map((summary: RawSummary) => normalizeSummary(summary))
      });
    },
    () => {
      const fallback = getNormalizedFallbackData().chats.find((item) => item.id === chatId);

      if (!fallback) {
        throw new Error("Chat not found");
      }

      return fallback;
    }
  );

  return result.data;
}

export async function persistSummary(input: PersistSummaryInput) {
  const result = await tryDatabase(
    async () => {
      const created = await prisma.summary.create({
        data: {
          chatId: input.chatId,
          coverageLabel: input.coverageLabel,
          requestMode: input.requestMode,
          requestedAt: input.requestedAt ? new Date(input.requestedAt) : new Date(),
          summaryText: input.summaryText,
          keyUpdates: input.keyUpdates,
          decisions: input.decisions,
          actionItems: input.actionItems,
          importantContributors: input.importantContributors,
          sourceMessageCount: input.sourceMessageCount,
          unreadMessageCount: input.unreadMessageCount,
          estimatedTimeSavedMin: input.estimatedTimeSavedMin,
          latencyMs: input.latencyMs,
          simulatedOnDevice: input.simulatedOnDevice,
          triggeredBy: input.triggeredBy
        }
      });

      return normalizeSummary(created);
    },
    () => {
      const store = getFallbackStore();
      const created: AppSummary = {
        id: input.id ?? `summary-${Date.now()}`,
        chatId: input.chatId,
        coverageLabel: input.coverageLabel,
        requestMode: input.requestMode,
        requestedAt: input.requestedAt ?? new Date().toISOString(),
        summaryText: input.summaryText,
        keyUpdates: input.keyUpdates,
        decisions: input.decisions,
        actionItems: input.actionItems,
        importantContributors: input.importantContributors,
        sourceMessageCount: input.sourceMessageCount,
        unreadMessageCount: input.unreadMessageCount,
        estimatedTimeSavedMin: input.estimatedTimeSavedMin,
        latencyMs: input.latencyMs,
        simulatedOnDevice: input.simulatedOnDevice,
        triggeredBy: input.triggeredBy
      };

      store.summaries.unshift(created);
      return created;
    }
  );

  return {
    summary: result.data,
    persisted: result.storageMode === "database"
  };
}

export async function persistFeedback({
  summaryId,
  rating,
  isPrivacyComplaint = false,
  note
}: {
  summaryId: string;
  rating: "UP" | "DOWN";
  isPrivacyComplaint?: boolean;
  note?: string;
}) {
  const result = await tryDatabase(
    async () => {
      const created = await prisma.feedback.create({
        data: {
          summaryId,
          rating,
          isPrivacyComplaint,
          note
        }
      });

      return normalizeFeedback(created);
    },
    () => {
      const store = getFallbackStore();
      const created: AppFeedback = {
        id: `feedback-${Date.now()}`,
        summaryId,
        rating,
        isPrivacyComplaint,
        note,
        createdAt: new Date().toISOString()
      };
      store.feedback.unshift(created);
      return created;
    }
  );

  return {
    feedback: result.data,
    persisted: result.storageMode === "database"
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const result = await tryDatabase(
    async () => {
      const [rawChats, rawSummaries, rawFeedback] = await Promise.all([
        prisma.chat.findMany({
          where: {
            type: { in: supportedTypes },
            isHighActivity: true
          },
          include: {
            messages: {
              orderBy: {
                sentAt: "asc"
              }
            }
          }
        }),
        prisma.summary.findMany({
          orderBy: {
            requestedAt: "desc"
          }
        }),
        prisma.feedback.findMany({
          orderBy: {
            createdAt: "desc"
          }
        })
      ]);

      const chats = rawChats.map((chat: ChatWithMessages) =>
        normalizeChat({
          ...chat,
          type: chat.type as SupportedChatType,
          summaries: []
        })
      );

      if (rawChats.length === 0) {
        const fallback = getNormalizedFallbackData();
        return {
          chats: fallback.chats,
          summaries: fallback.summaries,
          feedback: fallback.feedback
        };
      }

      return {
        chats,
        summaries: rawSummaries.map((summary: RawSummary) => normalizeSummary(summary)),
        feedback: rawFeedback.map((item: RawFeedback) => normalizeFeedback(item))
      };
    },
    () => {
      const fallback = getNormalizedFallbackData();
      return {
        chats: fallback.chats,
        summaries: fallback.summaries,
        feedback: fallback.feedback
      };
    }
  );

  const chats = result.data.chats as AppChat[];
  const summaries = (result.data.summaries as AppSummary[])
    .slice()
    .sort(
      (left: AppSummary, right: AppSummary) =>
        +new Date(right.requestedAt) - +new Date(left.requestedAt)
    );
  const feedback = result.data.feedback as AppFeedback[];

  const summarizedChatIds = new Set(summaries.map((summary: AppSummary) => summary.chatId));
  const usageRate = chats.length === 0 ? 0 : (summarizedChatIds.size / chats.length) * 100;

  const summaryCountsByChat = summaries.reduce<Record<string, number>>(
    (accumulator, summary: AppSummary) => {
      accumulator[summary.chatId] = (accumulator[summary.chatId] ?? 0) + 1;
      return accumulator;
    },
    {}
  );

  const repeatUsageRate =
    summarizedChatIds.size === 0
      ? 0
      : (Object.values(summaryCountsByChat).filter((count) => count > 1).length /
          summarizedChatIds.size) *
        100;

  const estimatedTimeSaved = summaries.reduce(
    (accumulator: number, summary: AppSummary) => accumulator + summary.estimatedTimeSavedMin,
    0
  );

  const postSummaryReplyRate =
    summaries.length === 0
      ? 0
      : (summaries.filter((summary: AppSummary) => {
          const chat = chats.find((item: AppChat) => item.id === summary.chatId);

          if (!chat) {
            return false;
          }

          const summaryAt = +new Date(summary.requestedAt);

          return chat.messages.some(
            (message: AppChat["messages"][number]) =>
              message.sender === "You" &&
              +new Date(message.sentAt) > summaryAt &&
              +new Date(message.sentAt) <= summaryAt + 20 * 60 * 1000
          );
        }).length /
          summaries.length) *
        100;

  const optOutRate =
    chats.length === 0
      ? 0
      : (chats.filter((chat: AppChat) => chat.summaryOptOut).length / chats.length) * 100;

  const privacyComplaints = feedback.filter((item: AppFeedback) => item.isPrivacyComplaint);
  const averageLatency =
    summaries.length === 0
      ? 0
      : summaries.reduce(
          (accumulator: number, summary: AppSummary) => accumulator + summary.latencyMs,
          0
        ) / summaries.length;

  return {
    metrics: [
      {
        label: "Summary usage rate",
        value: `${Math.round(usageRate)}%`,
        detail: "Eligible group and community chats summarized at least once."
      },
      {
        label: "Repeat usage rate",
        value: `${Math.round(repeatUsageRate)}%`,
        detail: "Summarized chats that triggered the action more than once."
      },
      {
        label: "Estimated time saved",
        value: `${estimatedTimeSaved} min`,
        detail: "Cumulative minutes saved across seeded and live prototype summaries."
      },
      {
        label: "Post-summary reply rate",
        value: `${Math.round(postSummaryReplyRate)}%`,
        detail: "Summaries followed by a user reply within 20 minutes."
      },
      {
        label: "Opt-out rate",
        value: `${Math.round(optOutRate)}%`,
        detail: "Supported chats with summaries paused."
      },
      {
        label: "Privacy complaints count",
        value: `${privacyComplaints.length}`,
        detail: "Feedback items explicitly flagged as privacy-related."
      },
      {
        label: "Average summary latency",
        value: `${Math.round(averageLatency)} ms`,
        detail: "Observed end-to-end latency for generated summaries."
      }
    ],
    summariesThisWeek: summaries.slice(0, 5),
    privacyComplaints,
    storageMode: result.storageMode
  };
}