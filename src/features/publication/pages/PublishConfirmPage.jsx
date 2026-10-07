import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { useGetPostQuery } from '../../posts/api.js';
import { usePublishPostMutation } from '../api.js';
import { PATHS } from '../../../routes/routePaths.js';

export function PublishConfirmPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: post, isLoading, isError, error } = useGetPostQuery(postId);
  const [publishPost, { isLoading: publishing }] = usePublishPostMutation();

  const handlePublish = async () => {
    setServerError('');
    try {
      const res = await publishPost(postId).unwrap();
      console.log('[publish] success:', res);
      navigate(`/publish/${postId}/progress`, { replace: true });
    } catch (err) {
      console.error('[publish] error:', err);
      let message = 'Failed to start publishing.';
      if (err?.data?.detail) {
        message = Array.isArray(err.data.detail)
          ? err.data.detail
              .map((d) => `${d.loc?.join('.')}: ${d.msg}`)
              .join(' | ')
          : err.data.detail;
      } else if (err?.error) {
        message = err.error;
      }
      setServerError(message);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          eyebrow="06 / Publication · Final confirmation"
          title="Loading…"
        />
        <Card>
          <Skeleton rows={4} />
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PageHeader
          eyebrow="06 / Publication · Final confirmation"
          title="Confirm publishing"
        />
        <Alert tone="danger" title="Could not load post">
          {error?.data?.detail || error?.error || 'Network error'}
        </Alert>
        <div className="mt-4">
          <Button variant="ghost" onClick={() => navigate(PATHS.posts)}>
            Back to posts
          </Button>
        </div>
      </>
    );
  }

  const platforms = post?.platforms || [];

  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Final confirmation"
        title="Ready when you are."
        subtitle={`Post #${postId} · ${post?.title || 'Publication'}`}
      />

      {serverError && (
        <div className="mb-4">
          <Alert tone="danger" title="Could not publish">
            {serverError}
          </Alert>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ─── LEFT: Preview ─── */}
        <div className="lg:col-span-2">
          <Card title="Final publication review">
            <div className="flex items-start justify-between">
              <div className="text-sm font-medium text-slate-800">
                {post?.title || 'Untitled'}
              </div>
              <StatusBadge status={post?.status || 'Draft'} />
            </div>

            {post?.media_url && (
              <img
                src={post.media_url}
                alt="Publication media"
                className="mt-3 w-full rounded-lg border border-slate-200"
              />
            )}

            <p className="mt-3 whitespace-pre-wrap text-xs text-slate-600">
              {post?.content_text || '—'}
            </p>
          </Card>
        </div>

        {/* ─── RIGHT: Confirm panel ─── */}
        <Card title="Confirm publishing intent">
          <div className="text-xs text-slate-500">
            Selected destinations ({platforms.length})
          </div>

          <ul className="mt-3 space-y-2">
            {platforms.map((p) => (
              <li
                key={p}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={p} />
                  <span className="text-sm capitalize text-slate-800">
                    {p}
                  </span>
                </div>
                <Badge tone="success">Selected</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 text-xs text-slate-500">
            <div>
              Status: <strong>{post?.status || '—'}</strong>
            </div>
            {post?.scheduled_at && (
              <div>
                Scheduled: {new Date(post.scheduled_at).toLocaleString()}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button
              onClick={handlePublish}
              disabled={publishing || platforms.length === 0}
            >
              {publishing
                ? 'Starting…'
                : `Publish to ${platforms.length} destination${
                    platforms.length !== 1 ? 's' : ''
                  }`}
            </Button>
            <Button variant="ghost" onClick={() => navigate(PATHS.posts)}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}