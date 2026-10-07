import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { OrganizationsTable } from '../components/OrganizationsTable.jsx';
import { AllUsersTable } from '../components/AllUsersTable.jsx';
import { AllPostsTable } from '../components/AllPostsTable.jsx';
import { CreateAdminModal } from '../components/CreateAdminModal.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [tab, setTab] = useState('organizations');
  const [createOpen, setCreateOpen] = useState(false);

  // ⭐ Guard: Only superadmin can access this page
  useEffect(() => {
    if (user?.role !== 'superadmin') {
      navigate(PATHS.overview, { replace: true });
    }
  }, [user, navigate]);

  // Don't render anything while redirecting
  if (user?.role !== 'superadmin') {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="SuperAdmin"
        title="SuperAdmin dashboard."
        subtitle="Manage organizations, admins, users, and posts across the platform."
        actions={
          tab === 'organizations' ? (
            <Button onClick={() => setCreateOpen(true)}>
              + Create admin
            </Button>
          ) : null
        }
      />

      <Card>
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { value: 'organizations', label: 'Organizations' },
            { value: 'users', label: 'All Users' },
            { value: 'posts', label: 'All Posts' },
          ]}
        />

        <div className="mt-4">
          {tab === 'organizations' && <OrganizationsTable />}
          {tab === 'users' && <AllUsersTable />}
          {tab === 'posts' && <AllPostsTable />}
        </div>
      </Card>

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}