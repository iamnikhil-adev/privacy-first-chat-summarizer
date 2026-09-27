"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TimerReset,
  TriangleAlert
} from "lucide-react";
import type { AppChat, AppSummary, SummaryResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

type RangeMode = "messages" | "window";
type WindowMode = "1h" | "3h" | "since_last_seen";

function FeedbackButtons({ summaryId }: { summaryId: string }) {
  const [selected, setSelected] = useState<"UP" | "DOWN" | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending || selected !== null}
        onClick={() => {
          startTransition(async () => {
            const rating = "UP";
            const response = await fetch("/api/feedback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ summaryId, rating })
            });

            if (response.ok) {
              setSelected(rating);
            }
          });
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
          selected === "UP"
            ? "border-whatsapp bg-whatsapp text-white"
            : "border-pine/15 bg-white text-pine hover:border-whatsapp"
        )}
      >
        <ThumbsUp className="size-4" />
        Helpful
      </button>

      <button
        type="button"
        disabled={isPending || selected !== null}
        onClick={() => {
          startTransition(async () => {
            const rating = "DOWN";
            const response = await fetch("/api/feedback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ summaryId, rating })
            });

            if (response.ok) {
              setSelected(rating);
            }
          });
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
          selected === "DOWN"
            ? "border-coral bg-coral text-white"
            : "border-pine/15 bg-white text-pine hover:border-coral"
        )}
      >
        <ThumbsDown className="size-4" />
        Needs work
      </button>
    </div>
  );
}

export function SummaryPanel({ chat }: { chat: AppChat }) {
  const [rangeMode, setRangeMode] = useState<RangeMode>("messages");
  const [messageCount, setMessageCount] = useState("8");
  const [windowMode, setWindowMode] = useState<WindowMode>("since_last_seen");
  const [simulatedOnDevice, setSimulatedOnDevice] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AppSummary | null>(chat.summaries[0] ?? null);
  const [recentSummaries, setRecentSummaries] = useState<AppSummary[]>(chat.summaries);
  const [provider, setProvider] = useState<SummaryResponse["provider"] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRangeMode("messages");
    setMessageCount("8");
    setWindowMode("since_last_seen");
    setSimulatedOnDevice(true);
    setError(null);
    setSummary(chat.summaries[0] ?? null);
    setRecentSummaries(chat.summaries);
    setProvider(null);
  }, [chat.id, chat.summaries]);

  const summarize = () => {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId: chat.id,
          mode: rangeMode,
          messageCount: Number(messageCount),
          window: windowMode,
          simulatedOnDevice
        })
      });

      const payload = (await response.json()) as SummaryResponse | { error?: string };

      if (!response.ok || !("summary" in payload)) {
        setError(
          payload && "error" in payload
            ? payload.error ?? "Unable to summarize unread messages."
            : "Unable to summarize unread messages."
        );
        return;
      }

      setSummary(payload.summary);
      setRecentSummaries((current) => [
        payload.summary,
        ...current.filter((item) => item.id !== payload.summary.id)
      ]);
      setProvider(payload.provider);
    });
  };

  const disabled = chat.summaryOptOut || chat.unreadCount === 0;

  const scopeLabel = useMemo(() => {
    if (rangeMode === "messages") {
      return `Last ${messageCount} unread messages`;
    }

    if (windowMode === "1h") return "Last 1 hour";
    if (windowMode === "3h") return "Last 3 hours";
    return "Since last seen";
  }, [messageCount, rangeMode, windowMode]);

  return (
    <section className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/55">
            Summarize unread
          </p>
          <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-bold text-pine">
            Manual, scoped, and transparent
          </h2>
          <p className="mt-2 text-sm leading-6 text-pine/68">
            This prototype summarizes only user-selected unread slices instead of running silently in
            the background.
          </p>
        </div>

        <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-pine">
          No background processing
        </span>
      </div>

      <div className="mt-5 rounded-[24px] border border-pine/10 bg-sand/60 p-4">
        <div className="rounded-2xl border border-pine/10 bg-white px-4 py-3">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-4 text-pine/70" />
            <div className="text-sm text-pine/72">
              <p className="font-medium text-pine">Why this chat qualifies</p>
              <p className="mt-1">
                High activity, {chat.unreadCount} unread messages, and group-level context make this
                a strong summarization candidate.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRangeMode("messages")}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                rangeMode === "messages" ? "bg-pine text-white" : "bg-white text-pine"
              )}
            >
              Last X messages
            </button>

            <button
              type="button"
              onClick={() => setRangeMode("window")}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                rangeMode === "window" ? "bg-pine text-white" : "bg-white text-pine"
              )}
            >
              Time window
            </button>
          </div>

          {rangeMode === "messages" ? (
            <label className="text-sm text-pine/70">
              Summarize the last unread slice
              <select
                value={messageCount}
                onChange={(event) => setMessageCount(event.target.value)}
                className="mt-2 block w-full rounded-2xl border border-pine/15 bg-white px-4 py-3 text-pine outline-none"
              >
                <option value="8">Last 8 unread messages</option>
                <option value="12">Last 12 unread messages</option>
                <option value="20">Last 20 unread messages</option>
              </select>
            </label>
          ) : (
            <label className="text-sm text-pine/70">
              Choose an unread time range
              <select
                value={windowMode}
                onChange={(event) => setWindowMode(event.target.value as WindowMode)}
                className="mt-2 block w-full rounded-2xl border border-pine/15 bg-white px-4 py-3 text-pine outline-none"
              >
                <option value="1h">Last 1 hour</option>
                <option value="3h">Last 3 hours</option>
                <option value="since_last_seen">Since last seen</option>
              </select>
            </label>
          )}

          <label className="flex items-center justify-between rounded-2xl border border-pine/10 bg-white px-4 py-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-pine/70" />
              <div>
                <div className="font-medium text-pine">On-device mode (simulated)</div>
                <div className="text-xs text-pine/60">
                  Product-direction signal only. This prototype does not perform true local inference.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSimulatedOnDevice((current) => !current)}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition",
                simulatedOnDevice ? "bg-whatsapp" : "bg-pine/20"
              )}
            >
              <span
                className={cn(
                  "inline-block size-5 rounded-full bg-white transition",
                  simulatedOnDevice ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </label>

          <div className="rounded-2xl border border-pine/10 bg-white px-4 py-3 text-sm text-pine/70">
            <span className="font-medium text-pine">Current scope:</span> {scopeLabel}
          </div>

          <button
            type="button"
            disabled={isPending || disabled}
            onClick={summarize}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white transition",
              isPending || disabled ? "bg-pine/40" : "bg-pine hover:-translate-y-0.5"
            )}
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <TimerReset className="size-4" />
            )}
            Summarize unread
          </button>
        </div>
      </div>

      {chat.summaryOptOut ? (
        <div className="mt-4 rounded-2xl border border-coral/20 bg-coral/10 p-4 text-sm text-coral">
          Summaries are paused for this chat, which keeps it included in opt-out metrics on the dashboard.
        </div>
      ) : null}

      {!chat.summaryOptOut && chat.unreadCount === 0 ? (
        <div className="mt-4 rounded-2xl border border-pine/10 bg-mist p-4 text-sm text-pine/75">
          No unread messages are available to summarize right now.
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-5 rounded-[24px] border border-pine/10 bg-white p-5">
        {summary ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/55">
                  Latest summary
                </p>
                <h3 className="mt-1 text-lg font-semibold text-pine">{summary.coverageLabel}</h3>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-mist px-3 py-1 text-pine">
                  {summary.sourceMessageCount} messages summarized
                </span>
                <span className="rounded-full bg-mist px-3 py-1 text-pine">
                  {summary.estimatedTimeSavedMin} min saved
                </span>
                <span className="rounded-full bg-mist px-3 py-1 text-pine">
                  {summary.latencyMs} ms
                </span>
                {provider ? (
                  <span className="rounded-full bg-sand px-3 py-1 text-pine/75">
                    {provider === "openai" ? "OpenAI API" : "Demo fallback"}
                  </span>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-pine/80">{summary.summaryText}</p>

            <div className="mt-5 grid gap-4">
              <SummarySection
                title="Key updates"
                items={summary.keyUpdates}
                emptyLabel="No key updates surfaced."
              />
              <SummarySection
                title="Decisions"
                items={summary.decisions}
                emptyLabel="No explicit decisions found."
              />
              <SummarySection
                title="Action items"
                items={summary.actionItems}
                emptyLabel="No action items assigned."
              />

              <div className="rounded-2xl border border-pine/10 bg-sand/50 p-4">
                <h4 className="font-semibold text-pine">Who said what, only when important</h4>
                <div className="mt-3 space-y-2">
                  {summary.importantContributors.length > 0 ? (
                    summary.importantContributors.map((contributor) => (
                      <div
                        key={`${summary.id}-${contributor.name}`}
                        className="rounded-2xl bg-white px-3 py-2 text-sm text-pine/75"
                      >
                        <span className="font-semibold text-pine">{contributor.name}:</span>{" "}
                        {contributor.contribution}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-pine/60">
                      No sender attribution was necessary in this summary.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-pine/10 pt-4">
              <p className="text-sm text-pine/60">Was this summary useful?</p>
              <FeedbackButtons summaryId={summary.id} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-pine/15 bg-sand/40 p-5 text-sm text-pine/65">
            Choose a range and trigger a summary. Nothing runs automatically in the background.
          </div>
        )}
      </div>

      <div className="mt-5 rounded-[24px] border border-pine/10 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-pine">Recent runs</h3>
          <span className="text-xs uppercase tracking-[0.18em] text-pine/50">
            Prototype history
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {recentSummaries.length > 0 ? (
            recentSummaries.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-pine/10 bg-sand/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-pine">{item.coverageLabel}</div>
                  <div className="text-xs text-pine/55">{item.latencyMs} ms</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-pine/70">{item.summaryText}</p>
              </div>
            ))
          ) : (
            <div className="text-sm text-pine/60">No prior summaries for this chat yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function SummarySection({
  title,
  items,
  emptyLabel
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-pine/10 bg-sand/50 p-4">
      <h4 className="font-semibold text-pine">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={`${title}-${item}`}
              className="rounded-2xl bg-white px-3 py-2 text-sm text-pine/75"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-pine/60">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}