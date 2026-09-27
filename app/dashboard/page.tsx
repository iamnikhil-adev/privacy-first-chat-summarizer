import Link from "next/link";
import { ArrowLeft, Shield, Timer } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { formatDateTime } from "@/lib/format";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 lg:px-6 lg:py-10">
      <section className="rounded-[32px] border border-pine/10 bg-white/70 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-pine/70">
              <ArrowLeft className="size-4" />
              Back to chat prototype
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-pine/50">
              Product Dashboard
            </p>
            <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold text-pine">
              Usage, trust, and speed at a glance
            </h1>
            <p className="mt-4 text-lg leading-8 text-pine/72">
              Seeded demo metrics show how a privacy-first summary product can track adoption and
              trust without broadening scope to private 1-to-1 chats.
            </p>
          </div>
          <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-pine/75">
            Storage mode: {data.storageMode === "database" ? "PostgreSQL + Prisma" : "seeded demo fallback"}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center gap-2 text-pine">
            <Timer className="size-4" />
            <h2 className="text-lg font-semibold">Recent summary runs</h2>
          </div>
          <div className="mt-4 space-y-4">
            {data.summariesThisWeek.map((summary) => (
              <div key={summary.id} className="rounded-2xl border border-pine/10 bg-sand/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-pine">{summary.coverageLabel}</div>
                    <div className="text-sm text-pine/60">{summary.chatId}</div>
                  </div>
                  <div className="text-right text-xs text-pine/55">
                    <div>{summary.latencyMs} ms</div>
                    <div>{formatDateTime(summary.requestedAt)}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-pine/72">{summary.summaryText}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center gap-2 text-pine">
            <Shield className="size-4" />
            <h2 className="text-lg font-semibold">Privacy complaints</h2>
          </div>
          <div className="mt-4 space-y-4">
            {data.privacyComplaints.length > 0 ? (
              data.privacyComplaints.map((item) => (
                <div key={item.id} className="rounded-2xl border border-coral/20 bg-coral/10 p-4">
                  <div className="text-sm font-semibold text-coral">Privacy complaint recorded</div>
                  <p className="mt-2 text-sm leading-6 text-coral">
                    {item.note ?? "The user indicated the summary felt too invasive."}
                  </p>
                  <div className="mt-2 text-xs text-coral/80">{formatDateTime(item.createdAt)}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-pine/10 bg-sand/40 p-4 text-sm text-pine/65">
                No privacy complaints have been logged yet in the current prototype data.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
