import type { DashboardMetric } from "@/lib/types";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="rounded-[28px] border border-pine/10 bg-white/80 p-5 shadow-soft backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine/50">
        {metric.label}
      </p>
      <div className="mt-4 font-[var(--font-heading)] text-4xl font-bold text-pine">
        {metric.value}
      </div>
      <p className="mt-3 text-sm leading-6 text-pine/68">{metric.detail}</p>
    </div>
  );
}
