import { ApprovalTimeline } from '../../../components/shared/ApprovalTimeline/ApprovalTimeline.jsx';

const events = [
  { label: 'Generating', at: '2026-10-06T09:10:00Z' },
  { label: 'Generated', at: '2026-10-06T09:14:00Z' },
  { label: 'Draft', at: '2026-10-06T09:20:00Z' },
  { label: 'Awaiting Approval', at: '2026-10-06T09:30:00Z' },
  { label: 'Approved', at: '2026-10-06T10:00:00Z' },
  { label: 'Scheduled', at: '2026-10-06T10:05:00Z' },
  { label: 'Publishing', at: '2026-10-08T18:30:00Z' },
  { label: 'Published', at: '2026-10-08T18:31:00Z' },
];

export function ActivityTimeline() {
  return <ApprovalTimeline events={events} />;
}

