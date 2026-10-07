import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { ActivityTimeline } from '../components/ActivityTimeline.jsx';

export function ActivityDetailPage() {
  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Activity detail"
        title="The whole journey, in one place."
        subtitle="AI and Machine Learning · Post 123 · Scheduled all-success branch."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Lifecycle history"><ActivityTimeline /></Card>
        <Card title="Destination results">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span>Facebook · Northstar Learning</span><span className="text-emerald-600">Published</span></li>
            <li className="flex justify-between"><span>Instagram · @northstar.learning</span><span className="text-emerald-600">Published</span></li>
            <li className="flex justify-between"><span>LinkedIn · Maya Chen</span><span className="text-slate-500">Not selected</span></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
