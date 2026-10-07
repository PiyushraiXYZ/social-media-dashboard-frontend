import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './routePaths.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { AppShell } from '../components/layout/AppShell/AppShell.jsx';
import { AuthLayout } from '../components/layout/AuthLayout/AuthLayout.jsx';

import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { ConfirmEmailPage } from '../features/auth/pages/ConfirmEmailPage.jsx';

import { WorkspaceOverviewPage } from '../features/workspace/pages/WorkspaceOverviewPage.jsx';
import { FirstUsePage } from '../features/workspace/pages/FirstUsePage.jsx';

import { SocialAccountsPage } from '../features/accounts/pages/SocialAccountsPage.jsx';
import { FacebookPageSelectPage } from '../features/accounts/pages/FacebookPageSelectPage.jsx';
import { InstagramAccountSelectPage } from '../features/accounts/pages/InstagramAccountSelectPage.jsx';
import { LinkedInConnectPage } from '../features/accounts/pages/LinkedInConnectPage.jsx';
import { ConnectionRecoveryPage } from '../features/accounts/pages/ConnectionRecoveryPage.jsx';

import { PostsListPage } from '../features/posts/pages/PostsListPage.jsx';
import { CreatePostPage } from '../features/posts/pages/CreatePostPage.jsx';
import { GenerationStatusPage } from '../features/posts/pages/GenerationStatusPage.jsx';
import { PostEditorPage } from '../features/posts/pages/PostEditorPage.jsx';
import { BrandingEditorPage } from '../features/posts/pages/BrandingEditorPage.jsx';

import { ApprovalCenterPage } from '../features/approval/pages/ApprovalCenterPage.jsx';
import { RequestApprovalPage } from '../features/approval/pages/RequestApprovalPage.jsx';
import { ApprovalDecisionPage } from '../features/approval/pages/ApprovalDecisionPage.jsx';
import { ExpiredApprovalPage } from '../features/approval/pages/ExpiredApprovalPage.jsx';

import { CalendarPage } from '../features/scheduling/pages/CalendarPage.jsx';
import { ScheduleDateTimePage } from '../features/scheduling/pages/ScheduleDateTimePage.jsx';
import { ScheduleConfirmationPage } from '../features/scheduling/pages/ScheduleConfirmationPage.jsx';

import { PublishConfirmPage } from '../features/publication/pages/PublishConfirmPage.jsx';
import { PublicationProgressPage } from '../features/publication/pages/PublicationProgressPage.jsx';
import { PublicationResultPage } from '../features/publication/pages/PublicationResultPage.jsx';
import { ActivityDetailPage } from '../features/publication/pages/ActivityDetailPage.jsx';

import { NotificationsPage } from '../features/notifications/pages/NotificationsPage.jsx';
import { BrandSettingsPage } from '../features/brand/pages/BrandSettingsPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      {/* ─── Auth (public) ─── */}
      <Route element={<AuthLayout />}>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.register} element={<RegisterPage />} />
        {/* Kept for reference — not part of active flow */}
        <Route path={PATHS.confirmEmail} element={<ConfirmEmailPage />} />
        <Route
          path={PATHS.confirmEmailSuccess}
          element={<ConfirmEmailPage />}
        />
      </Route>

      {/* ─── App (protected) ─── */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to={PATHS.overview} replace />} />
        <Route path={PATHS.overview} element={<WorkspaceOverviewPage />} />
        <Route path={PATHS.firstUse} element={<FirstUsePage />} />

        <Route path={PATHS.posts} element={<PostsListPage />} />
        <Route path={PATHS.createPost} element={<CreatePostPage />} />
        <Route path={PATHS.generation()} element={<GenerationStatusPage />} />
        <Route path={PATHS.postEditor()} element={<PostEditorPage />} />
        <Route path={PATHS.branding()} element={<BrandingEditorPage />} />

        <Route path={PATHS.approval} element={<ApprovalCenterPage />} />
        <Route
          path={PATHS.approvalRequest()}
          element={<RequestApprovalPage />}
        />
        <Route
          path={PATHS.approvalDecision()}
          element={<ApprovalDecisionPage />}
        />
        <Route
          path={PATHS.approvalExpired()}
          element={<ExpiredApprovalPage />}
        />

        <Route path={PATHS.calendar} element={<CalendarPage />} />
        <Route
          path={PATHS.scheduleDateTime()}
          element={<ScheduleDateTimePage />}
        />
        <Route
          path={PATHS.scheduleConfirm()}
          element={<ScheduleConfirmationPage />}
        />

        <Route
          path={PATHS.publishConfirm()}
          element={<PublishConfirmPage />}
        />
        <Route
          path={PATHS.publishProgress()}
          element={<PublicationProgressPage />}
        />
        <Route
          path={PATHS.publishResult()}
          element={<PublicationResultPage />}
        />
        <Route
          path={PATHS.publishActivity()}
          element={<ActivityDetailPage />}
        />

        <Route path={PATHS.accounts} element={<SocialAccountsPage />} />
        <Route
          path={PATHS.facebookSelect}
          element={<FacebookPageSelectPage />}
        />
        <Route
          path={PATHS.instagramSelect}
          element={<InstagramAccountSelectPage />}
        />
        <Route
          path={PATHS.linkedinConnect}
          element={<LinkedInConnectPage />}
        />
        <Route
          path={PATHS.accountRecovery}
          element={<ConnectionRecoveryPage />}
        />

        <Route path={PATHS.notifications} element={<NotificationsPage />} />
        <Route path={PATHS.brandSettings} element={<BrandSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={PATHS.overview} replace />} />
    </Routes>
  );
}