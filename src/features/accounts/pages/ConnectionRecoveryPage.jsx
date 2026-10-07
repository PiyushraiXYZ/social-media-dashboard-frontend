import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { RecoveryCard } from '../components/RecoveryCard.jsx';

const items = [
  { platform: 'facebook', title: 'Facebook · Northstar Alumni', status: 'Expired', message: 'Authorization has expired. Reconnect before publishing to this Page.', action: 'Reconnect' },
  { platform: 'linkedin', title: 'LinkedIn · Maya Chen', status: 'Disconnected', message: 'No active member connection. Authorize your identity; publishing validation remains pending.', action: 'Connect LinkedIn' },
  { platform: 'instagram', title: 'Instagram · @northstar.studio', status: 'Invalid', message: 'Linked Page access is missing. Select a Page with an eligible Business or Creator account.', action: 'Choose eligible Page' },
  { platform: 'facebook', title: 'Facebook · Northstar Community', status: 'Permission denied', message: 'Publishing permission was not granted. Review Meta access and authorize again.', action: 'Reauthorize' },
];

export function ConnectionRecoveryPage() {
  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections · Recovery"
        title="Restore a connection."
        subtitle="Your drafts are safe. Resolve account access before retrying a destination."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it, i) => <RecoveryCard key={i} {...it} />)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Authorization canceled">
          <p className="text-sm text-slate-500">You closed the platform authorization step. No connection was added.</p>
        </Card>
        <Card title="Connection failed">
          <p className="text-sm text-slate-500">We couldn't complete the platform connection. Check platform availability and try again.</p>
        </Card>
      </div>
    </>
  );
}
