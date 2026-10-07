import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { AdminUsersTable } from '../components/AdminUsersTable.jsx';
import { AdminPendingTable } from '../components/AdminPendingTable.jsx';
import { CreateUserModal } from '../components/CreateUserModal.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [tab, setTab] = useState('users');
  const [createOpen, setCreateOpen] = useState(false);

  // ⭐ Guard: SuperAdmin should NOT access this page.
  // Redirect them to /superadmin dashboard.
  useEffect(() => {
    if (user?.role === 'superadmin') {
      navigate(PATHS.superadmin, { replace: true });
    }
  }, [user, navigate]);

  // Don't render anything while redirecting
  if (user?.role === 'superadmin') {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard."
        subtitle="Manage users and review pending posts across your organization."
        actions={
          tab === 'users' ? (
            <Button onClick={() => setCreateOpen(true)}>
              + Create user
            </Button>
          ) : null
        }
      />

      <Card>
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { value: 'users', label: 'Users' },
            { value: 'pending', label: 'Pending posts' },
          ]}
        />

        <div className="mt-4">
          {tab === 'users' ? (
            <AdminUsersTable onCreateClick={() => setCreateOpen(true)} />
          ) : (
            <AdminPendingTable />
          )}
        </div>
      </Card>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}