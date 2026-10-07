import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { DestinationJobList } from '../components/DestinationJobList.jsx';

export function PublicationProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Async progress"
        title="Publishing, destination by destination."
        subtitle="Post 123 · Illustrative three-target branch; LinkedIn remains subject to validation."
      />
      <Card title="Destination jobs" subtitle="Operation pub_123_oct06 · 06 Oct 2026, 10:15 UTC">
        <DestinationJobList />
      </Card>
    </>
  );
}
