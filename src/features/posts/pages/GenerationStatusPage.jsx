import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Progress } from '../../../components/ui/Progress/Progress.jsx';
import { useLazyGetGenerateStatusQuery } from '../api.js';
import { setGeneration } from '../postsSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

const STAGE_LABELS = [
  { key: 'content', label: 'Content generation' },
  { key: 'image', label: 'Image generation' },
  { key: 'branding', label: 'Branding processing' },
];

export function GenerationStatusPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gen = useSelector((s) => s.posts.generation);

  const [fetchStatus] = useLazyGetGenerateStatusQuery();
  const pollRef = useRef(null);
  const attemptsRef = useRef(0);
  const [localStatus, setLocalStatus] = useState('PENDING');

  useEffect(() => {
    if (!taskId) return;

    const poll = async () => {
      try {
        const res = await fetchStatus(taskId).unwrap();
        console.log('[poll]', res);

        setLocalStatus(res.status);

        if (res.status === 'SUCCESS') {
          clearInterval(pollRef.current);

          const result = res.result || {};
          const postId =
            result.post_id ||
            result.posts?.[0]?.post_id ||
            result.posts?.[0]?.id ||
            result.id;

          dispatch(
            setGeneration({
              status: 'generated',
              taskId,
              result,
              stages: STAGE_LABELS.map((s) => ({ ...s, state: 'done' })),
            })
          );

          if (postId) {
            navigate(`/posts/${postId}/edit`, { replace: true });
          } else {
            navigate(PATHS.posts, { replace: true });
          }
        } else if (res.status === 'FAILURE') {
          clearInterval(pollRef.current);
          dispatch(
            setGeneration({
              status: 'failed',
              taskId,
              error: res.error || 'Generation failed.',
              stages: STAGE_LABELS.map((s) => ({
                ...s,
                state: s.key === 'content' ? 'failed' : 'queued',
              })),
            })
          );
        } else {
          // PENDING / STARTED / RETRY → still running
          attemptsRef.current += 1;
          if (attemptsRef.current > 60) {
            clearInterval(pollRef.current);
            dispatch(
              setGeneration({
                status: 'failed',
                taskId,
                error: 'Generation timed out after ~3 minutes.',
              })
            );
          }
        }
      } catch (err) {
        console.error('[poll error]', err);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => clearInterval(pollRef.current);
  }, [taskId, fetchStatus, dispatch, navigate]);

  const stages = gen.stages?.length
    ? gen.stages
    : STAGE_LABELS.map((s) => ({ ...s, state: 'queued' }));

  const isFailed = gen.status === 'failed';

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Async generation"
        title="Turning your idea into a post."
        subtitle="Generation is running in the background. Your original inputs are preserved."
      />

      {isFailed && (
        <div className="mb-4">
          <Alert tone="danger" title="Generation failed">
            {gen.error || 'Something went wrong.'}
          </Alert>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Generation activity" subtitle={`Task ${taskId}`}>
            <ul className="space-y-3">
              {stages.map((s, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-800">
                      {s.label}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        s.state === 'running'
                          ? 'text-purple-600'
                          : s.state === 'done'
                          ? 'text-emerald-600'
                          : s.state === 'failed'
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {s.state}
                    </span>
                  </div>
                  {s.state === 'running' && (
                    <div className="mt-2">
                      <Progress value={40} />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(PATHS.posts)}
              >
                Back to posts
              </Button>
              {!isFailed && (
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                >
                  Refresh status
                </Button>
              )}
              {isFailed && (
                <Button onClick={() => navigate(PATHS.createPost)}>
                  Try again
                </Button>
              )}
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Current Celery status: <strong>{localStatus}</strong> ·
              Polling every 3s
            </div>
          </Card>
        </div>

        <Card title="Preserved request">
          <div className="text-sm font-medium text-slate-700">
            {gen.request?.title || '—'}
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            <li>
              <strong>Platform:</strong>{' '}
              {gen.request?.platform || '—'}
            </li>
            <li>
              <strong>Image:</strong>{' '}
              {gen.request?.generateImage ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Direction:</strong>{' '}
              {gen.request?.direction || '—'}
            </li>
            <li>
              <strong>Task ID:</strong> {taskId}
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}