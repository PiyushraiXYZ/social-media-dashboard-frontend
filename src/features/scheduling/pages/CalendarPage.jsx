import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { CalendarMonth } from '../components/CalendarMonth.jsx';
import { ScheduleSidebar } from '../components/ScheduleSidebar.jsx';

export function CalendarPage() {
  return (
    <>
      <PageHeader
        eyebrow="05 / Scheduling · Calendar"
        title="Give your content a place in the week."
        subtitle="Plan publication times, then check each destination's readiness."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3"><CalendarMonth /></div>
        <ScheduleSidebar />
      </div>
    </>
  );
}
