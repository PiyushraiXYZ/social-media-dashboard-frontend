import { useState, useMemo } from 'react';

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


const PLATFORMS = [
  'facebook',
  'instagram',
  'linkedin',
];


function todayISO() {
  return new Date().toISOString().slice(0, 10);
}


function defaultTime() {
  const date = new Date(
    Date.now() + 60 * 60 * 1000
  );

  const hours = String(
    date.getHours()
  ).padStart(2, '0');

  const minutes = String(
    date.getMinutes()
  ).padStart(2, '0');

  return `${hours}:${minutes}`;
}


export function CreatePostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================================================
  // MODE
  // =========================================================

  const [mode, setMode] = useState('ai');

  // =========================================================
  // CONTENT
  // =========================================================

  const [title, setTitle] = useState('');
  const [direction, setDirection] = useState('');
  const [caption, setCaption] = useState('');
  const [generateImage, setGenerateImage] =
    useState(true);

  // Multiple platform selection
  const [selectedPlatforms, setSelectedPlatforms] =
    useState([]);

  // =========================================================
  // SCHEDULING
  // =========================================================

  const [publishMode, setPublishMode] =
    useState('now');

  const [scheduledDate, setScheduledDate] =
    useState(todayISO());

  const [scheduledTime, setScheduledTime] =
    useState(defaultTime());

  const [timezone, setTimezone] =
    useState('UTC');

  // =========================================================
  // MANUAL POST
  // =========================================================

  const [uploadedFile, setUploadedFile] =
    useState(null);

  const [uploadedMedia, setUploadedMedia] =
    useState(null);

  const [uploadError, setUploadError] =
    useState('');

  const [isUploading, setIsUploading] =
    useState(false);

  // =========================================================
  // ERROR
  // =========================================================

  const [serverError, setServerError] =
    useState('');

  // =========================================================
  // SOCIAL ACCOUNTS
  // =========================================================

  const {
    data: accountsData,
    isLoading: accountsLoading,
  } = useGetPlatformAccountsQuery();

  // =========================================================
  // API
  // =========================================================

  const [
    generatePost,
    { isLoading: generating },
  ] = useGeneratePostMutation();

  const [
    uploadPostMedia,
  ] = useUploadPostMediaMutation();

  const [
    createPost,
    { isLoading: creating },
  ] = useCreatePostMutation();

  const isBusy =
    generating ||
    creating ||
    isUploading;

  // =========================================================
  // ACCOUNT LIST
  // =========================================================

  const accounts = useMemo(() => {
    return PLATFORMS.map((platform) => {
      const account =
        accountsData?.[platform] || {
          connected: false,
        };

      return {
        id: platform,
        platform,

        label:
          account.name ||
          account.username ||
          (
            platform === 'facebook'
              ? 'Facebook Page'
              : platform === 'instagram'
                ? 'Instagram Account'
                : 'LinkedIn'
          ),

        handle:
          account.page_id ||
          account.email ||
          'Not connected',

        connected: Boolean(
          account.connected
        ),
      };
    });
  }, [accountsData]);

  // =========================================================
  // SCHEDULED DATE/TIME
  // =========================================================

  const scheduledAtISO = useMemo(() => {
    if (publishMode === 'now') {
      return new Date(
        Date.now() + 60 * 1000
      ).toISOString();
    }

    if (
      !scheduledDate ||
      !scheduledTime
    ) {
      return null;
    }

    try {
      const localDate = new Date(
        `${scheduledDate}T${scheduledTime}:00`
      );

      if (
        Number.isNaN(
          localDate.getTime()
        )
      ) {
        return null;
      }

      if (timezone === 'UTC') {
        const [
          year,
          month,
          day,
        ] = scheduledDate
          .split('-')
          .map(Number);

        const [
          hours,
          minutes,
        ] = scheduledTime
          .split(':')
          .map(Number);

        return new Date(
          Date.UTC(
            year,
            month - 1,
            day,
            hours,
            minutes,
            0
          )
        ).toISOString();
      }

      return localDate.toISOString();
    } catch {
      return null;
    }
  }, [
    publishMode,
    scheduledDate,
    scheduledTime,
    timezone,
  ]);

  // =========================================================
  // CHECK PAST DATE
  // =========================================================

  const isPastDate = useMemo(() => {
    if (
      publishMode !== 'later' ||
      !scheduledAtISO
    ) {
      return false;
    }

    return (
      new Date(
        scheduledAtISO
      ).getTime() < Date.now()
    );
  }, [
    publishMode,
    scheduledAtISO,
  ]);

  // =========================================================
  // PLATFORM SELECTION
  // =========================================================

  const togglePlatform = (platform) => {
    const account =
      accountsData?.[platform];

    if (!account?.connected) {
      return;
    }

    setSelectedPlatforms(
      (current) => {
        if (
          current.includes(platform)
        ) {
          return current.filter(
            (item) =>
              item !== platform
          );
        }

        return [
          ...current,
          platform,
        ];
      }
    );

    setServerError('');
  };

  // =========================================================
  // VALIDATE PLATFORMS
  // =========================================================

  const validatePlatforms = () => {
    if (
      selectedPlatforms.length === 0
    ) {
      setServerError(
        'Select at least one destination.'
      );

      return false;
    }

    const disconnectedPlatform =
      selectedPlatforms.find(
        (platform) =>
          !accountsData?.[platform]
            ?.connected
      );

    if (disconnectedPlatform) {
      setServerError(
        `Connect your ${disconnectedPlatform} account first.`
      );

      return false;
    }

    return true;
  };

  // =========================================================
  // UPLOAD MEDIA
  // =========================================================

  const handleFileUpload = async (
    file
  ) => {
    setUploadError('');
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const response =
        await uploadPostMedia(
          file
        ).unwrap();

      console.log(
        '[upload] success:',
        response
      );

      setUploadedMedia(
        response
      );
    } catch (error) {
      console.error(
        '[upload] error:',
        error
      );

      const message =
        error?.data?.detail ||
        error?.error ||
        'Upload failed. Check file size/type.';

      setUploadError(message);
      setUploadedFile(null);
      setUploadedMedia(null);
    } finally {
      setIsUploading(false);
    }
  };

  // =========================================================
  // REMOVE MEDIA
  // =========================================================

  const handleRemoveMedia = () => {
    setUploadedFile(null);
    setUploadedMedia(null);
    setUploadError('');
  };

  // =========================================================
  // AI GENERATION
  // =========================================================

  const handleGenerateAI = async () => {
    setServerError('');

    if (!title.trim()) {
      setServerError(
        'Please enter a topic / title.'
      );

      return;
    }

    if (!validatePlatforms()) {
      return;
    }

    if (!scheduledAtISO) {
      setServerError(
        'Please select a valid publish date and time.'
      );

      return;
    }

    if (isPastDate) {
      setServerError(
        'Selected time is in the past. Pick a future date/time.'
      );

      return;
    }

    /*
     * IMPORTANT:
     *
     * Backend expects:
     *
     * platforms: ["facebook", "linkedin"]
     *
     * NOT:
     *
     * platform: [...]
     *
     * NOT:
     *
     * platforms: [["facebook", "linkedin"]]
     */

    const requestBody = {
      title: title.trim(),

      platforms: [
        ...selectedPlatforms,
      ],

      generate_image:
        Boolean(generateImage),

      scheduled_at:
        scheduledAtISO,
    };

    console.log(
      '[generate] request body:',
      JSON.stringify(
        requestBody,
        null,
        2
      )
    );

    try {
      const response =
        await generatePost(
          requestBody
        ).unwrap();

      console.log(
        '[generate] success:',
        response
      );

      if (!response?.task_id) {
        throw new Error(
          'Backend did not return a task_id.'
        );
      }

      dispatch(
        setGeneration({
          status: 'queued',

          taskId:
            response.task_id,

          stages: [
            {
              label:
                'Content generation',
              state: 'running',
            },
            {
              label:
                'Image generation',
              state: 'queued',
            },
            {
              label:
                'Branding processing',
              state: 'queued',
            },
          ],

          request:
            requestBody,
        })
      );

      navigate(
        PATHS.generation(
          response.task_id
        )
      );
    } catch (error) {
      console.error(
        '[generate] error:',
        error
      );

      let message =
        'Failed to start AI generation.';

      if (
        error?.data?.detail
      ) {
        message =
          Array.isArray(
            error.data.detail
          )
            ? error.data.detail
                .map(
                  (detail) =>
                    `${detail.loc?.join('.')}: ${detail.msg}`
                )
                .join(' | ')
            : error.data.detail;
      } else if (
        error?.message
      ) {
        message =
          error.message;
      }

      setServerError(
        message
      );
    }
  };

  // =========================================================
  // MANUAL CREATE POST
  // =========================================================

  const handleCreateManualPost =
    async () => {
      setServerError('');

      if (!uploadedMedia?.url) {
        setServerError(
          'Please upload an image or video first.'
        );

        return;
      }

      if (!caption.trim()) {
        setServerError(
          'Please write a caption.'
        );

        return;
      }

      if (!validatePlatforms()) {
        return;
      }

      if (!scheduledAtISO) {
        setServerError(
          'Please select a valid publish date and time.'
        );

        return;
      }

      if (isPastDate) {
        setServerError(
          'Selected time is in the past. Pick a future date/time.'
        );

        return;
      }

      const payload = {
        content_text:
          caption.trim(),

        media_url:
          uploadedMedia.url,

        platforms: [
          ...selectedPlatforms,
        ],

        start_date:
          scheduledAtISO,

        end_date: null,

        recurrence_type:
          'ONE_TIME',

        timezone:
          timezone === 'UTC'
            ? 'UTC'
            : 'local',
      };

      console.log(
        '[manual post] request body:',
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      try {
        const response =
          await createPost(
            payload
          ).unwrap();

        console.log(
          '[manual post] created:',
          response
        );

        const firstPostId =
          response
            ?.upcoming_posts?.[0]
            ?.post_id;

        if (firstPostId) {
          navigate(
            `/posts/${firstPostId}/edit`,
            {
              replace: true,
            }
          );
        } else {
          navigate(
            PATHS.posts,
            {
              replace: true,
            }
          );
        }
      } catch (error) {
        console.error(
          '[manual post] error:',
          error
        );

        let message =
          'Failed to create post.';

        if (
          error?.data?.detail
        ) {
          message =
            Array.isArray(
              error.data.detail
            )
              ? error.data.detail
                  .map(
                    (detail) =>
                      `${detail.loc?.join('.')}: ${detail.msg}`
                  )
                  .join(' | ')
              : error.data.detail;
        } else if (
          error?.message
        ) {
          message =
            error.message;
        }

        setServerError(
          message
        );
      }
    };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation"
        title="Create a new post."
        subtitle="Use AI to generate content, or upload your own media."
      />

      {serverError && (
        <div className="mb-4">
          <Alert
            tone="danger"
            title="Could not create post"
          >
            {serverError}
          </Alert>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="space-y-4 lg:col-span-2">

          {/* MODE SELECTOR */}

          <Card>
            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setMode('ai');
                  setServerError('');
                }}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  mode === 'ai'
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-slate-200 bg-white hover:border-brand-300'
                }`}
              >
                <Sparkles
                  size={20}
                  className={
                    mode === 'ai'
                      ? 'text-brand-600'
                      : 'text-slate-400'
                  }
                />

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      mode === 'ai'
                        ? 'text-brand-900'
                        : 'text-slate-800'
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
                onClick={() => {
                  setMode('manual');
                  setServerError('');
                }}
                className={`flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  mode === 'manual'
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-slate-200 bg-white hover:border-brand-300'
                }`}
              >
                <Upload
                  size={20}
                  className={
                    mode === 'manual'
                      ? 'text-brand-600'
                      : 'text-slate-400'
                  }
                />

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      mode === 'manual'
                        ? 'text-brand-900'
                        : 'text-slate-800'
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

          {/* ===================================================
              AI MODE
          ==================================================== */}

          {mode === 'ai' && (
            <Card title="Post details">

              <div className="space-y-4">

                <Input
                  label="Topic / title"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
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
                    onChange={(event) =>
                      setDirection(
                        event.target.value
                      )
                    }
                  />

                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">

                  <input
                    type="checkbox"
                    checked={generateImage}
                    onChange={(event) =>
                      setGenerateImage(
                        event.target.checked
                      )
                    }
                  />

                  Generate an image with AI

                </label>

              </div>

            </Card>
          )}

          {/* ===================================================
              MANUAL MODE - UPLOAD
          ==================================================== */}

          {mode === 'manual' && (
            <Card title="Upload your media">

              <div className="space-y-4">

                {!uploadedMedia ? (
                  <>
                    <FileUpload
                      label={
                        isUploading
                          ? 'Uploading…'
                          : 'Click or drag to upload'
                      }
                      onFile={
                        handleFileUpload
                      }
                      accept={{
                        'image/*': [
                          '.png',
                          '.jpg',
                          '.jpeg',
                          '.gif',
                          '.webp',
                        ],
                        'video/*': [
                          '.mp4',
                          '.mov',
                          '.avi',
                          '.mkv',
                        ],
                      }}
                      maxSize={
                        650 *
                        1024 *
                        1024
                      }
                    />

                    <div className="text-xs text-slate-500">
                      Supported: JPEG, PNG,
                      GIF, WebP, MP4, MOV
                    </div>

                    {uploadError && (
                      <Alert tone="danger">
                        {uploadError}
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">

                    <div className="relative overflow-hidden rounded-xl border border-slate-200">

                      {uploadedMedia.resource_type ===
                      'video' ? (
                        <video
                          src={
                            uploadedMedia.url
                          }
                          controls
                          className="w-full"
                        />
                      ) : (
                        <img
                          src={
                            uploadedMedia.url
                          }
                          alt="uploaded"
                          className="w-full"
                        />
                      )}

                      <button
                        type="button"
                        onClick={
                          handleRemoveMedia
                        }
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>

                    </div>

                    <div className="text-xs text-slate-500">

                      Uploaded:{' '}

                      {uploadedMedia.format?.toUpperCase()}

                      {' · '}

                      {uploadedMedia.width}×
                      {uploadedMedia.height}

                      {uploadedMedia.duration &&
                        ` · ${uploadedMedia.duration}s`}

                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={
                        handleRemoveMedia
                      }
                    >
                      Replace media
                    </Button>

                  </div>
                )}

              </div>

            </Card>
          )}

          {/* ===================================================
              MANUAL MODE - CAPTION
          ==================================================== */}

          {mode === 'manual' &&
            uploadedMedia && (
              <Card title="Write your caption">

                <textarea
                  rows={8}
                  className="input"
                  placeholder="Write a compelling caption for your post…"
                  value={caption}
                  onChange={(event) =>
                    setCaption(
                      event.target.value
                    )
                  }
                />

                <div className="mt-2 text-xs text-slate-500">
                  {caption.length} characters
                </div>

              </Card>
            )}

          {/* ===================================================
              SCHEDULING
          ==================================================== */}

          <Card
            title="When to publish?"
            subtitle="Choose now or pick a future time."
          >

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
                    checked={
                      publishMode === 'now'
                    }
                    onChange={() =>
                      setPublishMode(
                        'now'
                      )
                    }
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
                    checked={
                      publishMode === 'later'
                    }
                    onChange={() =>
                      setPublishMode(
                        'later'
                      )
                    }
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
                      value={
                        scheduledDate
                      }
                      onChange={(event) =>
                        setScheduledDate(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="space-y-1">

                    <label className="block text-sm font-medium text-slate-700">
                      Time (24h)
                    </label>

                    <input
                      type="time"
                      className="input"
                      value={
                        scheduledTime
                      }
                      onChange={(event) =>
                        setScheduledTime(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="space-y-1">

                    <label className="block text-sm font-medium text-slate-700">
                      Timezone
                    </label>

                    <select
                      className="input"
                      value={timezone}
                      onChange={(event) =>
                        setTimezone(
                          event.target.value
                        )
                      }
                    >

                      <option value="UTC">
                        UTC
                      </option>

                      <option value="local">
                        Local device time
                      </option>

                    </select>

                  </div>

                  {isPastDate && (
                    <div className="sm:col-span-3">

                      <Alert tone="warning">
                        Selected time is in
                        the past. Pick a future
                        date/time.
                      </Alert>

                    </div>
                  )}

                </div>
              )}

              {scheduledAtISO && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">

                  <strong>
                    Will be sent as:
                  </strong>{' '}

                  <code className="text-[11px]">
                    {scheduledAtISO}
                  </code>

                </div>
              )}

            </div>

          </Card>

          {/* ===================================================
              ACTIONS
          ==================================================== */}

          <div className="flex gap-2">

            {mode === 'ai' ? (
              <Button
                type="button"
                onClick={
                  handleGenerateAI
                }
                disabled={isBusy}
              >
                {generating
                  ? 'Starting…'
                  : 'Generate with AI'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={
                  handleCreateManualPost
                }
                disabled={isBusy}
              >
                {creating
                  ? 'Creating…'
                  : 'Create post'}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  PATHS.posts
                )
              }
              disabled={isBusy}
            >
              Cancel
            </Button>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE - DESTINATIONS
        ====================================================== */}

        <div>

          <Card
            title="Publishing destination"
            subtitle="Click to select one or more accounts."
          >

            {accountsLoading ? (
              <div className="text-sm text-slate-500">
                Loading accounts…
              </div>
            ) : (
              <ul className="space-y-2">

                {accounts.map(
                  (account) => {
                    const isSelected =
                      selectedPlatforms.includes(
                        account.id
                      );

                    return (
                      <li
                        key={
                          account.id
                        }
                        onClick={() =>
                          togglePlatform(
                            account.id
                          )
                        }
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                          account.connected
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-60'
                        } ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                            : account.connected
                              ? 'border-slate-200 bg-white hover:bg-slate-50'
                              : 'border-slate-200 bg-slate-50'
                        }`}
                      >

                        <div className="flex items-center gap-2">

                          <PlatformIcon
                            platform={
                              account.platform
                            }
                          />

                          <div>

                            <div className="font-medium text-slate-800">
                              {account.label}
                            </div>

                            <div className="text-xs text-slate-500">
                              {account.handle}
                            </div>

                          </div>

                        </div>

                        <Badge
                          tone={
                            account.connected
                              ? 'success'
                              : 'neutral'
                          }
                        >
                          {account.connected
                            ? isSelected
                              ? 'Selected'
                              : 'Ready'
                            : 'Disconnected'}
                        </Badge>

                      </li>
                    );
                  }
                )}

              </ul>
            )}

            {selectedPlatforms.length >
              0 && (
              <div className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                Selected:{' '}
                {selectedPlatforms.join(
                  ', '
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-slate-500">

              Need to connect?{' '}

              <button
                type="button"
                className="font-medium text-brand-600 hover:underline"
                onClick={() =>
                  navigate(
                    PATHS.accounts
                  )
                }
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