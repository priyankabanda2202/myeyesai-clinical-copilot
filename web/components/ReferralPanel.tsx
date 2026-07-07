export default function ReferralPanel({ action }: { action: string | null | undefined }) {
  if (!action) return null;
  return (
    <div className="rounded-lg border border-[#1e4a6f] bg-gradient-to-r from-[#0f2438]/80 to-[#132a42]/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">
        Referral & Care Pathway
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">{action}</p>
    </div>
  );
}
