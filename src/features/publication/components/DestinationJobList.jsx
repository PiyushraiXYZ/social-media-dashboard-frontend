import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';

function statusTone(status) {
  switch (status) {
    case 'Published':
      return 'success';
    case 'Failed':
      return 'danger';
    case 'Publishing':
      return 'progress';
    default:
      return 'info';
  }
}

export function DestinationJobList({ platforms = [], status }) {
  const derivedStatus =
    status === 'posted'
      ? 'Published'
      : status === 'failed'
      ? 'Failed'
      : status === 'posting'
      ? 'Publishing'
      : 'Queued';

  return (
    <ul className="space-y-3">
      {platforms.map((platform) => (
        <li
          key={platform}
          className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100">
              <PlatformIcon platform={platform} size={18} />
            </div>
            <div>
              <div className="text-sm font-medium capitalize text-slate-800">
                {platform}
              </div>
              <div className="text-xs text-slate-500">
                {derivedStatus === 'Published' && 'Published successfully'}
                {derivedStatus === 'Publishing' && 'Publishing…'}
                {derivedStatus === 'Failed' && 'Failed to publish'}
                {derivedStatus === 'Queued' && 'Waiting…'}
              </div>
            </div>
          </div>
          <Badge tone={statusTone(derivedStatus)}>{derivedStatus}</Badge>
        </li>
      ))}
    </ul>
  );
}