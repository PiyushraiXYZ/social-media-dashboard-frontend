import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';

export function UpcomingSchedule() {
  return (
    <Card
      title="Upcoming schedule"
      subtitle="Publication dates are shown in UTC."
      actions={<Button variant="ghost" size="sm">Open calendar</Button>}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">A practical guide to prompt design</div>
          <div className="text-xs text-slate-500">Friday, 09 October · 15:00 UTC</div>
        </div>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">Scheduled</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2"><PlatformIcon platform="facebook" /> Northstar Learning</div>
        <div className="flex items-center gap-2"><PlatformIcon platform="instagram" /> @northstar.learning</div>
      </div>
    </Card>
  );
}
