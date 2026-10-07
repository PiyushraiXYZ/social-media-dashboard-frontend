import { Card } from '../../../components/ui/Card/Card.jsx';
import { useSelector } from 'react-redux';

export function StatsCards() {
  const stats = useSelector((s) => s.workspace.stats);
  const items = [
    { label: 'Scheduled', value: stats.scheduled, hint: 'Next · Fri 09 Oct' },
    { label: 'Published', value: stats.published, hint: 'Latest · Mon 05 Oct' },
    { label: 'Failed', value: stats.failed, hint: 'Review Instagram error' },
    { label: 'Awaiting Approval', value: stats.awaitingApproval, hint: 'AI and Machine Learning' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label}>
          <div className="text-xs text-slate-500">{i.label}</div>
          <div className="mt-1 text-3xl font-semibold text-slate-900">{i.value}</div>
          <div className="mt-1 text-xs text-slate-500">{i.hint}</div>
        </Card>
      ))}
    </div>
  );
}
