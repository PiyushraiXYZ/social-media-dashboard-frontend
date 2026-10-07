import { useSelector } from 'react-redux';
import { NotificationItem } from './NotificationItem.jsx';

export function NotificationList({ filter }) {
  const list = useSelector((s) => s.notifications.list);
  const shown = list.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    if (filter === 'approval') return n.kind === 'Approval';
    if (filter === 'publishing') return n.kind === 'Success' || n.kind === 'Failure';
    if (filter === 'accounts') return n.kind === 'Account';
    return true;
  });
  return (
    <ul className="divide-y divide-slate-100">
      {shown.map((n) => <NotificationItem key={n.id} notification={n} />)}
    </ul>
  );
}
