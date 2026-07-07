export default function ConfidenceBadge({ pct }: { pct: number }) {
  if (!pct) return null;
  const color =
    pct >= 80 ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" :
    pct >= 60 ? "text-amber-300 border-amber-500/40 bg-amber-500/10" :
    "text-red-300 border-red-500/40 bg-red-500/10";

  return (
    <div className={`inline-flex rounded-lg border px-4 py-2 text-sm font-semibold ${color}`}>
      Clinical Confidence: {pct}%
    </div>
  );
}
