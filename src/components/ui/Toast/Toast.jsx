import { useEffect } from 'react';

export function Toast({ message, tone = 'info', onClose, timeout = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose?.(), timeout);
    return () => clearTimeout(id);
  }, [message, onClose, timeout]);

  if (!message) return null;
  const tones = { info: 'bg-slate-900', success: 'bg-emerald-600', danger: 'bg-red-600' };
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-2 text-sm text-white shadow-lg ${tones[tone]}`}>
      {message}
    </div>
  );
}
