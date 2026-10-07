import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { useGetRecentPostsQuery } from '../api.js';
import { setRecentPosts } from '../workspaceSlice.js';
import { PATHS } from '../../../routes/routePaths.js';
import { fmtUTC } from '../../../utils/date.js';

export function RecentPostsTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((s) => s.workspace.recentPosts || []);

  const { data, isLoading } = useGetRecentPostsQuery();

  useEffect(() => {
    if (data?.posts) {
      dispatch(setRecentPosts(data.posts));
    }
  }, [data, dispatch]);

  const recent = posts.slice(0, 5);

  const columns = [
    {
      key: 'title',
      title: 'Post / Content',
      render: (r) => (
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-slate-800">
            {r.content_text || r.title || 'Untitled'}
          </div>
          <div className="text-xs text-slate-500">
            Post #{r.id}
            {r.platforms?.length > 0 &&
              ` · ${r.platforms.join(', ')}`}
          </div>
        </div>
      ),
    },
    {
      key: 'dest',
      title: 'Destinations',
      render: (r) => (
        <div className="flex items-center gap-1">
          {(r.platforms || []).map((p) => (
            <PlatformIcon key={p} platform={p} size={12} />
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (r) => <StatusBadge status={r.status || 'Draft'} />,
    },
    {
      key: 'when',
      title: 'Activity / Schedule',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.scheduled_at
            ? fmtUTC(r.scheduled_at)
            : r.updated_at
            ? fmtUTC(r.updated_at)
            : '—'}
        </span>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      render: (r) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PATHS.postEditor(r.id))}
        >
          View →
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Recent posts"
      subtitle="Operational status, not engagement analytics."
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PATHS.posts)}
        >
          View all posts
        </Button>
      }
    >
      {isLoading && (
        <div className="p-6 text-sm text-slate-500">Loading…</div>
      )}

      {!isLoading && recent.length === 0 && (
        <div className="p-6 text-sm text-slate-500">
          No posts yet. Create your first draft.
        </div>
      )}

      {recent.length > 0 && (
        <Table columns={columns} rows={recent} />
      )}
    </Card>
  );
}