import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { useGetPostQuery } from '../../posts/api.js';
import { PATHS } from '../../../routes/routePaths.js';

function deriveDestinationStatus(post) {
  if (!post) return 'Queued';
  if (post.status === 'posted') return 'Published';
  if (post.status === 'failed') return 'Failed';
  if (post.status === 'posting') return 'Publishing';
  return 'Queued';
}

function statusTone(status) {
  switch (status) {
    case 'Published':
      return 'success';
    case 'Failed':
      return 'danger';
    case 'Publishing':
      return 'progress';
    default:
      return 'info';
  }
}

export function PublicationProgressPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPostQuery(postId, {
    pollingInterval: 2000,
  });

  const isDone =
    post?.status === 'posted' ||
    post?.status === 'failed' ||
    post?.status === 'cancelled';

  const platforms = post?.platforms || [];

  const redirected = useRef(false);
  useEffect(() => {
    if (isDone && !redirected.current) {
      redirected.current = true;
      setTimeout(() => {
        navigate(`/publish/${postId}/result`, { replace: true });
      }, 1500);
    }
  }, [isDone, navigate, postId]);

  if (isLoading) {
    return (
      <>
        <PageHeader
          eyebrow="06 / Publication · Async progress"
          title="Publishing, destination by destination."
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
          eyebrow="06 / Publication · Async progress"
          title="Publishing, destination by destination."
        />
        <Alert tone="danger" title="Could not load publication">
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

  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Async progress"
        title="Publishing, destination by destination."
        subtitle={`Post #${postId} · ${post?.title || 'Publication'}`}
        actions={
          <Button variant="ghost" onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Destination jobs"
            subtitle={`Operation pub_${postId} · Live from backend`}
          >
            {platforms.length === 0 ? (
              <Alert tone="info">No destinations selected.</Alert>
            ) : (
              <ul className="space-y-3">
                {platforms.map((platform) => {
                  const status = deriveDestinationStatus(post);
                  const isPublished = status === 'Published';
                  const isFailed = status === 'Failed';
                  const isPublishing = status === 'Publishing';

                  return (
                    <li
                      key={platform}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100">
                          <PlatformIcon platform={platform} size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-medium capitalize text-slate-800">
                            {platform}
                          </div>
                          <div className="text-xs text-slate-500">
                            {isPublished && 'Post published successfully'}
                            {isPublishing && 'Publishing to platform…'}
                            {isFailed && 'Failed to publish'}
                            {!isPublished &&
                              !isPublishing &&
                              !isFailed &&
                              'Waiting for previous step'}
                          </div>
                        </div>
                      </div>

                      <Badge tone={statusTone(status)}>{status}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <strong>Overall status:</strong>{' '}
              <span className="font-medium text-slate-800">
                {post?.status || '—'}
              </span>
              {!isDone && (
                <span className="ml-2 text-slate-400">· Polling every 2s</span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="ghost" onClick={() => navigate(PATHS.posts)}>
                Back to posts
              </Button>
              {isDone && (
                <Button
                  onClick={() => navigate(`/publish/${postId}/result`)}
                >
                  View result →
                </Button>
              )}
            </div>
          </Card>
        </div>

        <Card title="Content being published">
          <div className="text-sm font-medium text-slate-800">
            {post?.title || 'Untitled'}
          </div>
          <div className="mt-1 text-xs text-slate-500">Post #{postId}</div>

          {post?.media_url && (
            <img
              src={post.media_url}
              alt="Publication media"
              className="mt-3 w-full rounded-lg border border-slate-200"
            />
          )}

          <p className="mt-3 line-clamp-4 text-xs text-slate-600">
            {post?.content_text || '—'}
          </p>
        </Card>
      </div>
    </>
  );
}