import { LucideIcon } from "lucide-react";

export default function PremiumMetricCard({
  label,
  value,
  icon: Icon,
  accent = "#3b82f6",
  loading,
  pulse,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: string;
  loading?: boolean;
  pulse?: boolean;
}) {
  return (
    <div
      className={`metric-card ${pulse ? "animate-pulse-soft" : ""}`}
      style={{ "--accent-line": accent } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div
          className="rounded-xl p-2.5"
          style={{ background: `${accent}20`, color: accent }}
        >
          <Icon size={20} />
        </div>
        {pulse && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-critical">
            <span className="h-1.5 w-1.5 rounded-full bg-critical live-pulse" />
            Live
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-4xl font-bold tracking-tight text-white">
        {loading ? "—" : value}
      </p>
    </div>
  );
}
