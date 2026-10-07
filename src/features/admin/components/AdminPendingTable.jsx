import { useState } from 'react';
import {
  useListAdminPendingQuery,
  useAdminApprovePostMutation,
  useAdminRejectPostMutation,
} from '../api.js';
import { Table } from '../../../components/ui/Table/Table.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Modal } from '../../../components/ui/Modal/Modal.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';

export function AdminPendingTable() {
  const { data, isLoading, isError, error, refetch } =
    useListAdminPendingQuery();
  const [approvePost] = useAdminApprovePostMutation();
  const [rejectPost] = useAdminRejectPostMutation();

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleApprove = async (postId) => {
    setFeedback(null);
    try {
      await approvePost(postId).unwrap();
      setFeedback({
        tone: 'success',
        message: `Post ${postId} approved ✅`,
      });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Approve failed',
      });
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      setFeedback({ tone: 'danger', message: 'Reason required' });
      return;
    }
    try {
      await rejectPost({
        postId: rejectTarget.id,
        reason: rejectReason.trim(),
      }).unwrap();
      setFeedback({
        tone: 'success',
        message: `Post ${rejectTarget.id} rejected`,
      });
      setRejectTarget(null);
      setRejectReason('');
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Reject failed',
      });
    }
  };

  if (isLoading) return <Skeleton rows={5} />;

  if (isError) {
    return (
      <Alert tone="danger" title="Could not load pending posts">
        {error?.data?.detail || error?.error || 'Network error'}
      </Alert>
    );
  }

  const posts = data?.pending || [];

  const columns = [
    {
      key: 'content',
      title: 'Content',
      render: (r) => (
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-slate-800">
            {r.content_text || r.title || 'Untitled'}
          </div>
          <div className="text-xs text-slate-500">
            Post #{r.id} · {r.platforms?.join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      title: 'Author',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.user_email || `User #${r.user_id}`}
        </span>
      ),
    },
    {
      key: 'scheduled',
      title: 'Scheduled',
      render: (r) => (
        <span className="text-xs text-slate-500">
          {r.scheduled_at
            ? new Date(r.scheduled_at).toLocaleString()
            : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleApprove(r.id)}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRejectTarget(r)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {feedback && (
        <div className="mb-3">
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        </div>
      )}

      <div className="mb-3 flex justify-between text-xs text-slate-500">
        <span>Pending: {data?.count || 0} posts</span>
        <Button variant="ghost" size="sm" onClick={refetch}>
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        rows={posts}
        empty="No pending posts 🎉"
      />

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => {
          setRejectTarget(null);
          setRejectReason('');
        }}
        title={`Reject post #${rejectTarget?.id}?`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject post
            </Button>
          </>
        }
      >
        <Input
          label="Reason for rejection"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Describe why this post is rejected"
        />
      </Modal>
    </div>
  );
}