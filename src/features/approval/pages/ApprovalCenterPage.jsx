import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { ApprovalTable } from '../components/ApprovalTable.jsx';
import { StatsCards } from '../../workspace/components/StatsCards.jsx';

export function ApprovalCenterPage() {
  return (
    <>
      <PageHeader
        eyebrow="04 / Review & Approval"
        title="Every post, from idea to outcome."
        subtitle="Review drafts, confirm approvals, and follow independent destination results."
      />
      <StatsCards />
      <div className="mt-6">
        <Card title="Approvals">
          <ApprovalTable />
        </Card>
      </div>
    </>
  );
}
