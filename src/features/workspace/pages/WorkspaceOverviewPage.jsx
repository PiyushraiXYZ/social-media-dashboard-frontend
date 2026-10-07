import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { StatsCards } from '../components/StatsCards.jsx';
import { UpcomingSchedule } from '../components/UpcomingSchedule.jsx';
import { RecentActivity } from '../components/RecentActivity.jsx';
import { RecentPostsTable } from '../components/RecentPostsTable.jsx';

export function WorkspaceOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="01 / Workspace Overview"
        title="A clear view of your publishing."
        subtitle="Good morning, Maya. Here's what needs your attention."
      />
      <StatsCards />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <UpcomingSchedule />
        <RecentActivity />
      </div>
      <div className="mt-6">
        <RecentPostsTable />
      </div>
    </>
  );
}
