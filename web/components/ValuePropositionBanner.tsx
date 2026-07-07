import { Clock, DollarSign, TrendingUp } from "lucide-react";

export default function ValuePropositionBanner() {
  return (
    <div className="mb-6 grid grid-cols-3 gap-4">
      {[
        {
          icon: Clock,
          title: "Save 38+ min per case",
          desc: "Automated intake, charting, triage & patient handouts",
          color: "text-live border-live/30 bg-live/5",
        },
        {
          icon: DollarSign,
          title: "Capture more revenue",
          desc: "ICD-10 coding, urgent slot prioritization, workup orders",
          color: "text-gold border-gold/30 bg-gold/5",
        },
        {
          icon: TrendingUp,
          title: "38% more throughput",
          desc: "Staff focus on patients — AI handles documentation",
          color: "text-accent-glow border-accent/30 bg-accent/5",
        },
      ].map(({ icon: Icon, title, desc, color }) => (
        <div key={title} className={`rounded-2xl border p-4 ${color}`}>
          <Icon size={20} className="mb-2" />
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{desc}</p>
        </div>
      ))}
    </div>
  );
}
