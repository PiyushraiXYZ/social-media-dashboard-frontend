import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { LinkedInPermissionReview } from '../components/LinkedInPermissionReview.jsx';

export function LinkedInConnectPage() {
  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections · LinkedIn"
        title="Connect your LinkedIn member."
        subtitle="Authorize a member identity, then validate the permissions needed for publishing."
      />
      <Alert tone="warning" title="LinkedIn integration is in progress">
        Images and Posts API migration, member OAuth permissions, and end-to-end publishing validation are not complete.
      </Alert>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Member authorization" subtitle="Backend-managed OAuth · Conceptual connection flow">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">MC</div>
            <div>
              <div className="text-sm font-medium">Maya Chen</div>
              <div className="text-xs text-slate-500">Member identity</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="justify-center">Continue with LinkedIn</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Card>
        <Card title="Permission review">
          <LinkedInPermissionReview />
        </Card>
      </div>
    </>
  );
}
