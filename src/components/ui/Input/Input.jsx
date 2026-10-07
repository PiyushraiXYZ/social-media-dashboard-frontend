import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, className = '', ...rest }, ref) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <input ref={ref} className={`input ${className}`} {...rest} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
