export type ChatKind = "GROUP" | "COMMUNITY" | "DIRECT";
export type FeedbackKind = "UP" | "DOWN";

export type AppMessage = {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  sentAt: string;
};

export type AppContributor = {
  name: string;
  contribution: string;
};

export type AppSummary = {
  id: string;
  chatId: string;
  coverageLabel: string;
  requestMode: string;
  requestedAt: string;
  summaryText: string;
  keyUpdates: string[];
  decisions: string[];
  actionItems: string[];
  importantContributors: AppContributor[];
  sourceMessageCount: number;
  unreadMessageCount: number;
  estimatedTimeSavedMin: number;
  latencyMs: number;
  simulatedOnDevice: boolean;
  triggeredBy: string;
};

export type AppFeedback = {
  id: string;
  summaryId: string;
  rating: FeedbackKind;
  isPrivacyComplaint: boolean;
  note?: string | null;
  createdAt: string;
};

export type AppChat = {
  id: string;
  title: string;
  description: string | null;
  type: Exclude<ChatKind, "DIRECT">;
  participantCount: number;
  isHighActivity: boolean;
  lastSeenAt: string | null;
  simulatedOnDevice: boolean;
  summaryOptOut: boolean;
  messages: AppMessage[];
  summaries: AppSummary[];
  unreadCount: number;
};

export type StorageMode = "database" | "demo-fallback";

export type HomePageData = {
  chats: AppChat[];
  selectedChat: AppChat | null;
  storageMode: StorageMode;
  excludedDirectChats: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  summariesThisWeek: AppSummary[];
  privacyComplaints: AppFeedback[];
  storageMode: StorageMode;
};

export type SummaryResponse = {
  summary: AppSummary;
  persisted: boolean;
  provider: "openai" | "demo-fallback";
};
