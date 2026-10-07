import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useGetPostQuery } from '../api.js';
import { useUpdateOverlayMutation } from '../../brand/api.js';
import { setOverlay } from '../../brand/brandSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const POSITION_CLASSES = {
  'top-left': 'items-start justify-start',
  'top-center': 'items-start justify-center',
  'top-right': 'items-start justify-end',
  'center-left': 'items-center justify-start',
  center: 'items-center justify-center',
  'center-right': 'items-center justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-center': 'items-end justify-center',
  'bottom-right': 'items-end justify-end',
};

export function BrandingEditorPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Brand profile (logo + footer come from here)
  const profile = useSelector((s) => s.brand.profile);
  const footerUrl = useSelector((s) => s.brand.footer_url);
  const overlay = useSelector((s) => s.brand.overlay);

  const logoUrl = profile.logo_url;

  // Load post
  const { data: post, isLoading } = useGetPostQuery(postId);

  // Overlay update mutation
  const [updateOverlay, { isLoading: savingOverlay }] = useUpdateOverlayMutation();

  // Local overlay state
  const [overlayText, setOverlayText] = useState(overlay?.text || '');
  const [overlayPosition, setOverlayPosition] = useState(
    overlay?.position || 'top-center'
  );
  const [overlaySize, setOverlaySize] = useState(
    overlay?.text_size || 40
  );

  const [feedback, setFeedback] = useState(null);

  // Sync from Redux on load
  useEffect(() => {
    if (overlay) {
      setOverlayText(overlay.text || '');
      setOverlayPosition(overlay.position || 'top-center');
      setOverlaySize(overlay.text_size || 40);
    }
  }, [overlay]);

  // Post media
  const postMediaUrl = post?.media_url || post?.image_url;

  const positionClass = POSITION_CLASSES[overlayPosition] || POSITION_CLASSES['top-center'];

  const handleSaveOverlay = async () => {
    setFeedback(null);
    try {
      const res = await updateOverlay({
        text: overlayText,
        position: overlayPosition,
        text_size: Number(overlaySize) || 40,
      }).unwrap();

      // Sync to Redux
      dispatch(
        setOverlay({
          text: res.overlay_text || overlayText,
          position: res.overlay_position || overlayPosition,
          text_size: res.overlay_text_size || Number(overlaySize),
        })
      );

      setFeedback({
        tone: 'success',
        message: 'Overlay settings saved ✅',
      });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Save failed',
      });
    }
  };

  const handleReset = () => {
    setOverlayText(overlay?.text || '');
    setOverlayPosition(overlay?.position || 'top-center');
    setOverlaySize(overlay?.text_size || 40);
    setFeedback(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Image branding"
        title="Make it unmistakably yours."
        subtitle={`Post #${postId} · Customize the text overlay on your final media.`}
        actions={
          <Button variant="ghost" onClick={() => navigate(`/posts/${postId}/edit`)}>
            Back to editor
          </Button>
        }
      />

      {feedback && (
        <div className="mb-4">
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ─── LEFT: Live Preview ─── */}
        <div className="lg:col-span-2">
          <Card
            title="Final media"
            subtitle="Layered preview · Custom text overlay"
          >
            {isLoading && (
              <div className="text-sm text-slate-500">Loading…</div>
            )}

            {!isLoading && !postMediaUrl && (
              <Alert tone="info" title="No media">
                This post has no image. Branding is only available for
                image posts.
              </Alert>
            )}

            {postMediaUrl && (
              <div className="space-y-4">
                {/* Live preview canvas */}
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                  {/* Base image */}
                  <img
                    src={postMediaUrl}
                    alt="post media"
                    className="block w-full"
                  />

                  {/* Logo overlay (top-left) */}
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="logo"
                      className="absolute left-4 top-4 h-10 w-auto object-contain drop-shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  {/* Custom text overlay */}
                  {overlayText && (
                    <div
                      className={`pointer-events-none absolute inset-0 flex p-8 ${positionClass}`}
                    >
                      <div
                        className="text-center font-bold text-white drop-shadow-lg"
                        style={{
                          fontSize: `${overlaySize}px`,
                          lineHeight: 1.1,
                        }}
                      >
                        {overlayText}
                      </div>
                    </div>
                  )}

                  {/* Footer overlay (bottom) */}
                  {footerUrl && (
                    <div className="absolute bottom-0 left-0 right-0">
                      <img
                        src={footerUrl}
                        alt="footer"
                        className="h-12 w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset changes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/posts/${postId}/edit`)}
                  >
                    Back to editor
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Media layers info */}
          {postMediaUrl && (
            <Card title="Media layers" className="mt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-700">
                    Custom text · {overlayText || '—'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {overlayPosition} · {overlaySize} px
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-700">
                    Logo · {profile.brand_name || 'Brand logo'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {logoUrl ? 'Applied' : 'Not set'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-700">
                    Footer · Brand footer
                  </span>
                  <span className="text-xs text-slate-500">
                    {footerUrl ? 'Applied' : 'Not set'}
                  </span>
                </li>
              </ul>

              <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-800">
                💡 <strong>Logo & footer settings</strong> are managed in{' '}
                <button
                  className="font-medium underline"
                  onClick={() => navigate(PATHS.brandSettings)}
                >
                  Brand Settings
                </button>
                . Changes there apply to all your posts.
              </div>
            </Card>
          )}
        </div>

        {/* ─── RIGHT: Overlay Controls Only ─── */}
        <div>
          <Card title="Text overlay" subtitle="Customize text on this post only.">
            <div className="space-y-4">
              {/* Text input */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Custom text
                </label>
                <input
                  type="text"
                  className="input"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Build. Learn. Grow."
                />
              </div>

              {/* Position */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Text position
                </label>
                <select
                  className="input"
                  value={overlayPosition}
                  onChange={(e) => setOverlayPosition(e.target.value)}
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text size */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Text size · text_size
                </label>
                <input
                  type="number"
                  className="input"
                  min={10}
                  max={120}
                  value={overlaySize}
                  onChange={(e) => setOverlaySize(e.target.value)}
                />
              </div>

              {/* Save */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveOverlay}
                  disabled={savingOverlay}
                  className="flex-1 justify-center"
                >
                  {savingOverlay ? 'Saving…' : 'Save overlay'}
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              </div>

              <div className="text-xs text-slate-500">
                Overlay text is <strong>post-specific</strong>. It doesn't
                affect other posts.
              </div>
            </div>
          </Card>

          {/* Info card: Where to change logo/footer */}
          <Card title="Want to change logo or footer?" className="mt-4">
            <p className="text-xs text-slate-600">
              Logo and footer are managed globally in{' '}
              <strong>Brand Settings</strong>. Update them once and they
              apply to all your posts.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => navigate(PATHS.brandSettings)}
            >
              Open Brand Settings →
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}