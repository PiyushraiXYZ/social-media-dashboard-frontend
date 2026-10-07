import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';

export function ScheduleSidebar() {
  return (
    <div className="space-y-4">
      <Card title="Thursday, 08 October" subtitle="Selected day · UTC">
        <Badge tone="info">18:30 UTC</Badge>
        <div className="mt-3 text-sm font-semibold">AI and Machine Learning</div>
        <div className="mt-2"><Badge tone="info">Scheduled</Badge></div>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-2"><PlatformIcon platform="facebook" /> Northstar Learning</li>
          <li className="flex items-center gap-2"><PlatformIcon platform="instagram" /> @northstar.learning</li>
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          <Button>Open scheduled post</Button>
          <Button variant="ghost">Reschedule</Button>
        </div>
      </Card>
      <Card title="Plan ahead">
        <p className="text-sm text-slate-600">Scheduled posts stay visible here. Publication results are tracked independently for every selected account.</p>
        <Button variant="ghost" className="mt-3">Create draft</Button>
      </Card>
    </div>
  );
}
