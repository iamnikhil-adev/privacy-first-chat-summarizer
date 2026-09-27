import { demoDataset } from "@/lib/demo-data";
import type { AppChat, AppFeedback, AppSummary } from "@/lib/types";

type StoreShape = {
  chats: AppChat[];
  summaries: AppSummary[];
  feedback: AppFeedback[];
  excludedDirectChats: number;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

declare global {
  // eslint-disable-next-line no-var
  var __chatSummarizerDemoStore__: StoreShape | undefined;
}

function createStore(): StoreShape {
  return {
    chats: clone(demoDataset.chats),
    summaries: clone(demoDataset.summaries),
    feedback: clone(demoDataset.feedback),
    excludedDirectChats: demoDataset.excludedDirectChats
  };
}

export function getFallbackStore() {
  if (!global.__chatSummarizerDemoStore__) {
    global.__chatSummarizerDemoStore__ = createStore();
  }

  return global.__chatSummarizerDemoStore__;
}

export function attachSummaries(chats: AppChat[], summaries: AppSummary[]) {
  return chats.map((chat) => ({
    ...chat,
    summaries: summaries
      .filter((summary) => summary.chatId === chat.id)
      .sort((left, right) => +new Date(right.requestedAt) - +new Date(left.requestedAt))
  }));
}
