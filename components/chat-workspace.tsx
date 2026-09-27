import Link from "next/link";
import { ArrowRight, Ban, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import { GroupSidebar } from "@/components/group-sidebar";
import { MessageThread } from "@/components/message-thread";
import { PrivacyBanner } from "@/components/privacy-banner";
import { SummaryPanel } from "@/components/summary-panel";
import type { HomePageData } from "@/lib/types";

export function ChatWorkspace({ data }: { data: HomePageData }) {
  if (!data.selectedChat) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="rounded-[32px] border border-pine/10 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
          <h1 className="font-[var(--font-heading)] text-4xl font-bold text-pine">
            Privacy-First AI Group Chat Summarizer
          </h1>
          <p className="mt-4 text-pine/70">
            No eligible high-activity groups or communities are available in the current dataset.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 lg:px-6 lg:py-10">
      <section className="rounded-[32px] border border-pine/10 bg-white/65 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/55">
              Portfolio Prototype
            </p>
            <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold tracking-tight text-pine sm:text-5xl">
              Privacy-First AI Group Chat Summarizer
            </h1>
            <p className="mt-4 text-lg leading-8 text-pine/72">
              A product prototype designed for unread overload in large groups and communities.
              Instead of summarizing every conversation, it focuses only on high-signal chats where
              important updates, decisions, and action items are easy to miss.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-pine/15 bg-white px-4 py-2 text-sm font-medium text-pine transition hover:-translate-y-0.5"
            >
              <LayoutDashboard className="size-4" />
              View dashboard
            </Link>

            <div className="rounded-full bg-sand px-4 py-2 text-sm text-pine/70">
              {data.excludedDirectChats} direct chat{data.excludedDirectChats === 1 ? "" : "s"} excluded
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <PrivacyBanner storageMode={data.storageMode} />
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <GroupSidebar chats={data.chats} selectedChatId={data.selectedChat.id} />

          <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              <Ban className="size-3.5" />
              v1 exclusion
            </div>
            <p className="mt-3 text-sm leading-6 text-pine/72">
              Direct messages are intentionally excluded so the feature remains focused on crowded,
              high-activity group contexts where summarization creates the most value and the least
              privacy friction.
            </p>

            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pine"
            >
              See how usage and privacy signals are tracked
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-pine/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
              <Sparkles className="size-3.5" />
              Product logic
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-pine/72">
              <p>
                <span className="font-semibold text-pine">Scope:</span> high-activity groups and
                communities only
              </p>
              <p>
                <span className="font-semibold text-pine">Trigger:</span> user-initiated summaries,
                not automatic background analysis
              </p>
              <p>
                <span className="font-semibold text-pine">Output:</span> key updates, decisions,
                action items, and important contributors
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <ShieldCheck className="size-3.5" />
              Trust principle
            </div>

            <p className="mt-3 text-sm leading-6 text-pine/72">
              The prototype is built around privacy-first decision making: summaries are framed as
              explicit user actions, not silent system behavior. This keeps trust central to the
              product experience.
            </p>
          </div>
        </div>

        <MessageThread chat={data.selectedChat} />
        <SummaryPanel chat={data.selectedChat} />
      </section>
    </main>
  );
}