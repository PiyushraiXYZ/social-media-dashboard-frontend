import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar({ selected, onSelect, month, onMonthChange }) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      month={month}
      onMonthChange={onMonthChange}
      className="rounded-xl border border-slate-200 bg-white p-3"
    />
  );
}
