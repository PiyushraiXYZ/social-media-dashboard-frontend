import { useEffect, useMemo, useState } from 'react';
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

  const [tab, setTab] = useState('');
  const [caption, setCaption] = useState('');

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPostQuery(postId, {
    skip: !postId,
  });


  // ─────────────────────────────────────────────
  // NORMALIZE BACKEND RESPONSE
  // ─────────────────────────────────────────────

  const post = useMemo(() => {
    if (!response) {
      return null;
    }

    /*
     * Support different possible API response shapes:
     *
     * 1. { id, title, platforms, ... }
     * 2. { post: { id, title, platforms, ... } }
     * 3. { data: { id, title, platforms, ... } }
     */

    if (response.post && typeof response.post === 'object') {
      return response.post;
    }

    if (response.data && typeof response.data === 'object') {
      return response.data;
    }

    return response;
  }, [response]);


  // ─────────────────────────────────────────────
  // NORMALIZE PLATFORMS
  // ─────────────────────────────────────────────

  const platforms = useMemo(() => {
    const rawPlatforms = post?.platforms;

    if (!rawPlatforms) {
      return [];
    }

    let normalized = rawPlatforms;

    /*
     * Handle:
     *
     * ["facebook", "linkedin"]
     *
     * and also the old/nested form:
     *
     * [["facebook", "linkedin"]]
     */

    if (
      Array.isArray(normalized) &&
      normalized.length === 1 &&
      Array.isArray(normalized[0])
    ) {
      normalized = normalized[0];
    }

    /*
     * Handle a JSON string if the backend/database
     * returns platforms as a string.
     *
     * Example:
     * '["facebook","linkedin"]'
     */

    if (typeof normalized === 'string') {
      try {
        const parsed = JSON.parse(normalized);

        if (Array.isArray(parsed)) {
          normalized = parsed;
        } else {
          normalized = [normalized];
        }
      } catch {
        normalized = normalized
          .split(',')
          .map((platform) => platform.trim());
      }
    }

    if (!Array.isArray(normalized)) {
      return [];
    }

    return normalized
      .flat(Infinity)
      .filter(
        (platform) =>
          typeof platform === 'string' &&
          platform.trim().length > 0
      )
      .map((platform) => platform.trim().toLowerCase());
  }, [post]);


  // ─────────────────────────────────────────────
  // DEFAULT PLATFORM TAB
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (platforms.length === 0) {
      setTab('');
      return;
    }

    if (!platforms.includes(tab)) {
      setTab(platforms[0]);
    }
  }, [platforms, tab]);


  // ─────────────────────────────────────────────
  // SYNC CAPTION
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!post) {
      return;
    }

    const postCaption =
      post.content_text ||
      post.caption ||
      '';

    setCaption(
      typeof postCaption === 'string'
        ? postCaption
        : ''
    );
  }, [post]);


  // ─────────────────────────────────────────────
  // IMAGE URL
  // ─────────────────────────────────────────────

  const imageUrl = useMemo(() => {
    if (!post) {
      return null;
    }

    const possibleUrls = [
      post.media_url,
      post.image_url,
      post.generated_image_url,
      post.image,
    ];

    const validUrl = possibleUrls.find(
      (url) =>
        typeof url === 'string' &&
        (url.startsWith('http://') ||
          url.startsWith('https://')) &&
        !url.includes('undefined') &&
        !url.includes('null')
    );

    return validUrl || null;
  }, [post]);


  const isValidImageUrl =
    typeof imageUrl === 'string' &&
    (imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://'));


  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <>
        <PageHeader
          eyebrow="03 / Content creation"
          title="Loading post..."
        />

        <Card>
          <Skeleton rows={5} />
        </Card>
      </>
    );
  }


  // ─────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────

  if (isError) {
    const errorMessage =
      error?.data?.detail ||
      error?.data?.message ||
      error?.error ||
      'Unable to load the post.';

    return (
      <>
        <PageHeader
          eyebrow="03 / Content creation"
          title="Could not load post"
        />

        <Alert
          tone="danger"
          title="Could not load post"
        >
          {typeof errorMessage === 'string'
            ? errorMessage
            : 'An unexpected error occurred while loading the post.'}
        </Alert>

        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => navigate(PATHS.posts)}
          >
            Back to posts
          </Button>
        </div>
      </>
    );
  }


  // ─────────────────────────────────────────────
  // POST NOT FOUND
  // ─────────────────────────────────────────────

  if (!post) {
    return (
      <>
        <PageHeader
          eyebrow="03 / Content creation"
          title="Post not found"
        />

        <Alert
          tone="warning"
          title="Post data is unavailable"
        >
          The post could not be found or the server returned
          an empty response.
        </Alert>

        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => navigate(PATHS.posts)}
          >
            Back to posts
          </Button>
        </div>
      </>
    );
  }


  // ─────────────────────────────────────────────
  // SAFE POST VALUES
  // ─────────────────────────────────────────────

  const postTitle =
    typeof post.title === 'string' && post.title.trim()
      ? post.title
      : 'Generated post';

  const postStatus =
    typeof post.status === 'string'
      ? post.status
      : 'Draft';

  const scheduledAt =
    post.scheduled_at ||
    post.schedule_at ||
    post.scheduled_time ||
    null;


  // ─────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────

  const openBrandingEditor = () => {
    navigate(`/posts/${postId}/branding`);
  };

  const openPublishPage = () => {
    navigate(`/publish/${postId}/confirm`);
  };


  // ─────────────────────────────────────────────
  // TAB CONFIGURATION
  // ─────────────────────────────────────────────

  const tabItems = platforms.map((platform) => ({
    value: platform,
    label:
      platform.charAt(0).toUpperCase() +
      platform.slice(1),
  }));


  // ─────────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────────

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Generated → Draft"
        title="Give your idea its final shape."
        subtitle={
          `Post #${postId} · ${postTitle} · ` +
          `Edit each destination's caption before review.`
        }
        actions={
          <Button onClick={openBrandingEditor}>
            Open branding editor
          </Button>
        }
      />


      <div className="grid gap-4 lg:grid-cols-3">

        {/* ─────────────────────────────────────
            LEFT: CONTENT EDITOR
        ───────────────────────────────────── */}

        <div className="lg:col-span-2">

          <Card title="Content editor">

            {platforms.length > 0 ? (
              <>
                <Tabs
                  active={tab}
                  onChange={setTab}
                  tabs={tabItems}
                />

                <div className="mt-4 space-y-2">

                  <div className="text-xs text-slate-500">
                    {tab
                      ? `${tab} caption`
                      : 'Caption'}
                  </div>

                  <textarea
                    rows={14}
                    className="input"
                    value={caption}
                    onChange={(event) =>
                      setCaption(event.target.value)
                    }
                    placeholder="Write your caption..."
                  />

                  <div className="text-xs text-slate-500">
                    {caption.length} characters
                  </div>

                </div>
              </>
            ) : (
              <Alert
                tone="warning"
                title="No platforms selected"
              >
                This post does not contain any publishing
                platforms.
              </Alert>
            )}


            <div className="mt-4 flex flex-wrap gap-2">

              <Button
                variant="ghost"
                onClick={() =>
                  navigate(PATHS.posts)
                }
              >
                Back to posts
              </Button>

              <Button
                variant="ghost"
                onClick={openBrandingEditor}
              >
                Edit branding
              </Button>

              <Button
                onClick={openPublishPage}
              >
                Publish now
              </Button>

            </div>

          </Card>

        </div>


        {/* ─────────────────────────────────────
            RIGHT: MEDIA + STATUS
        ───────────────────────────────────── */}

        <div className="space-y-4">

          {/* MEDIA */}

          <Card title="Media and branding">

            {isValidImageUrl ? (
              <div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                  <img
                    src={imageUrl}
                    alt="Generated media"
                    className="block h-auto w-full"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        'none';
                    }}
                  />

                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(
                        imageUrl,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    Open in new tab
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openBrandingEditor}
                  >
                    Edit branding
                  </Button>

                </div>

              </div>
            ) : (
              <Alert
                tone="warning"
                title="No image available"
              >
                This post has no generated image.
                You can still publish a text-only post.
              </Alert>
            )}

          </Card>


          {/* STATUS */}

          <Card title="Post status">

            <ul className="space-y-3 text-sm">

              <li className="flex items-center justify-between gap-4">

                <span className="text-slate-600">
                  Status
                </span>

                <StatusBadge
                  status={postStatus}
                />

              </li>


              <li className="flex items-start justify-between gap-4">

                <span className="text-slate-600">
                  Platforms
                </span>

                <span className="text-right text-slate-800">

                  {platforms.length > 0
                    ? platforms.join(', ')
                    : 'None'}

                </span>

              </li>


              {scheduledAt && (
                <li className="flex items-start justify-between gap-4">

                  <span className="text-slate-600">
                    Scheduled
                  </span>

                  <span className="text-right text-xs text-slate-800">

                    {new Date(
                      scheduledAt
                    ).toLocaleString()}

                  </span>

                </li>
              )}


              {post.id && (
                <li className="flex items-center justify-between gap-4">

                  <span className="text-slate-600">
                    Post ID
                  </span>

                  <span className="text-slate-800">
                    {post.id}
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