import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function PageSelector({ pages = [] }) {
  const [selected, setSelected] = useState(pages[0]?.id);
  return (
    <ul className="space-y-2">
      {pages.map((p) => (
        <li key={p.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
          selected === p.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
        }`}>
          <button className="text-left" onClick={() => p.status === 'Ready' && setSelected(p.id)}>
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-xs text-slate-500">{p.handle}</div>
          </button>
          <div className="flex items-center gap-2">
            {p.linkedInstagram && <Badge tone="info">Linked IG</Badge>}
            <Badge tone={p.status === 'Ready' ? 'success' : 'danger'}>{p.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
