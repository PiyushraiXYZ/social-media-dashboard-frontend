import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { ApprovalPreview } from '../../approval/components/ApprovalPreview.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function ScheduleConfirmationPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="05 / Scheduling · Confirmation"
        title="A place on the calendar."
        subtitle="Your post is scheduled 08 October 2026 at 18:30 UTC."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Scheduled version"><ApprovalPreview /></Card>
        <Card title="Publication plan">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Date</span><span>Thursday, 08 October</span></li>
            <li className="flex justify-between"><span>Time</span><span>18:30 UTC</span></li>
            <li className="flex justify-between"><span>ISO</span><span>2026-10-08T18:30:00Z</span></li>
          </ul>
          <div className="mt-4 space-y-2">
            <div className="text-xs text-slate-500">Selected accounts</div>
            <div className="text-sm">Facebook · Northstar Learning · Page</div>
            <div className="text-sm">Instagram · @northstar.learning · Business</div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => navigate(PATHS.calendar)}>Open in calendar</Button>
            <Button variant="ghost">Reschedule</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
