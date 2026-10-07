import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { InstagramEligibilityChecklist } from '../components/InstagramEligibilityChecklist.jsx';

export function InstagramAccountSelectPage() {
  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections · Instagram"
        title="Find your Instagram account."
        subtitle="Choose an eligible Business or Creator account linked to your selected Facebook Page."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Accounts linked to Northstar Learning" subtitle="Illustrative discovery results">
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2">
              <div>
                <div className="text-sm font-medium">@northstar.learning</div>
                <div className="text-xs text-slate-500">Business · ig_northstar</div>
              </div>
              <Button size="sm">Connect</Button>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <div>
                <div className="text-sm font-medium">@northstar.creator</div>
                <div className="text-xs text-slate-500">Creator account · Linked to this Page</div>
              </div>
              <Button size="sm" variant="ghost">Select</Button>
            </li>
          </ul>
        </Card>
        <Card title="Eligibility checklist">
          <InstagramEligibilityChecklist />
        </Card>
      </div>
    </>
  );
}
