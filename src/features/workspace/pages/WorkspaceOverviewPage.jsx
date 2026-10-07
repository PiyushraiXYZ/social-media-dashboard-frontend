import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { StatsCards } from '../components/StatsCards.jsx';
import { UpcomingSchedule } from '../components/UpcomingSchedule.jsx';
import { RecentActivity } from '../components/RecentActivity.jsx';
import { RecentPostsTable } from '../components/RecentPostsTable.jsx';
import { AIPostButton } from '../components/AIPostButton.jsx';
import { useGetAnalyticsQuery } from '../api.js';
import {
  setStats,
  setPlatforms,
  setSuccessRate,
} from '../workspaceSlice.js';

export function WorkspaceOverviewPage() {
  const dispatch = useDispatch();
  const { data: analytics } = useGetAnalyticsQuery();

  // Sync analytics → Redux
  useEffect(() => {
    if (analytics) {
      dispatch(setStats(analytics.summary || {}));
      dispatch(setPlatforms(analytics.platforms || {}));
      dispatch(setSuccessRate(analytics.success_rate || 0));
    }
  }, [analytics, dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="01 / Workspace Overview"
        title="A clear view of your publishing."
        subtitle="Here's what needs your attention."
        actions={<AIPostButton />}
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