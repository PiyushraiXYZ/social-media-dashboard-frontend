import { useState } from 'react';
import { Calendar } from '../../../components/ui/Calendar/Calendar.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function CalendarMonth() {
  const [date, setDate] = useState(new Date('2026-10-08'));
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="text-sm font-semibold">October 2026</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Today</Button>
          <Button variant="ghost" size="sm">Month</Button>
          <Button variant="ghost" size="sm">Week</Button>
          <Button variant="ghost" size="sm">List</Button>
        </div>
      </div>
      <div className="p-4">
        <Calendar selected={date} onSelect={setDate} />
      </div>
    </div>
  );
}
