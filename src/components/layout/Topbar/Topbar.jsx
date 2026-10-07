import { useSelector } from 'react-redux';
import { initials } from '../../../utils/format.js';

export function Topbar() {
  const user = useSelector((s) => s.auth.user);
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="text-sm text-slate-500">Workspace</div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-800">{user?.name || 'Maya Chen'}</div>
          <div className="text-xs text-slate-500">{user?.email || 'maya@northstar.example'}</div>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {initials(user?.name || 'Maya Chen')}
        </div>
      </div>
    </header>
  );
}
