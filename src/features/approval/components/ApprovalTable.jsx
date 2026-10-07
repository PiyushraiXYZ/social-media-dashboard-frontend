import { Table } from '../../../components/ui/Table/Table.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

const rows = [
  { id: 1, title: 'AI and Machine Learning', status: 'Awaiting Approval', when: '06 Oct · 09:30' },
  { id: 2, title: 'A practical guide to prompt design', status: 'Scheduled', when: '09 Oct · 15:00 UTC' },
  { id: 3, title: 'Small habits, better learning', status: 'Published', when: '05 Oct · 14:00 UTC' },
  { id: 4, title: 'Behind the learning studio', status: 'Failed', when: '05 Oct · 11:20 UTC' },
  { id: 5, title: 'What will you build next?', status: 'Draft', when: '06 Oct · 08:10' },
];

export function ApprovalTable() {
  const navigate = useNavigate();
  const columns = [
    { key: 'title', title: 'Post / Content', render: (r) => (
      <div>
        <div className="font-medium text-slate-800">{r.title}</div>
        <div className="text-xs text-slate-500">Northstar Learning · Post {r.id}</div>
      </div>
    )},
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'when', title: 'Activity / Schedule', render: (r) => <span className="text-xs text-slate-500">{r.when}</span> },
    { key: 'action', title: 'Action', render: (r) => (
      <Button variant="ghost" size="sm" onClick={() => navigate(PATHS.approvalDecision(r.id))}>View →</Button>
    )},
  ];
  return <Table columns={columns} rows={rows} />;
}
