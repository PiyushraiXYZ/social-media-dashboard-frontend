export function DatePicker({ value, onChange, label = 'Date' }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="date"
        className="input"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
