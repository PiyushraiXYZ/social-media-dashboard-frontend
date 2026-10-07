import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { ApprovalPreview } from '../components/ApprovalPreview.jsx';
import { ApprovalActions } from '../components/ApprovalActions.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function ApprovalDecisionPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="04 / Review & Approval · Decision"
        title="A final look before it goes live."
        subtitle="AI and Machine Learning · Post 123 · Confirmation requested 06 Oct 2026, 09:30 UTC."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Preview">
            <ApprovalPreview />
          </Card>
        </div>
        <Card title="Approval decision">
          <ApprovalActions
            onApprove={() => navigate(PATHS.scheduleDateTime(123))}
            onReturn={() => navigate(PATHS.postEditor(123))}
          />
        </Card>
      </div>
    </>
  );
}
