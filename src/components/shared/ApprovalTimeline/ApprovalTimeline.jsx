import { fmtUTC } from '../../../utils/date.js';

export function ApprovalTimeline({ events = [] }) {
  return (
    <ol className="space-y-3">
      {events.map((e, i) => (
        <li key={i} className="flex gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
          <div>
            <div className="text-sm font-medium text-slate-800">{e.label}</div>
            <div className="text-xs text-slate-500">{fmtUTC(e.at)}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
