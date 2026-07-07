import clsx from "clsx";

const config: Record<string, { label: string; className: string }> = {
  RED: { label: "HIGH URGENCY", className: "urgency-red" },
  YELLOW: { label: "URGENT", className: "urgency-yellow" },
  GREEN: { label: "ROUTINE", className: "urgency-green" },
};

export default function UrgencyBadge({ urgency }: { urgency: string | null }) {
  if (!urgency) {
    return (
      <div className="panel py-3">
        <span className="text-[#6b8cb8]">Triage pending</span>
      </div>
    );
  }

  const { label, className } = config[urgency] || {
    label: urgency,
    className: "urgency-green",
  };

  return (
    <div className={clsx(className, "font-semibold")}>TRIAGE · {label}</div>
  );
}
