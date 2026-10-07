export function Drawer({ open, onClose, title, children, side = 'right' }) {
  if (!open) return null;
  const pos = side === 'right' ? 'right-0' : 'left-0';
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/40" onClick={onClose} />
      <aside className={`w-full max-w-md bg-white shadow-xl ${pos}`}>
        <header className="border-b border-slate-100 px-5 py-4 flex justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </header>
        <div className="p-5">{children}</div>
      </aside>
    </div>
  );
}
