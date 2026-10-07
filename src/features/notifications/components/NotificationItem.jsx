import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { fmtUTC } from '../../../utils/date.js';

export function NotificationItem({ notification }) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-slate-800">{notification.title}</div>
          {notification.unread && <Badge tone="info">Unread</Badge>}
        </div>
        <p className="mt-1 text-sm text-slate-500">{notification.body}</p>
        <div className="mt-1 text-xs text-slate-400">{fmtUTC(notification.at)} · {notification.kind}</div>
      </div>
      <Button variant="ghost" size="sm">View</Button>
    </li>
  );
}
