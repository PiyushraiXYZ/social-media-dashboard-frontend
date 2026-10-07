import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { ApprovalPreview } from '../../approval/components/ApprovalPreview.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function PublishConfirmPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Final confirmation"
        title="Ready when you are."
        subtitle="Post 123 · Publish-now branch after approval; separate from the scheduled journey."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><Card><ApprovalPreview /></Card></div>
        <Card title="Confirm publishing intent">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Reviewed version · 06 Oct 2026, 10:00 UTC</li>
            <li>Facebook · Ready · Selected</li>
            <li>Instagram · Ready · Selected</li>
            <li>LinkedIn · Validation pending · Not selectable</li>
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => navigate(PATHS.publishProgress(123))}>Publish to 2 destinations</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
