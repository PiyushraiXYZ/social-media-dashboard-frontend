import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useGetUpcomingPostsQuery } from '../api.js';
import { setUpcomingPosts } from '../workspaceSlice.js';
import { PATHS } from '../../../routes/routePaths.js';
import { fmtUTC } from '../../../utils/date.js';

export function UpcomingSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const upcomingPosts = useSelector((s) => s.workspace.upcomingPosts);

  const { data, isLoading } = useGetUpcomingPostsQuery();

  useEffect(() => {
    if (data?.upcoming) {
      dispatch(setUpcomingPosts(data.upcoming));
    }
  }, [data, dispatch]);

  const nextPost = upcomingPosts[0];

  return (
    <Card
      title="Upcoming schedule"
      subtitle="Publication dates are shown in UTC."
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PATHS.calendar)}
        >
          Open calendar
        </Button>
      }
    >
      {isLoading && <div className="text-sm text-slate-500">Loading…</div>}

      {!isLoading && upcomingPosts.length === 0 && (
        <Alert tone="info">
          <div className="flex items-center justify-between gap-3">
            <span>No scheduled posts yet.</span>
            <button
              onClick={() => navigate(PATHS.createPost)}
              className="whitespace-nowrap text-sm font-medium text-brand-600 hover:underline"
            >
              Create Post →
            </button>
          </div>
        </Alert>
      )}

      {nextPost && (
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900">
                {nextPost.content || 'Untitled post'}
              </div>
              <div className="text-xs text-slate-500">
                {nextPost.scheduled_at
                  ? fmtUTC(nextPost.scheduled_at, 'EEE, dd MMM · HH:mm')
                  : '—'}
              </div>
            </div>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
              Scheduled
            </span>
          </div>

          {upcomingPosts.length > 1 && (
            <div className="mt-3 text-xs text-slate-500">
              +{upcomingPosts.length - 1} more scheduled
            </div>
          )}
        </div>
      )}
    </Card>
  );
}