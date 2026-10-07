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

export function PublicationResultPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading, isError, error } =
    useGetPostQuery(postId);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading result…" />
        <Card>
          <Skeleton rows={4} />
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Publication result" />
        <Alert tone="danger" title="Could not load result">
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

  const status = post?.status;
  const platforms = post?.platforms || [];
  const isSuccess = status === 'posted';
  const isFailure = status === 'failed';

  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Result"
        title={
          isSuccess
            ? 'Your story is out there.'
            : isFailure
            ? 'Publishing failed.'
            : 'Publication in progress.'
        }
        subtitle={`Post #${postId} · ${post?.title || 'Publication'}`}
      />

      <div className="mb-4">
        <Alert
          tone={isSuccess ? 'success' : isFailure ? 'danger' : 'info'}
          title={
            isSuccess
              ? 'Published successfully'
              : isFailure
              ? 'Publishing failed'
              : 'Still publishing…'
          }
        >
          {isSuccess && 'Post was delivered to all selected destinations.'}
          {isFailure &&
            (post?.rejection_reason ||
              'Publishing was not successful. Review and retry.')}
          {!isSuccess && !isFailure && 'Publication is still in progress.'}
        </Alert>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Published content snapshot">
            <div className="text-sm font-medium text-slate-800">
              {post?.title || 'Untitled'}
            </div>

            {post?.media_url && (
              <img
                src={post.media_url}
                alt="Published media"
                className="mt-3 w-full rounded-lg border border-slate-200"
              />
            )}

            <p className="mt-3 whitespace-pre-wrap text-xs text-slate-600">
              {post?.content_text}
            </p>

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(`/posts/${postId}/edit`)}
              >
                Open post
              </Button>
              <Button variant="ghost" onClick={() => navigate(PATHS.posts)}>
                Back to posts
              </Button>
              {isFailure && (
                <Button
                  onClick={() => navigate(`/publish/${postId}/confirm`)}
                >
                  Retry
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Destination results">
            <ul className="space-y-3">
              {platforms.map((p) => (
                <li
                  key={p}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={p} />
                    <span className="text-sm capitalize text-slate-800">
                      {p}
                    </span>
                  </div>
                  <Badge
                    tone={
                      isSuccess ? 'success' : isFailure ? 'danger' : 'info'
                    }
                  >
                    {isSuccess
                      ? 'Published'
                      : isFailure
                      ? 'Failed'
                      : 'Pending'}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          {post?.scheduled_at && (
            <Card title="Timing">
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  <strong>Scheduled:</strong>{' '}
                  {new Date(post.scheduled_at).toLocaleString()}
                </div>
                {post?.approved_at && (
                  <div>
                    <strong>Approved:</strong>{' '}
                    {new Date(post.approved_at).toLocaleString()}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}