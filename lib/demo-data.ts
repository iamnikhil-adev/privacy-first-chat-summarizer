import type { AppChat, AppFeedback, AppSummary } from "@/lib/types";

const chats: AppChat[] = [
  {
    id: "chat-launch-squad",
    title: "Launch Squad",
    description: "118 people · product launch war room",
    type: "GROUP",
    participantCount: 118,
    isHighActivity: true,
    lastSeenAt: "2026-04-18T09:24:00+05:30",
    simulatedOnDevice: true,
    summaryOptOut: false,
    unreadCount: 8,
    messages: [
      {
        id: "msg-ls-01",
        chatId: "chat-launch-squad",
        sender: "Riya",
        content: "Morning pulse check: demo signups crossed 1,900 overnight.",
        sentAt: "2026-04-18T09:02:00+05:30"
      },
      {
        id: "msg-ls-02",
        chatId: "chat-launch-squad",
        sender: "Kabir",
        content: "The onboarding tooltip bug is fixed in staging. QA is retesting now.",
        sentAt: "2026-04-18T09:08:00+05:30"
      },
      {
        id: "msg-ls-03",
        chatId: "chat-launch-squad",
        sender: "You",
        content: "Please hold homepage copy until the pricing screenshot is updated.",
        sentAt: "2026-04-18T09:18:00+05:30"
      },
      {
        id: "msg-ls-04",
        chatId: "chat-launch-squad",
        sender: "Mia",
        content: "Investor memo draft is in Notion. Need one quote from support before noon.",
        sentAt: "2026-04-18T09:27:00+05:30"
      },
      {
        id: "msg-ls-05",
        chatId: "chat-launch-squad",
        sender: "Kabir",
        content: "Decision: we are shipping the fixed tooltip and not rolling back the new flow.",
        sentAt: "2026-04-18T09:31:00+05:30"
      },
      {
        id: "msg-ls-06",
        chatId: "chat-launch-squad",
        sender: "Riya",
        content: "CTR on the community teaser is 14% so far, much higher than yesterday.",
        sentAt: "2026-04-18T09:36:00+05:30"
      },
      {
        id: "msg-ls-07",
        chatId: "chat-launch-squad",
        sender: "Noah",
        content: "Action item: I will update the launch checklist with the new rollout order by 10:00.",
        sentAt: "2026-04-18T09:40:00+05:30"
      },
      {
        id: "msg-ls-08",
        chatId: "chat-launch-squad",
        sender: "Mia",
        content: "Can someone confirm whether support macros are localized for the waitlist replies?",
        sentAt: "2026-04-18T09:48:00+05:30"
      },
      {
        id: "msg-ls-09",
        chatId: "chat-launch-squad",
        sender: "You",
        content: "I can cover the support quote and review the macros after standup.",
        sentAt: "2026-04-18T09:55:00+05:30"
      },
      {
        id: "msg-ls-10",
        chatId: "chat-launch-squad",
        sender: "Kabir",
        content: "We agreed to lock pricing visuals by 11:30 so marketing can export final assets.",
        sentAt: "2026-04-18T10:02:00+05:30"
      },
      {
        id: "msg-ls-11",
        chatId: "chat-launch-squad",
        sender: "Riya",
        content: "Please flag any blockers before 10:30. The social team is queued up.",
        sentAt: "2026-04-18T10:10:00+05:30"
      }
    ],
    summaries: []
  },
  {
    id: "chat-residents-hub",
    title: "Residents Hub",
    description: "342 people · apartment community notices",
    type: "COMMUNITY",
    participantCount: 342,
    isHighActivity: true,
    lastSeenAt: "2026-04-18T08:46:00+05:30",
    simulatedOnDevice: true,
    summaryOptOut: false,
    unreadCount: 7,
    messages: [
      {
        id: "msg-rh-01",
        chatId: "chat-residents-hub",
        sender: "Admin",
        content: "Reminder: basement parking repaint starts today at 4 PM.",
        sentAt: "2026-04-18T08:04:00+05:30"
      },
      {
        id: "msg-rh-02",
        chatId: "chat-residents-hub",
        sender: "Priya",
        content: "Water pressure is low in Tower C again.",
        sentAt: "2026-04-18T08:21:00+05:30"
      },
      {
        id: "msg-rh-03",
        chatId: "chat-residents-hub",
        sender: "Maintenance",
        content: "The team is checking the booster pump now.",
        sentAt: "2026-04-18T08:38:00+05:30"
      },
      {
        id: "msg-rh-04",
        chatId: "chat-residents-hub",
        sender: "Admin",
        content: "Decision: deliveries for Tower B will use Gate 2 until 6 PM because of resurfacing work.",
        sentAt: "2026-04-18T08:52:00+05:30"
      },
      {
        id: "msg-rh-05",
        chatId: "chat-residents-hub",
        sender: "Aman",
        content: "Please pin the new visitor pass instructions. Guards are still sending guests to the old kiosk.",
        sentAt: "2026-04-18T09:01:00+05:30"
      },
      {
        id: "msg-rh-06",
        chatId: "chat-residents-hub",
        sender: "Maintenance",
        content: "Update: pump issue traced to a faulty valve. Water pressure should normalize in 20 minutes.",
        sentAt: "2026-04-18T09:12:00+05:30"
      },
      {
        id: "msg-rh-07",
        chatId: "chat-residents-hub",
        sender: "Admin",
        content: "Action item: we will share the resurfacing lane map in this thread before lunch.",
        sentAt: "2026-04-18T09:18:00+05:30"
      },
      {
        id: "msg-rh-08",
        chatId: "chat-residents-hub",
        sender: "You",
        content: "Thanks, please include the visitor parking overflow zone too.",
        sentAt: "2026-04-18T09:26:00+05:30"
      },
      {
        id: "msg-rh-09",
        chatId: "chat-residents-hub",
        sender: "Admin",
        content: "Noted. We will add the overflow zone and resend the final map.",
        sentAt: "2026-04-18T09:31:00+05:30"
      }
    ],
    summaries: []
  },
  {
    id: "chat-oss-guild",
    title: "Open Source Guild",
    description: "86 people · community maintainers",
    type: "GROUP",
    participantCount: 86,
    isHighActivity: true,
    lastSeenAt: "2026-04-18T10:06:00+05:30",
    simulatedOnDevice: true,
    summaryOptOut: false,
    unreadCount: 6,
    messages: [
      {
        id: "msg-og-01",
        chatId: "chat-oss-guild",
        sender: "Lena",
        content: "Nightly tests are green again after the adapter patch.",
        sentAt: "2026-04-18T09:33:00+05:30"
      },
      {
        id: "msg-og-02",
        chatId: "chat-oss-guild",
        sender: "Sanjay",
        content: "I merged the issue template cleanup. Docs still need screenshots.",
        sentAt: "2026-04-18T09:46:00+05:30"
      },
      {
        id: "msg-og-03",
        chatId: "chat-oss-guild",
        sender: "You",
        content: "Let's avoid tagging beta users until the rollback note is published.",
        sentAt: "2026-04-18T09:58:00+05:30"
      },
      {
        id: "msg-og-04",
        chatId: "chat-oss-guild",
        sender: "Lena",
        content: "Decision: release freeze stays in place until the migration guide is approved.",
        sentAt: "2026-04-18T10:10:00+05:30"
      },
      {
        id: "msg-og-05",
        chatId: "chat-oss-guild",
        sender: "Sanjay",
        content: "Action item: I will record a 2-minute install walkthrough and drop it in docs.",
        sentAt: "2026-04-18T10:18:00+05:30"
      },
      {
        id: "msg-og-06",
        chatId: "chat-oss-guild",
        sender: "Nia",
        content: "Three contributors asked whether the new config key is backwards compatible.",
        sentAt: "2026-04-18T10:26:00+05:30"
      },
      {
        id: "msg-og-07",
        chatId: "chat-oss-guild",
        sender: "You",
        content: "I will reply in the thread once the migration guide wording is final.",
        sentAt: "2026-04-18T10:34:00+05:30"
      }
    ],
    summaries: []
  },
  {
    id: "chat-fest-ops",
    title: "Fest Operations",
    description: "174 people · event coordination",
    type: "GROUP",
    participantCount: 174,
    isHighActivity: true,
    lastSeenAt: "2026-04-18T09:42:00+05:30",
    simulatedOnDevice: true,
    summaryOptOut: true,
    unreadCount: 5,
    messages: [
      {
        id: "msg-fo-01",
        chatId: "chat-fest-ops",
        sender: "Aisha",
        content: "Vendor wristbands arrived. Sorting starts at 1 PM.",
        sentAt: "2026-04-18T09:11:00+05:30"
      },
      {
        id: "msg-fo-02",
        chatId: "chat-fest-ops",
        sender: "Dev",
        content: "Please keep stage checklist updates in the sheet, not this thread.",
        sentAt: "2026-04-18T09:24:00+05:30"
      },
      {
        id: "msg-fo-03",
        chatId: "chat-fest-ops",
        sender: "Aisha",
        content: "Decision: sponsor booth setup shifts to Hall B because Hall A lost power backup access.",
        sentAt: "2026-04-18T09:49:00+05:30"
      },
      {
        id: "msg-fo-04",
        chatId: "chat-fest-ops",
        sender: "Dev",
        content: "Action item: I will resend the emergency contact sheet to volunteers.",
        sentAt: "2026-04-18T09:55:00+05:30"
      }
    ],
    summaries: []
  }
];

const excludedDirectChats = 1;

const summaries: AppSummary[] = [
  {
    id: "summary-launch-01",
    chatId: "chat-launch-squad",
    coverageLabel: "Unread since last seen",
    requestMode: "SINCE_LAST_SEEN",
    requestedAt: "2026-04-18T09:44:00+05:30",
    summaryText:
      "Launch updates centered on a staging fix, stronger teaser CTR, and a decision to keep the new onboarding flow. The team also assigned checklist and support-copy follow-ups before marketing locks final assets.",
    keyUpdates: [
      "Staging tooltip fix passed QA and the team kept the new onboarding flow live.",
      "Community teaser CTR is outperforming yesterday's campaign.",
      "Investor memo still needs one support quote before noon."
    ],
    decisions: [
      "Ship the tooltip fix instead of rolling back the onboarding flow."
    ],
    actionItems: [
      "Noah will update the launch checklist by 10:00.",
      "Support quote and macro review need coverage after standup."
    ],
    importantContributors: [
      {
        name: "Kabir",
        contribution: "Confirmed the bug fix and called the rollout decision."
      },
      {
        name: "Riya",
        contribution: "Shared the growth signal on teaser performance."
      }
    ],
    sourceMessageCount: 4,
    unreadMessageCount: 8,
    estimatedTimeSavedMin: 6,
    latencyMs: 2100,
    simulatedOnDevice: true,
    triggeredBy: "Demo user"
  },
  {
    id: "summary-launch-02",
    chatId: "chat-launch-squad",
    coverageLabel: "Last 5 unread messages",
    requestMode: "LAST_MESSAGES",
    requestedAt: "2026-04-18T10:08:00+05:30",
    summaryText:
      "The latest launch thread narrowed to support readiness and final asset timing, with pricing visuals locked for marketing's export window.",
    keyUpdates: [
      "Support macros still need a localization check.",
      "Marketing needs pricing visuals locked by 11:30."
    ],
    decisions: [
      "Pricing visuals will be locked by 11:30 for export."
    ],
    actionItems: [
      "Review localized support macros.",
      "Escalate blockers before 10:30."
    ],
    importantContributors: [
      {
        name: "Mia",
        contribution: "Raised support-readiness questions and asset dependencies."
      }
    ],
    sourceMessageCount: 5,
    unreadMessageCount: 8,
    estimatedTimeSavedMin: 5,
    latencyMs: 1820,
    simulatedOnDevice: true,
    triggeredBy: "Demo user"
  },
  {
    id: "summary-residents-01",
    chatId: "chat-residents-hub",
    coverageLabel: "Last 1 hour of unread messages",
    requestMode: "TIME_WINDOW_1H",
    requestedAt: "2026-04-18T09:20:00+05:30",
    summaryText:
      "Residents mostly discussed access changes and a temporary water-pressure issue. Admin confirmed Gate 2 for Tower B deliveries and maintenance expects pressure normalization shortly.",
    keyUpdates: [
      "Tower B deliveries are rerouted to Gate 2 until 6 PM.",
      "Low water pressure in Tower C was traced to a valve issue.",
      "A lane map and updated visitor instructions are being shared."
    ],
    decisions: [
      "Use Gate 2 for Tower B deliveries during resurfacing."
    ],
    actionItems: [
      "Admin will post the resurfacing lane map before lunch."
    ],
    importantContributors: [
      {
        name: "Admin",
        contribution: "Shared the official delivery and access changes."
      },
      {
        name: "Maintenance",
        contribution: "Provided the diagnostic update and ETA."
      }
    ],
    sourceMessageCount: 4,
    unreadMessageCount: 7,
    estimatedTimeSavedMin: 4,
    latencyMs: 2480,
    simulatedOnDevice: false,
    triggeredBy: "Demo user"
  },
  {
    id: "summary-oss-01",
    chatId: "chat-oss-guild",
    coverageLabel: "Unread since last seen",
    requestMode: "SINCE_LAST_SEEN",
    requestedAt: "2026-04-18T10:22:00+05:30",
    summaryText:
      "The maintainer thread is holding the release freeze until docs are ready, with a walkthrough video and migration guidance now on the critical path.",
    keyUpdates: [
      "Release freeze remains in effect pending migration-guide approval.",
      "Contributor questions are centered on backward compatibility."
    ],
    decisions: [
      "Keep the release freeze until migration documentation is approved."
    ],
    actionItems: [
      "Sanjay will record a short install walkthrough for docs."
    ],
    importantContributors: [
      {
        name: "Lena",
        contribution: "Set the release-gating decision."
      },
      {
        name: "Sanjay",
        contribution: "Owns the docs walkthrough follow-up."
      }
    ],
    sourceMessageCount: 3,
    unreadMessageCount: 6,
    estimatedTimeSavedMin: 3,
    latencyMs: 1950,
    simulatedOnDevice: true,
    triggeredBy: "Demo user"
  }
];

const feedback: AppFeedback[] = [
  {
    id: "feedback-01",
    summaryId: "summary-launch-01",
    rating: "UP",
    isPrivacyComplaint: false,
    createdAt: "2026-04-18T09:45:00+05:30"
  },
  {
    id: "feedback-02",
    summaryId: "summary-launch-02",
    rating: "UP",
    isPrivacyComplaint: false,
    createdAt: "2026-04-18T10:10:00+05:30"
  },
  {
    id: "feedback-03",
    summaryId: "summary-residents-01",
    rating: "DOWN",
    isPrivacyComplaint: true,
    note: "Wanted less sender attribution in the community summary.",
    createdAt: "2026-04-18T09:22:00+05:30"
  }
];

for (const chat of chats) {
  chat.summaries = summaries.filter((summary) => summary.chatId === chat.id);
}

export const demoDataset = {
  chats,
  summaries,
  feedback,
  excludedDirectChats
};
