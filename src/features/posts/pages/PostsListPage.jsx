import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { useListPostsQuery } from '../api.js';
import { PATHS } from '../../../routes/routePaths.js';
import { fmtUTC } from '../../../utils/date.js';

const FILTERS = [
  { value: '', label: 'All posts' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'awaiting_hr_approval', label: 'HR Approval' },
  { value: 'awaiting_admin_approval', label: 'Admin' },
  { value: 'posted', label: 'Published' },
  { value: 'failed', label: 'Failed' },
  { value: 'draft', label: 'Drafts' },
];

export function PostsListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const { data, isLoading, isError, error, refetch } = useListPostsQuery(filter || undefined);

  const posts = data?.posts || [];

  const columns = [
    {
      key: 'title',
      title: 'Post / Content',
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800 line-clamp-1">
            {r.content_text || 'Untitled'}
          </div>
          <div className="text-xs text-slate-500">
            Post #{r.id} · {r.platforms?.join(', ') || 'No platform'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'scheduled_at',
      title: 'Scheduled',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.scheduled_at ? fmtUTC(r.scheduled_at) : '—'}
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
    <>
      <PageHeader
        eyebrow="04 / Review & Approval"
        title="Every post, from idea to outcome."
        subtitle="Review drafts, confirm approvals, and follow independent destination results."
        actions={
          <Button onClick={() => navigate(PATHS.createPost)}>
            Create post
          </Button>
        }
      />

      <Card
        title="Posts"
        actions={
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        }
      >
        <div className="mb-4">
          <Tabs active={filter} onChange={setFilter} tabs={FILTERS} />
        </div>

        {isLoading && <Skeleton rows={5} />}

        {isError && (
          <Alert tone="danger" title="Could not load posts">
            {error?.data?.detail || error?.error || 'Network error'}
          </Alert>
        )}

        {!isLoading && !isError && (
          <Table
            columns={columns}
            rows={posts}
            empty="No posts yet. Create your first draft."
          />
        )}
      </Card>
    </>
  );
}