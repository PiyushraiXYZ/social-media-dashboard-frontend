export function Alert({ tone = 'info', title, children }) {
  const tones = {
    info: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    warning: 'bg-amber-50 text-amber-800 border-amber-100',
    danger: 'bg-red-50 text-red-800 border-red-100',
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
