import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { ApprovalPreview } from '../components/ApprovalPreview.jsx';
import { ApprovalRequestForm } from '../components/ApprovalRequestForm.jsx';

export function RequestApprovalPage() {
  return (
    <>
      <PageHeader
        eyebrow="04 / Review & Approval · Request"
        title="Send this post for confirmation."
        subtitle="Review the exact content and selected destinations before requesting approval."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Preview being requested">
          <ApprovalPreview />
        </Card>
        <Card title="Request approval">
          <ApprovalRequestForm />
        </Card>
      </div>
    </>
  );
}
