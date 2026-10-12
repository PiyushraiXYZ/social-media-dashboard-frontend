import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import {
  useGetBrandSocialAccountsQuery,
  useLazyConnectFacebookQuery,
  useLazyConnectLinkedInQuery,
} from '../api.js';
import { selectActiveBrand } from '../../brands/brandSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

export function SocialAccountsPage() {
  const navigate = useNavigate();

  // ⭐ Active brand from Redux
  const activeBrand = useSelector(selectActiveBrand);

  // ⭐ Brand-specific accounts query
  //   skip: !activeBrand?.id prevents /platforms/brands/undefined/accounts
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBrandSocialAccountsQuery(activeBrand?.id, {
    skip: !activeBrand?.id,
  });

  const [triggerFacebook] = useLazyConnectFacebookQuery();
  const [triggerLinkedIn] = useLazyConnectLinkedInQuery();

  const [feedback, setFeedback] = useState(null);
  const [connecting, setConnecting] = useState(null);

  /**
   * Handle Connect / Reconnect buttons.
   *
   * Notes:
   * - Instagram uses Facebook OAuth with force=true
   *   → backend re-discovers the IG Business account.
   * - All OAuth calls are brand-scoped.
   */
  const handleConnect = async (platform) => {
    setFeedback(null);
    setConnecting(platform);

    try {
      const brandId = activeBrand?.id || null;

      if (!brandId) {
        setFeedback({
          tone: 'danger',
          message: 'No active brand. Please select a brand first.',
        });
        setConnecting(null);
        return;
      }

      let res;

      if (platform === 'facebook') {
        res = await triggerFacebook({
          brandId,
          force: false,
        }).unwrap();
      } else if (platform === 'instagram') {
        res = await triggerFacebook({
          brandId,
          force: true,
        }).unwrap();
      } else if (platform === 'linkedin') {
        res = await triggerLinkedIn({
          brandId,
        }).unwrap();
      }

      console.log(`[connect ${platform}] response:`, res);

      // Case 1: Already connected
      if (res?.already_connected) {
        setFeedback({
          tone: 'info',
          message:
            res.message ||
            `${platform} already connected. Refreshing...`,
        });
        refetch();
        setConnecting(null);
        return;
      }

      // Case 2: OAuth URL → redirect
      if (res?.oauth_url) {
        setFeedback({
          tone: 'info',
          message: `Redirecting to ${
            platform === 'instagram' ? 'Facebook (Meta)' : platform
          } for authorization...`,
        });
        setTimeout(() => {
          window.location.href = res.oauth_url;
        }, 600);
        return;
      }

      // Case 3: Unexpected
      setFeedback({
        tone: 'warning',
        message: res?.message || 'Unexpected response from server.',
      });
      setConnecting(null);
    } catch (err) {
      console.error(`[connect ${platform}] error:`, err);
      setFeedback({
        tone: 'danger',
        message:
          err?.data?.detail ||
          err?.error ||
          `Failed to start ${platform} OAuth.`,
      });
      setConnecting(null);
    }
  };

  const platforms = [
    {
      key: 'facebook',
      label: 'Facebook Page',
      description: 'Publish to a Facebook Page you manage.',
    },
    {
      key: 'instagram',
      label: 'Instagram Business',
      description: 'Publish to a Business or Creator account.',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Member',
      description: 'Publish to your LinkedIn profile.',
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections"
        title="Your publishing destinations."
        subtitle={
          activeBrand
            ? `Managing accounts for ${activeBrand.name}`
            : 'Manage connected identities and check their readiness before every publish.'
        }
        actions={
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={!activeBrand}
          >
            Refresh
          </Button>
        }
      />

      {feedback && (
        <div className="mb-4">
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        </div>
      )}

      {/* ⭐ No active brand state */}
      {!activeBrand && !isLoading && (
        <Card>
          <div className="p-8 text-center">
            <div className="text-lg font-semibold text-slate-800">
              No active brand
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create or select a brand to manage its social accounts.
            </p>
            <Button
              onClick={() => navigate(PATHS.brands)}
              className="mt-4"
            >
              Go to Brands
            </Button>
          </div>
        </Card>
      )}

      {/* ⭐ Loading state */}
      {activeBrand && isLoading && (
        <Card>
          <Skeleton rows={4} />
        </Card>
      )}

      {/* ⭐ Error state */}
      {activeBrand && isError && (
        <Alert tone="danger" title="Could not load accounts">
          {error?.data?.detail || error?.error || 'Network error'}
        </Alert>
      )}

      {/* ⭐ Platform cards */}
      {activeBrand && data && (
        <div className="grid gap-4 lg:grid-cols-3">
          {platforms.map((p) => {
            // Backend returns arrays per platform
            const accountList = data?.accounts?.[p.key] || [];
            const acc = accountList[0] || { connected: false };
            const isConnected = Boolean(acc.connected);
            const isLoadingThis = connecting === p.key;

            return (
              <Card key={p.key}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
                      <PlatformIcon platform={p.key} size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {p.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isConnected
                          ? acc.name || acc.username || 'Connected'
                          : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <Badge tone={isConnected ? 'success' : 'neutral'}>
                    {isConnected ? 'Ready' : 'Disconnected'}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {p.description}
                </p>

                {isConnected && (
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    {acc.page_id && (
                      <div className="truncate">ID: {acc.page_id}</div>
                    )}
                    {acc.followers !== undefined && (
                      <div>Followers: {acc.followers}</div>
                    )}
                    {acc.email && <div>Email: {acc.email}</div>}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {isConnected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleConnect(p.key)}
                      disabled={isLoadingThis}
                    >
                      {isLoadingThis ? 'Reconnecting…' : 'Reconnect'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(p.key)}
                      disabled={isLoadingThis}
                    >
                      {isLoadingThis
                        ? 'Connecting…'
                        : `Connect ${p.key}`}
                    </Button>
                  )}
                </div>

                {/* Instagram-specific hint */}
                {p.key === 'instagram' && !isConnected && (
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                    💡 <strong>Instagram requires:</strong>
                    <ul className="mt-1 list-disc pl-4">
                      <li>
                        <strong>Business</strong> or{' '}
                        <strong>Creator</strong> account
                      </li>
                      <li>Linked to your Facebook Page</li>
                      <li>
                        Link at:{' '}
                        <code className="text-[10px]">
                          FB Page → Settings → Linked Accounts → Instagram
                        </code>
                      </li>
                    </ul>
                    <div className="mt-2">
                      "Connect instagram" will open Facebook (Meta)
                      authorization to detect your linked Instagram
                      account.
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeBrand && (
        <>
          <div className="mt-6">
            <Alert tone="info" title="Ready to publish?">
              Once accounts are connected, go to{' '}
              <button
                className="text-brand-600 font-medium hover:underline"
                onClick={() => navigate(PATHS.createPost)}
              >
                Create Post
              </button>{' '}
              to generate and publish content.
            </Alert>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Recovery options:{' '}
            <button
              className="text-brand-600 font-medium hover:underline"
              onClick={() => navigate(PATHS.accountRecovery)}
            >
              Restore a connection →
            </button>
          </div>
        </>
      )}
    </>
  );
}