import { Card } from '../../../components/ui/Card/Card.jsx';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

const rows = [
  { id: 1, title: 'AI and Machine Learning', ref: 'Post 123 · Image', status: 'Awaiting Approval', when: '06 Oct · 09:30' },
  { id: 2, title: 'A practical guide to prompt design', ref: 'Illustrative content', status: 'Scheduled', when: '09 Oct · 15:00 UTC' },
  { id: 3, title: 'Small habits, better learning', ref: 'Illustrative content', status: 'Published', when: '05 Oct · 14:00 UTC' },
  { id: 4, title: 'Behind the learning studio', ref: 'Illustrative content', status: 'Failed', when: '05 Oct · 11:20 UTC' },
  { id: 5, title: 'What will you build next?', ref: 'Illustrative content', status: 'Draft', when: '06 Oct · 08:10' },
];

export function RecentPostsTable() {
  const navigate = useNavigate();
  const columns = [
    { key: 'title', title: 'Post / Content', render: (r) => (
      <div>
        <div className="font-medium text-slate-800">{r.title}</div>
        <div className="text-xs text-slate-500">Northstar Learning · {r.ref}</div>
      </div>
    )},
    { key: 'dest', title: 'Destinations', render: () => <span className="text-xs text-slate-500">f ◉</span> },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'when', title: 'Activity / Schedule', render: (r) => <span className="text-xs text-slate-500">{r.when}</span> },
    { key: 'action', title: 'Action', render: (r) => (
      <Button variant="ghost" size="sm" onClick={() => navigate(PATHS.postEditor(r.id))}>View →</Button>
    )},
  ];
  return (
    <Card
      title="Recent posts"
      subtitle="Operational status, not engagement analytics."
      actions={<Button variant="ghost" size="sm">View all posts</Button>}
    >
      <Table columns={columns} rows={rows} />
    </Card>
  );
}
