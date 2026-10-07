import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { logout, selectUser } from '../../../features/auth/authSlice.js';
import { initials } from '../../../utils/format.js';
import { PATHS } from '../../../routes/routePaths.js';

export function Topbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate(PATHS.login, { replace: true });
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="text-sm text-slate-500">Workspace</div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-slate-800">
              {user?.name || 'User'}
            </div>
            <div className="text-xs text-slate-500">
              {user?.email || 'user@example.com'}
            </div>
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials(user?.name || user?.email || 'U')}
          </div>

          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {initials(user?.name || user?.email || 'U')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {user?.name || 'User'}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
              </div>
              {user?.role && user.role !== 'user' && (
                <div className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium uppercase text-indigo-700">
                  {user.role}
                </div>
              )}
            </div>

            <div className="py-1">
              <button
                onClick={() => handleNavigate(PATHS.brandSettings)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
              >
                <User size={14} className="text-slate-400" />
                Profile
              </button>

              <button
                onClick={() => handleNavigate(PATHS.brandSettings)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
              >
                <Settings size={14} className="text-slate-400" />
                Brand settings
              </button>
            </div>

            <div className="border-t border-slate-100 py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}