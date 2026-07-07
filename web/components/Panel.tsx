export default function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel ${className}`}>
      <p className="panel-title">{title}</p>
      <div className="text-sm text-slate-300">{children}</div>
    </div>
  );
}
