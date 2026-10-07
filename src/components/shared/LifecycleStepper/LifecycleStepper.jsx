const stages = ['Generating', 'Generated', 'Draft', 'Awaiting Approval', 'Approved', 'Scheduled', 'Publishing', 'Published'];

export function LifecycleStepper({ current }) {
  const idx = stages.indexOf(current);
  return (
    <ol className="flex flex-wrap gap-2">
      {stages.map((s, i) => (
        <li
          key={s}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            i <= idx ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {s}
        </li>
      ))}
    </ol>
  );
}
