import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { useGetRecentPostsQuery } from '../api.js';
import { setRecentPosts } from '../workspaceSlice.js';

// ⭐ Pretty label + tone for raw backend status
function prettifyStatus(rawStatus) {
  const map = {
    posted: { label: 'Published', tone: 'success' },
    scheduled: { label: 'Scheduled', tone: 'info' },
    failed: { label: 'Failed', tone: 'danger' },
    expired: { label: 'Expired', tone: 'warning' },
    cancelled: { label: 'Cancelled', tone: 'neutral' },
    skipped: { label: 'Skipped', tone: 'neutral' },
    draft: { label: 'Draft', tone: 'neutral' },
    awaiting_hr_approval: { label: 'HR Approval', tone: 'warning' },
    awaiting_admin_approval: { label: 'Admin Approval', tone: 'warning' },
    posting: { label: 'Publishing', tone: 'progress' },
  };
  return map[rawStatus] || { label: rawStatus || 'Draft', tone: 'neutral' };
}

export function RecentActivity() {
  const dispatch = useDispatch();
  const posts = useSelector((s) => s.workspace.recentPosts || []);

  const { data, isLoading } = useGetRecentPostsQuery();

  useEffect(() => {
    if (data?.posts) {
      dispatch(setRecentPosts(data.posts));
    }
  }, [data, dispatch]);

  // Take most recent 5 posts
  const recent = posts.slice(0, 5);

  return (
    <Card title="Recent platform activity">
      {isLoading && <div className="text-sm text-slate-500">Loading…</div>}

      {!isLoading && recent.length === 0 && (
        <div className="text-sm text-slate-500">No activity yet.</div>
      )}

      {recent.length > 0 && (
        <ul className="space-y-3">
          {recent.map((post) => {
            const platform = post.platforms?.[0] || 'facebook';
            const { label, tone } = prettifyStatus(post.status);

            return (
              <li key={post.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-700">
                  <PlatformIcon platform={platform} />
                  <span className="truncate">
                    {(post.content_text || 'Untitled').slice(0, 55)}
                    {(post.content_text || '').length > 55 ? '…' : ''}
                  </span>
                </div>
                <Badge tone={tone}>{label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}