import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <header className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold">{title}</h3>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</footer>}
      </div>
    </div>
  );
}
