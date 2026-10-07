export function Progress({ value = 0, label }) {
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs text-slate-500"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
