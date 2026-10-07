import { Card } from '../../../components/ui/Card/Card.jsx';
import { useSelector } from 'react-redux';

export function StatsCards() {
  const stats = useSelector((s) => s.workspace.stats);

  const items = [
    {
      label: 'Scheduled',
      value: stats.scheduled || 0,
      hint: 'Upcoming posts',
      color: 'text-indigo-600',
    },
    {
      label: 'Published',
      value: stats.posted || 0,
      hint: 'Successfully live',
      color: 'text-emerald-600',
    },
    {
      label: 'Failed',
      value: stats.failed || 0,
      hint: 'Needs attention',
      color: 'text-red-600',
    },
    {
      label: 'Awaiting Approval',
      value:
        (stats.awaiting_hr_approval || 0) +
        (stats.awaiting_admin_approval || 0),
      hint: 'Pending review',
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label}>
          <div className="text-xs text-slate-500">{i.label}</div>
          <div className={`mt-1 text-3xl font-semibold ${i.color}`}>
            {i.value}
          </div>
          <div className="mt-1 text-xs text-slate-500">{i.hint}</div>
        </Card>
      ))}
    </div>
  );
}