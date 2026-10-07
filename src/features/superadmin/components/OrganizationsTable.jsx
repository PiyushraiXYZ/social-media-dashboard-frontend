import { useState } from 'react';
import {
  useListOrganizationsQuery,
  useGetOrganizationDetailQuery,
} from '../api.js';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Modal } from '../../../components/ui/Modal/Modal.jsx';

export function OrganizationsTable() {
  const { data, isLoading, isError, error, refetch } =
    useListOrganizationsQuery();

  const [detailId, setDetailId] = useState(null);

  if (isLoading) return <Skeleton rows={5} />;

  if (isError) {
    return (
      <Alert tone="danger" title="Could not load organizations">
        {error?.data?.detail || error?.error || 'Network error'}
      </Alert>
    );
  }

  const orgs = data?.organizations || [];
  const socialTotals = data?.social_totals || {};

  const columns = [
    {
      key: 'org',
      title: 'Organization',
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800">
            {r.org_name || 'Unnamed org'}
          </div>
          <div className="text-xs text-slate-500">
            Admin ID: {r.id} · {r.email}
          </div>
        </div>
      ),
    },
    {
      key: 'users',
      title: 'Users',
      render: (r) => (
        <Badge tone="info">{r.user_count ?? 0}</Badge>
      ),
    },
    {
      key: 'posts',
      title: 'Posts',
      render: (r) => (
        <Badge tone="success">{r.post_count ?? 0}</Badge>
      ),
    },
    {
      key: 'social',
      title: 'Social accounts',
      render: (r) => {
        const sa = r.social_accounts || {};
        return (
          <div className="flex gap-1 text-xs">
            <span>FB: {sa.facebook || 0}</span>
            <span>·</span>
            <span>IG: {sa.instagram || 0}</span>
            <span>·</span>
            <span>LI: {sa.linkedin || 0}</span>
          </div>
        );
      },
    },
    {
      key: 'action',
      title: 'Action',
      render: (r) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDetailId(r.id)}
        >
          View →
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          Total: {orgs.length} organizations · Platform totals:{' '}
          {Object.entries(socialTotals).length > 0
            ? Object.entries(socialTotals)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ')
            : '—'}
        </span>
        <Button variant="ghost" size="sm" onClick={refetch}>
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        rows={orgs}
        empty="No organizations yet."
      />

      {detailId && (
        <OrgDetailModal
          adminId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}

/* ═══ Org Detail Modal ═══ */
function OrgDetailModal({ adminId, onClose }) {
  const { data, isLoading, isError } =
    useGetOrganizationDetailQuery(adminId);

  return (
    <Modal
      open
      onClose={onClose}
      title={`Organization detail · #${adminId}`}
      footer={
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading && <Skeleton rows={5} />}

      {isError && (
        <Alert tone="danger" title="Could not load detail">
          Try again later.
        </Alert>
      )}

      {data && (
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-slate-500">Organization</div>
            <div className="font-medium text-slate-800">
              {data.org_name || '—'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Admin</div>
            <div className="font-medium text-slate-800">
              {data.email || '—'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Address</div>
            <div className="text-slate-700">{data.address || '—'}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Users</div>
              <div className="text-2xl font-semibold text-slate-800">
                {data.user_count ?? 0}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Posts</div>
              <div className="text-2xl font-semibold text-slate-800">
                {data.post_count ?? 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}