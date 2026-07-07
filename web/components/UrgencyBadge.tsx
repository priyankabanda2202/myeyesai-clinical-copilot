import clsx from "clsx";

const config: Record<string, { label: string; short: string; className: string }> = {
  RED: { label: "HIGH URGENCY", short: "CRITICAL", className: "urgency-red" },
  YELLOW: { label: "URGENT", short: "URGENT", className: "urgency-yellow" },
  GREEN: { label: "ROUTINE", short: "ROUTINE", className: "urgency-green" },
};

export default function UrgencyBadge({
  urgency,
  compact = false,
}: {
  urgency: string | null;
  compact?: boolean;
}) {
  if (!urgency) {
    return (
      <div className="panel py-2">
        <span className="text-[#6b8cb8] text-xs">Triage pending</span>
      </div>
    );
  }

  const { label, short, className } = config[urgency] || {
    label: urgency,
    short: urgency,
    className: "urgency-green",
  };

  if (compact) {
    return (
      <span
        className={clsx(
          "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          urgency === "RED" && "bg-critical/20 text-red-300",
          urgency === "YELLOW" && "bg-urgent/20 text-amber-300",
          urgency === "GREEN" && "bg-routine/20 text-emerald-300"
        )}
      >
        {short}
      </span>
    );
  }

  return (
    <div className={clsx(className, "font-semibold text-sm")}>TRIAGE · {label}</div>
  );
}
