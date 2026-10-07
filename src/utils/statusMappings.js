export const POST_STATUS = {
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  DRAFT: 'Draft',
  AWAITING_APPROVAL: 'Awaiting Approval',
  APPROVED: 'Approved',
  SCHEDULED: 'Scheduled',
  PUBLISHING: 'Publishing',
  PUBLISHED: 'Published',
  PARTIALLY_PUBLISHED: 'Partially Published',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

export const statusTone = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Partially Published': return 'warning';
    case 'Failed':
    case 'Expired': return 'danger';
    case 'Awaiting Approval':
    case 'Scheduled': return 'info';
    case 'Generating':
    case 'Publishing': return 'progress';
    default: return 'neutral';
  }
};
