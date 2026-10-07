import { Progress } from '../../../components/ui/Progress/Progress.jsx';

export function GenerationStages({ stages = [] }) {
  return (
    <ul className="space-y-3">
      {stages.map((s, i) => (
        <li key={i} className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">{s.label}</div>
            <span className={`text-xs ${
              s.state === 'running' ? 'text-purple-600' :
              s.state === 'done' ? 'text-emerald-600' : 'text-slate-500'
            }`}>{s.state}</span>
          </div>
          {s.state === 'running' && <div className="mt-2"><Progress value={40} /></div>}
        </li>
      ))}
    </ul>
  );
}
