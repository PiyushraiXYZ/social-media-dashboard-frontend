import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';

const jobs = [
  { id: 'fb_123', platform: 'facebook', label: 'Northstar Learning', status: 'Published', detail: 'Image uploaded → post published · fb_ref_123' },
  { id: 'ig_123', platform: 'instagram', label: '@northstar.learning', status: 'Processing', detail: 'Upload complete · Media container processing' },
  { id: 'li_123', platform: 'linkedin', label: 'Maya Chen', status: 'Queued', detail: 'Waiting for permission validation' },
];

export function DestinationJobList() {
  return (
    <ul className="space-y-3">
      {jobs.map((j) => (
        <li key={j.id} className="flex items-start justify-between rounded-lg border border-slate-200 p-3">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-100">
              <PlatformIcon platform={j.platform} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800">{j.label}</div>
              <div className="text-xs text-slate-500">{j.detail}</div>
            </div>
          </div>
          <Badge tone={j.status === 'Published' ? 'success' : j.status === 'Processing' ? 'progress' : 'info'}>{j.status}</Badge>
        </li>
      ))}
    </ul>
  );
}
