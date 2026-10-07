export function CaptionEditor({ value, onChange, platform }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500">{platform} caption</div>
      <textarea
        rows={10}
        className="input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
