export default function Icd10Badge({ codes }: { codes: string | null | undefined }) {
  if (!codes) return null;
  return (
    <div className="rounded-lg border border-border bg-canvas/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b8cb8]">ICD-10 Codes</p>
      <p className="mt-1 font-mono text-sm text-live">{codes}</p>
    </div>
  );
}
