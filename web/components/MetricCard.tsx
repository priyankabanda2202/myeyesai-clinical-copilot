export default function MetricCard({
  label,
  value,
  delta,
  loading,
}: {
  label: string;
  value: number;
  delta?: string;
  loading?: boolean;
}) {
  return (
    <div className="glass p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6b8cb8]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{loading ? "—" : value}</p>
      {delta && !loading && value > 0 && (
        <p className="mt-1 text-xs font-medium text-red-400">{delta}</p>
      )}
    </div>
  );
}
