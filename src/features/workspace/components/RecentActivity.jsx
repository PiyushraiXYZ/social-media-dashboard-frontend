import { Card } from '../../../components/ui/Card/Card.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

const activity = [
  { platform: 'facebook', label: 'Small habits, better learning · 05 Oct', status: 'Published' },
  { platform: 'instagram', label: 'Small habits, better learning · 05 Oct', status: 'Published' },
  { platform: 'instagram', label: 'Behind the learning studio · 05 Oct', status: 'Failed' },
];

export function RecentActivity() {
  return (
    <Card title="Recent platform activity">
      <ul className="space-y-3">
        {activity.map((a, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <PlatformIcon platform={a.platform} />
              <span>{a.label}</span>
            </div>
            <Badge tone={a.status === 'Published' ? 'success' : 'danger'}>{a.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
