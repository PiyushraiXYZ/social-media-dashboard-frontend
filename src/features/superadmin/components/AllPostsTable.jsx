import { useListAllPostsQuery } from '../api.js';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';

export function AllPostsTable() {
  const { data, isLoading, isError, error, refetch } = useListAllPostsQuery();

  if (isLoading) return <Skeleton rows={5} />;

  if (isError) {
    return (
      <Alert tone="danger" title="Could not load posts">
        {error?.data?.detail || error?.error || 'Network error'}
      </Alert>
    );
  }

  const posts = data?.posts || [];

  const columns = [
    {
      key: 'content',
      title: 'Content',
      render: (r) => (
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-slate-800">
            {r.content_text || r.title || 'Untitled'}
          </div>
          <div className="text-xs text-slate-500">
            Post #{r.id} · User #{r.user_id}
          </div>
        </div>
      ),
    },
    {
      key: 'platforms',
      title: 'Platforms',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.platforms?.join(', ') || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (r) => <StatusBadge status={r.status || 'Draft'} />,
    },
    {
      key: 'scheduled',
      title: 'Scheduled',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.scheduled_at
            ? new Date(r.scheduled_at).toLocaleString()
            : '—'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>Total: {posts.length} posts across platform</span>
        <Button variant="ghost" size="sm" onClick={refetch}>
          Refresh
        </Button>
      </div>
      <Table columns={columns} rows={posts} empty="No posts yet." />
    </div>
  );
}