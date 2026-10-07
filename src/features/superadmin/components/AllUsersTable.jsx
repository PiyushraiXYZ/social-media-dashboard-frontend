import { useListAllUsersQuery } from '../api.js';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function AllUsersTable() {
  const { data, isLoading, isError, error, refetch } = useListAllUsersQuery();

  if (isLoading) return <Skeleton rows={5} />;

  if (isError) {
    return (
      <Alert tone="danger" title="Could not load users">
        {error?.data?.detail || error?.error || 'Network error'}
      </Alert>
    );
  }

  const users = data?.users || [];

  const columns = [
    {
      key: 'email',
      title: 'Email',
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800">{r.email}</div>
          <div className="text-xs text-slate-500">ID: {r.id}</div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (r) => (
        <Badge
          tone={
            r.role === 'superadmin'
              ? 'danger'
              : r.role === 'admin'
              ? 'warning'
              : 'neutral'
          }
        >
          {r.role || 'user'}
        </Badge>
      ),
    },
    {
      key: 'admin_id',
      title: 'Managed by',
      render: (r) => (
        <span className="text-xs text-slate-500">{r.admin_id || '—'}</span>
      ),
    },
    {
      key: 'last_login',
      title: 'Last login',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.last_login
            ? new Date(r.last_login).toLocaleString()
            : 'Never'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>Total: {users.length} users across platform</span>
        <Button variant="ghost" size="sm" onClick={refetch}>
          Refresh
        </Button>
      </div>
      <Table columns={columns} rows={users} empty="No users yet." />
    </div>
  );
}