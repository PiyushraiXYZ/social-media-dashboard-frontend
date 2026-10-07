import { Table } from '../../../components/ui/Table/Table.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function PostTable({ posts = [] }) {
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
    { key: 'action', title: 'Action', render: () => <Button variant="ghost" size="sm">View →</Button> },
  ];
  return <Table columns={columns} rows={posts} empty="No posts yet. Create your first draft." />;
}
