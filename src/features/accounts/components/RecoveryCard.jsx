import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function RecoveryCard({ title, status, message, action }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <p className="mt-1 text-xs text-slate-500">{message}</p>
        </div>
        <Badge tone={status === 'Expired' || status === 'Invalid' ? 'danger' : 'warning'}>{status}</Badge>
      </div>
      <div className="mt-3"><Button variant="ghost" size="sm">{action}</Button></div>
    </Card>
  );
}

