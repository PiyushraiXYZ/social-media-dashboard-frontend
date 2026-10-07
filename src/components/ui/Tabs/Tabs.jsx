export function Tabs({ tabs = [], active, onChange, className = '' }) {
  return (
    <div className={`inline-flex gap-1 rounded-lg bg-slate-100 p-1 ${className}`}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === t.value ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
