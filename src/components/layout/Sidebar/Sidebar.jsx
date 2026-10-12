import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  Building2,
  FileText,
  CheckSquare,
  Calendar,
  Users,
  Bell,
  Settings,
  Shield,
  Crown,
} from 'lucide-react';
import { PATHS } from '../../../routes/routePaths.js';

export function Sidebar() {
  const unread = useSelector((s) => s.notifications.unreadCount || 0);
  const user = useSelector((s) => s.auth.user);

  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'superadmin';

  const items = [
    { to: PATHS.overview, label: 'Overview', icon: Home },
    { to: PATHS.brands, label: 'Brands', icon: Building2 },      // ⭐ NEW
    { to: PATHS.posts, label: 'Posts', icon: FileText },
    { to: PATHS.approval, label: 'Approval Center', icon: CheckSquare },
    { to: PATHS.calendar, label: 'Calendar', icon: Calendar },
    { to: PATHS.accounts, label: 'Social Accounts', icon: Users },
    { to: PATHS.notifications, label: 'Notifications', icon: Bell },
    { to: PATHS.brandSettings, label: 'Brand settings', icon: Settings },

    // ⭐ Admin ONLY
    ...(isAdmin
      ? [{ to: PATHS.admin, label: 'Admin Panel', icon: Shield }]
      : []),

    // ⭐ SuperAdmin ONLY
    ...(isSuperAdmin
      ? [{ to: PATHS.superadmin, label: 'SuperAdmin', icon: Crown }]
      : []),
  ];

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="px-5 py-4 text-lg font-semibold">SocialDesk</div>

      <nav className="mt-2 flex-1 space-y-1 px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {label === 'Notifications' && unread > 0 && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        ILLUSTRATIVE WORKSPACE
      </div>
    </aside>
  );
}