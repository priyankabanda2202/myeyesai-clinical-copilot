export default function DemoBanner() {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent px-4 py-3">
      <span className="mt-0.5 text-lg">🩺</span>
      <div className="text-sm text-slate-300">
        <span className="font-semibold text-gold">Stakeholder evaluation environment.</span>{" "}
        Synthetic cases only — no PHI. Real-time hospital workflows demonstrated for ophthalmology
        CDS review. All outputs require licensed physician verification.
      </div>
    </div>
  );
}
