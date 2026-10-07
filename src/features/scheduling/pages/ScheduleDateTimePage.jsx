import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Calendar } from '../../../components/ui/Calendar/Calendar.jsx';
import { TimePicker } from '../../../components/ui/TimePicker/TimePicker.jsx';
import { TimezoneSelect } from '../components/TimezoneSelect.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function ScheduleDateTimePage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date('2026-10-08'));
  const [time, setTime] = useState('18:30');

  return (
    <>
      <PageHeader
        eyebrow="05 / Scheduling · Date & time"
        title="Choose the right moment."
        subtitle="AI and Machine Learning · Post 123 · Approved content, future publication time."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Schedule publication" subtitle="October 2026">
            <Calendar selected={date} onSelect={setDate} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <TimePicker value={time} onChange={setTime} />
              <TimezoneSelect />
            </div>
            <div className="mt-3 text-xs text-slate-500">
              The final scheduled timestamp is 2026-10-08T18:30:00Z.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button onClick={() => navigate(PATHS.scheduleConfirm(123))}>Confirm schedule</Button>
            </div>
          </Card>
        </div>
        <Card title="Post to be scheduled">
          <div className="text-sm font-medium">AI and Machine Learning</div>
          <div className="text-xs text-slate-500 mt-1">Post 123 · Maya Chen · Northstar Learning</div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            <li>Facebook · Northstar Learning · Selected</li>
            <li>Instagram · @northstar.learning · Selected</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
