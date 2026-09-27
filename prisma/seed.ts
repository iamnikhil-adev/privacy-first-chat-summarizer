import { PrismaClient } from "@prisma/client";
import { demoDataset } from "../lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.deleteMany();
  await prisma.summary.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();

  for (const chat of demoDataset.chats) {
    await prisma.chat.create({
      data: {
        id: chat.id,
        title: chat.title,
        description: chat.description,
        type: chat.type === "COMMUNITY" ? "COMMUNITY" : "GROUP",
        participantCount: chat.participantCount,
        isHighActivity: chat.isHighActivity,
        unreadCount: chat.unreadCount ?? 0,
        lastSeenAt: chat.lastSeenAt ? new Date(chat.lastSeenAt) : null,
        simulatedOnDevice: chat.simulatedOnDevice,
        summaryOptOut: chat.summaryOptOut,
        messages: {
          create: chat.messages.map((message) => ({
            id: message.id,
            sender: message.sender,
            content: message.content,
            sentAt: new Date(message.sentAt),
          })),
        },
      },
    });
  }

  await prisma.chat.create({
    data: {
      id: "chat-direct-alex",
      title: "Alex",
      description: "Direct message seed that is intentionally excluded in v1.",
      type: "DIRECT",
      participantCount: 2,
      isHighActivity: false,
      unreadCount: 0,
      simulatedOnDevice: true,
      summaryOptOut: false,
      messages: {
        create: [
          {
            id: "msg-direct-01",
            sender: "Alex",
            content: "This direct thread should never appear in the prototype UI.",
            sentAt: new Date("2026-04-18T09:00:00+05:30"),
          },
        ],
      },
    },
  });

  for (const summary of demoDataset.summaries) {
    await prisma.summary.create({
      data: {
        id: summary.id,
        chatId: summary.chatId,
        coverageLabel: summary.coverageLabel,
        requestMode: summary.requestMode,
        requestedAt: new Date(summary.requestedAt),
        summaryText: summary.summaryText,
        keyUpdates: summary.keyUpdates,
        decisions: summary.decisions,
        actionItems: summary.actionItems,
        importantContributors: summary.importantContributors,
        sourceMessageCount: summary.sourceMessageCount,
        unreadMessageCount: summary.unreadMessageCount,
        estimatedTimeSavedMin: summary.estimatedTimeSavedMin,
        latencyMs: summary.latencyMs,
        simulatedOnDevice: summary.simulatedOnDevice,
        triggeredBy: summary.triggeredBy,
      },
    });
  }

  for (const entry of demoDataset.feedback) {
    await prisma.feedback.create({
      data: {
        id: entry.id,
        summaryId: entry.summaryId,
        rating: entry.rating,
        isPrivacyComplaint: entry.isPrivacyComplaint,
        note: entry.note ?? null,
        createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
      },
    });
  }

  console.log("Seeded chats, messages, summaries, feedback, and one excluded direct message thread.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });