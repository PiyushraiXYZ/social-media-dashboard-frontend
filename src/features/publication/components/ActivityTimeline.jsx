import { ApprovalTimeline } from '../../../components/shared/ApprovalTimeline/ApprovalTimeline.jsx';

export function ActivityTimeline({ post }) {
  if (!post) return null;

  const events = [];

  if (post.created_at) {
    events.push({ label: 'Created', at: post.created_at });
  }
  if (post.confirmation_sent_at) {
    events.push({
      label: 'Awaiting approval',
      at: post.confirmation_sent_at,
    });
  }
  if (post.approved_at) {
    events.push({ label: 'Approved', at: post.approved_at });
  }
  if (post.scheduled_at) {
    events.push({ label: 'Scheduled', at: post.scheduled_at });
  }
  if (post.status === 'posted') {
    events.push({ label: 'Published', at: post.updated_at });
  }
  if (post.status === 'failed') {
    events.push({ label: 'Failed', at: post.updated_at });
  }

  return <ApprovalTimeline events={events} />;
}