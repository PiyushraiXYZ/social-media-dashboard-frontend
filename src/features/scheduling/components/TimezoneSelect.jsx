import { useSelector, useDispatch } from 'react-redux';
import { setTimezone } from '../schedulingSlice.js';

const TZ = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo'];

export function TimezoneSelect() {
  const tz = useSelector((s) => s.scheduling.timezone);
  const dispatch = useDispatch();
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">Timezone</label>
      <select className="input" value={tz} onChange={(e) => dispatch(setTimezone(e.target.value))}>
        {TZ.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}
