import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { NotificationFilters } from '../components/NotificationFilters.jsx';
import { NotificationList } from '../components/NotificationList.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { markAllRead } from '../notificationsSlice.js';

export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch();
  return (
    <>
      <PageHeader
        eyebrow="07 / Workspace feedback · Notifications"
        title="The updates that move work forward."
        subtitle="Approval, account, and publishing notices."
        actions={<Button variant="ghost" onClick={() => dispatch(markAllRead())}>Mark all as read</Button>}
      />
      <Card>
        <NotificationFilters value={filter} onChange={setFilter} />
        <div className="mt-4"><NotificationList filter={filter} /></div>
      </Card>
    </>
  );
}
