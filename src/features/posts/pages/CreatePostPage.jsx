import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Sparkles, Upload, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { FileUpload } from '../../../components/ui/FileUpload/FileUpload.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { useGetPlatformAccountsQuery } from '../../accounts/api.js';
import {
  useGeneratePostMutation,
  useUploadPostMediaMutation,
  useCreatePostMutation,
} from '../api.js';
import { setGeneration } from '../postsSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

const PLATFORMS = ['facebook', 'instagram', 'linkedin'];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultTime() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function CreatePostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ⭐ MODE — 'ai' or 'manual'
  const [mode, setMode] = useState('ai');

  // Common content
  const [title, setTitle] = useState('');
  const [direction, setDirection] = useState('');
  const [caption, setCaption] = useState('');
  const [generateImage, setGenerateImage] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Scheduling
  const [publishMode, setPublishMode] = useState('now');
  const [scheduledDate, setScheduledDate] = useState(todayISO());
  const [scheduledTime, setScheduledTime] = useState(defaultTime());
  const [timezone, setTimezone] = useState('UTC');

  // ⭐ MANUAL MODE — uploaded media
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [serverError, setServerError] = useState('');

  const { data: accountsData, isLoading: accountsLoading } =
    useGetPlatformAccountsQuery();

  const [generatePost, { isLoading: generating }] = useGeneratePostMutation();
  const [uploadPostMedia] = useUploadPostMediaMutation();
  const [createPost, { isLoading: creating }] = useCreatePostMutation();

  const isBusy = generating || creating || isUploading;

  // Accounts list
  const accounts = useMemo(
    () =>
      PLATFORMS.map((p) => {
        const acc = accountsData?.[p] || { connected: false };
        return {
          id: p,
          platform: p,
          label:
            acc.name ||
            acc.username ||
            (p === 'facebook'
              ? 'Facebook Page'
              : p === 'instagram'
              ? 'Instagram Account'
              : 'LinkedIn'),
          handle: acc.page_id || 'Not connected',
          connected: acc.connected,
        };
      }),
    [accountsData]
  );

  // Auto-select first connected
  useEffect(() => {
    if (selectedPlatform || !accountsData) return;
    const first = accounts.find((a) => a.connected);
    if (first) setSelectedPlatform(first.id);
  }, [accountsData, accounts, selectedPlatform]);

  // Compute scheduled_at
  const scheduledAtISO = useMemo(() => {
    if (publishMode === 'now') {
      return new Date(Date.now() + 60 * 1000).toISOString();
    }
    if (!scheduledDate || !scheduledTime) return null;
    try {
      const localStr = `${scheduledDate}T${scheduledTime}:00`;
      const localDate = new Date(localStr);
      if (isNaN(localDate.getTime())) return null;
      if (timezone === 'UTC') {
        const [y, m, d] = scheduledDate.split('-').map(Number);
        const [hh, mm] = scheduledTime.split(':').map(Number);
        return new Date(Date.UTC(y, m - 1, d, hh, mm, 0)).toISOString();
      }
      return localDate.toISOString();
    } catch {
      return null;
    }
  }, [publishMode, scheduledDate, scheduledTime, timezone]);

  const isPastDate = useMemo(() => {
    if (!scheduledAtISO) return false;
    return new Date(scheduledAtISO) < new Date();
  }, [scheduledAtISO]);

  /* ═══ MANUAL MODE — File upload ═══ */
  const handleFileUpload = async (file) => {
    setUploadError('');
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const res = await uploadPostMedia(file).unwrap();
      console.log('[upload] success:', res);
      setUploadedMedia(res);
    } catch (err) {
      console.error('[upload] error:', err);
      const msg =
        err?.data?.detail ||
        err?.error ||
        'Upload failed. Check file size/type.';
      setUploadError(msg);
      setUploadedFile(null);
      setUploadedMedia(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = () => {
    setUploadedFile(null);
    setUploadedMedia(null);
    setUploadError('');
  };

  /* ═══ SUBMIT — AI MODE ═══ */
  const handleGenerateAI = async () => {
    setServerError('');

    if (!title.trim()) {
      setServerError('Please enter a topic / title.');
      return;
    }
    if (!selectedPlatform) {
      setServerError('Select a destination.');
      return;
    }
    if (!accountsData?.[selectedPlatform]?.connected) {
      setServerError(`Connect your ${selectedPlatform} account first.`);
      return;
    }

    const requestBody = {
      title: title.trim(),
      platform: selectedPlatform,
      generate_image: Boolean(generateImage),
      scheduled_at: scheduledAtISO,
    };

    try {
      const res = await generatePost(requestBody).unwrap();
      dispatch(
        setGeneration({
          status: 'queued',
          taskId: res.task_id,
          stages: [
            { label: 'Content generation', state: 'running' },
            { label: 'Image generation', state: 'queued' },
            { label: 'Branding processing', state: 'queued' },
          ],
          request: requestBody,
        })
      );
      navigate(PATHS.generation(res.task_id));
    } catch (err) {
      console.error('[generate] error:', err);
      let message = 'Failed to start AI generation.';
      if (err?.data?.detail) {
        message = Array.isArray(err.data.detail)
          ? err.data.detail.map((d) => `${d.loc?.join('.')}: ${d.msg}`).join(' | ')
          : err.data.detail;
      }
      setServerError(message);
    }
  };

  /* ═══ SUBMIT — MANUAL MODE ═══ */
  const handleCreateManualPost = async () => {
    setServerError('');

    if (!uploadedMedia?.url) {
      setServerError('Please upload an image or video first.');
      return;
    }
    if (!caption.trim()) {
      setServerError('Please write a caption.');
      return;
    }
    if (!selectedPlatform) {
      setServerError('Select a destination.');
      return;
    }
    if (!accountsData?.[selectedPlatform]?.connected) {
      setServerError(`Connect your ${selectedPlatform} account first.`);
      return;
    }

    const payload = {
      content_text: caption.trim(),
      media_url: uploadedMedia.url,
      platforms: [selectedPlatform],
      start_date: scheduledAtISO,
      end_date: null,
      recurrence_type: 'ONE_TIME',
      timezone: timezone === 'UTC' ? 'UTC' : 'local',
    };

    try {
      const res = await createPost(payload).unwrap();
      console.log('[manual post] created:', res);
      const firstPostId = res?.upcoming_posts?.[0]?.post_id;

      if (firstPostId) {
        navigate(`/posts/${firstPostId}/edit`, { replace: true });
      } else {
        navigate(PATHS.posts, { replace: true });
      }
    } catch (err) {
      console.error('[manual post] error:', err);
      let message = 'Failed to create post.';
      if (err?.data?.detail) {
        message = Array.isArray(err.data.detail)
          ? err.data.detail.map((d) => `${d.loc?.join('.')}: ${d.msg}`).join(' | ')
          : err.data.detail;
      }
      setServerError(message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation"
        title="Create a new post."
        subtitle="Use AI to generate content, or upload your own media."
      />

      {serverError && (
        <div className="mb-4">
          <Alert tone="danger" title="Could not create post">
            {serverError}
          </Alert>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* ─── MODE SELECTOR ─── */}
          <Card>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  mode === 'ai'
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-slate-200 bg-white hover:border-brand-300'
                }`}
              >
                <Sparkles
                  size={20}
                  className={mode === 'ai' ? 'text-brand-600' : 'text-slate-400'}
                />
                <div>
                  <div
                    className={`text-sm font-semibold ${
                      mode === 'ai' ? 'text-brand-900' : 'text-slate-800'
                    }`}
                  >
                    AI Generation
                  </div>
                  <div className="text-xs text-slate-500">
                    AI creates image + caption
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  mode === 'manual'
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-slate-200 bg-white hover:border-brand-300'
                }`}
              >
                <Upload
                  size={20}
                  className={
                    mode === 'manual' ? 'text-brand-600' : 'text-slate-400'
                  }
                />
                <div>
                  <div
                    className={`text-sm font-semibold ${
                      mode === 'manual' ? 'text-brand-900' : 'text-slate-800'
                    }`}
                  >
                    Upload My Media
                  </div>
                  <div className="text-xs text-slate-500">
                    Your own image or video
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* ─── AI MODE ─── */}
          {mode === 'ai' && (
            <Card title="Post details">
              <div className="space-y-4">
                <Input
                  label="Topic / title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="AI and Machine Learning"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Creative direction — optional
                  </label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Make AI approachable for curious professionals…"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={generateImage}
                    onChange={(e) => setGenerateImage(e.target.checked)}
                  />
                  Generate an image with AI
                </label>
              </div>
            </Card>
          )}

          {/* ─── MANUAL MODE — Upload ─── */}
          {mode === 'manual' && (
            <Card title="Upload your media">
              <div className="space-y-4">
                {!uploadedMedia ? (
                  <>
                    <FileUpload
                      label={isUploading ? 'Uploading…' : 'Click or drag to upload'}
                      onFile={handleFileUpload}
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                        'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
                      }}
                      maxSize={650 * 1024 * 1024}
                    />
                    <div className="text-xs text-slate-500">
                      Supported: JPEG, PNG, GIF, WebP, MP4, MOV (max 8MB image / 650MB video)
                    </div>
                    {uploadError && <Alert tone="danger">{uploadError}</Alert>}
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-xl border border-slate-200">
                      {uploadedMedia.resource_type === 'video' ? (
                        <video src={uploadedMedia.url} controls className="w-full" />
                      ) : (
                        <img src={uploadedMedia.url} alt="uploaded" className="w-full" />
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500">
                      ✅ Uploaded: {uploadedMedia.format?.toUpperCase()} ·{' '}
                      {uploadedMedia.width}×{uploadedMedia.height}
                      {uploadedMedia.duration && ` · ${uploadedMedia.duration}s`}
                    </div>

                    <Button variant="ghost" size="sm" onClick={handleRemoveMedia}>
                      Replace media
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ─── MANUAL MODE — Caption ─── */}
          {mode === 'manual' && uploadedMedia && (
            <Card title="Write your caption">
              <textarea
                rows={8}
                className="input"
                placeholder="Write a compelling caption for your post…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="mt-2 text-xs text-slate-500">
                {caption.length} characters
              </div>
            </Card>
          )}

          {/* ─── SCHEDULING ─── */}
          <Card title="When to publish?" subtitle="Choose now or pick a future time.">
            <div className="space-y-4">
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                    publishMode === 'now'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="publishMode"
                    value="now"
                    checked={publishMode === 'now'}
                    onChange={() => setPublishMode('now')}
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Publish now
                    </div>
                    <div className="text-xs text-slate-500">
                      Approximately 1 minute from now
                    </div>
                  </div>
                </label>

                <label
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                    publishMode === 'later'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="publishMode"
                    value="later"
                    checked={publishMode === 'later'}
                    onChange={() => setPublishMode('later')}
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Schedule for later
                    </div>
                    <div className="text-xs text-slate-500">
                      Pick a specific date and time
                    </div>
                  </div>
                </label>
              </div>

              {publishMode === 'later' && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      className="input"
                      min={todayISO()}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Time (24h)
                    </label>
                    <input
                      type="time"
                      className="input"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Timezone
                    </label>
                    <select
                      className="input"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="local">Local device time</option>
                    </select>
                  </div>

                  {isPastDate && (
                    <div className="sm:col-span-3">
                      <Alert tone="warning">
                        Selected time is in the past. Pick a future date/time.
                      </Alert>
                    </div>
                  )}
                </div>
              )}

              {scheduledAtISO && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <strong>Will be sent as:</strong>{' '}
                  <code className="text-[11px]">{scheduledAtISO}</code>
                </div>
              )}
            </div>
          </Card>

          {/* ─── ACTIONS ─── */}
          <div className="flex gap-2">
            {mode === 'ai' ? (
              <Button onClick={handleGenerateAI} disabled={isBusy}>
                {generating ? 'Starting…' : 'Generate with AI'}
              </Button>
            ) : (
              <Button
                onClick={handleCreateManualPost}
                disabled={isBusy || !uploadedMedia}
              >
                {creating ? 'Creating…' : 'Create post'}
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate(PATHS.posts)}>
              Cancel
            </Button>
          </div>
        </div>

        {/* ─── DESTINATION ─── */}
        <div>
          <Card title="Publishing destination" subtitle="Click to select an account.">
            {accountsLoading ? (
              <div className="text-sm text-slate-500">Loading accounts…</div>
            ) : (
              <ul className="space-y-2">
                {accounts.map((a) => {
                  const isSelected = selectedPlatform === a.id;
                  return (
                    <li
                      key={a.id}
                      onClick={() => a.connected && setSelectedPlatform(a.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                          : a.connected
                          ? 'border-slate-200 bg-white hover:bg-slate-50'
                          : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={a.platform} />
                        <div>
                          <div className="font-medium text-slate-800">
                            {a.label}
                          </div>
                          <div className="text-xs text-slate-500">{a.handle}</div>
                        </div>
                      </div>
                      <Badge tone={a.connected ? 'success' : 'neutral'}>
                        {a.connected
                          ? isSelected
                            ? 'Selected'
                            : 'Ready'
                          : 'Disconnected'}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 text-xs text-slate-500">
              Need to connect?{' '}
              <button
                className="text-brand-600 font-medium hover:underline"
                onClick={() => navigate(PATHS.accounts)}
              >
                Manage accounts →
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}