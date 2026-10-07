import { PlatformIcon } from '../PlatformIcon/PlatformIcon.jsx';

export function DestinationSelector({ accounts = [], selected = [], onChange }) {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <ul className="space-y-2">
      {accounts.map((a) => (
        <li
          key={a.id}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
            selected.includes(a.id) ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <PlatformIcon platform={a.platform} />
            <div>
              <div className="font-medium text-slate-800">{a.label}</div>
              <div className="text-xs text-slate-500">{a.handle}</div>
            </div>
          </div>
          <button
            onClick={() => a.status === 'ready' && toggle(a.id)}
            disabled={a.status !== 'ready'}
            className={`rounded-md px-2.5 py-1 text-xs ${
              a.status === 'ready' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {selected.includes(a.id) ? 'Selected' : a.status === 'ready' ? 'Select' : a.status}
          </button>
        </li>
      ))}
    </ul>
  );
}
