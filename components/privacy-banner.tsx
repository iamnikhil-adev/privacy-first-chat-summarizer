import { ShieldCheck, Sparkles, ToggleRight } from "lucide-react";

export function PrivacyBanner({ storageMode }: { storageMode: "database" | "demo-fallback" }) {
  return (
    <section className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-start gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-pine px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          Privacy First
        </span>
        <p className="max-w-3xl text-sm leading-6 text-pine/75">
          This recruiter demo is explicit about when summarization happens and what is simulated.
          Seeded demo chats power the fallback experience, and the “on-device” setting below is a
          product demo label only, not true local inference.
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-pine/10 bg-mist p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-pine">
            <ShieldCheck className="size-4" />
            User-triggered summaries only
          </div>
          <p className="mt-2 text-sm text-pine/70">No background summaries are generated in v1.</p>
        </div>
        <div className="rounded-2xl border border-pine/10 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-pine">
            <Sparkles className="size-4" />
            No chat data stored beyond this prototype flow
          </div>
          <p className="mt-2 text-sm text-pine/70">
            Storage mode: {storageMode === "database" ? "PostgreSQL + Prisma" : "seeded demo fallback"}.
          </p>
        </div>
        <div className="rounded-2xl border border-pine/10 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-pine">
            <ToggleRight className="size-4" />
            On-device mode simulated
          </div>
          <p className="mt-2 text-sm text-pine/70">
            Transparent demo framing for privacy-first product storytelling.
          </p>
        </div>
      </div>
    </section>
  );
}
