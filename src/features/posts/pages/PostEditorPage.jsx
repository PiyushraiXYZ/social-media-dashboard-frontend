import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge.jsx';
import { useGetPostQuery } from '../api.js';
import { PATHS } from '../../../routes/routePaths.js';

export function PostEditorPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('instagram');
  const [caption, setCaption] = useState('');

  const { data: post, isLoading, isError, error } = useGetPostQuery(postId);

  // Sync caption from backend
  useEffect(() => {
    if (post?.content_text) {
      setCaption(post.content_text);
    } else if (post?.caption) {
      setCaption(post.caption);
    }
  }, [post]);

  // Robust image URL extraction
  const imageUrl =
    post?.media_url ||
    post?.image_url ||
    post?.generated_image_url ||
    post?.image ||
    null;

  const isValidImageUrl =
    typeof imageUrl === 'string' &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
    !imageUrl.includes('undefined') &&
    !imageUrl.includes('null');

  const platforms = post?.platforms || ['instagram', 'facebook'];

  if (isLoading) {
    return (
      <>
        <PageHeader
          eyebrow="03 / Content creation"
          title="Loading post…"
        />
        <Card>
          <Skeleton rows={5} />
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PageHeader
          eyebrow="03 / Content creation · Generated → Draft"
          title="Give your idea its final shape."
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

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Generated → Draft"
        title="Give your idea its final shape."
        subtitle={`Post #${postId} · ${
          post?.title || 'Generated post'
        } · Edit each destination's caption before review.`}
        actions={
          <Button onClick={() => navigate(`/posts/${postId}/branding`)}>
            Open branding editor
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ─── LEFT: Content editor ─── */}
        <div className="lg:col-span-2">
          <Card title="Content editor">
            {platforms.length > 0 && (
              <Tabs
                active={tab}
                onChange={setTab}
                tabs={platforms.map((p) => ({
                  value: p,
                  label: p.charAt(0).toUpperCase() + p.slice(1),
                }))}
              />
            )}

            <div className="mt-4 space-y-2">
              <div className="text-xs text-slate-500">{tab} caption</div>
              <textarea
                rows={14}
                className="input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(PATHS.posts)}
              >
                Back to posts
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/posts/${postId}/branding`)}
              >
                Edit branding
              </Button>
              <Button onClick={() => navigate(`/publish/${postId}/confirm`)}>
                Publish now
              </Button>
            </div>
          </Card>
        </div>

        {/* ─── RIGHT: Media + Status ─── */}
        <div className="space-y-4">
          <Card title="Media and branding">
            {isValidImageUrl ? (
              <div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img
                    src={imageUrl}
                    alt="Generated media"
                    className="block w-full h-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<div class="p-6 text-center text-sm text-red-600">Image failed to load.</div>';
                    }}
                  />
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(imageUrl, '_blank')}
                  >
                    Open in new tab
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/posts/${postId}/branding`)}
                  >
                    Edit branding
                  </Button>
                </div>
              </div>
            ) : (
              <Alert tone="warning" title="No image available">
                This post has no generated image. You can still publish a
                text-only draft.
              </Alert>
            )}
          </Card>

          <Card title="Post status">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <StatusBadge status={post?.status || 'Draft'} />
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">Platforms</span>
                <span className="text-slate-800">
                  {platforms.join(', ')}
                </span>
              </li>
              {post?.scheduled_at && (
                <li className="flex justify-between">
                  <span className="text-slate-600">Scheduled</span>
                  <span className="text-xs text-slate-800">
                    {new Date(post.scheduled_at).toLocaleString()}
                  </span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}