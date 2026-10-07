import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { ApprovalPreview } from '../components/ApprovalPreview.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

export function ExpiredApprovalPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="04 / Review & Approval · Expired branch"
        title="This post needs a fresh review."
        subtitle="The approval waiting window has ended. This post was not published."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Preserved post"><ApprovalPreview /></Card>
        </div>
        <Card title="What you can do next">
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• <b>Review</b> the caption, image, and selected account identities.</li>
            <li>• <b>Refresh</b> the content or branding if the message is no longer current.</li>
            <li>• <b>Resubmit</b> the post after your review.</li>
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => navigate(PATHS.approvalRequest(123))}>Review & resubmit</Button>
            <Button variant="ghost">Regenerate</Button>
            <Button variant="ghost" onClick={() => navigate(PATHS.publishConfirm(123))}>Publish now</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
