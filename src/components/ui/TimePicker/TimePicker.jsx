export function TimePicker({ value, onChange, label = 'Time (24h)' }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="time"
        className="input"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
