import { Outlet } from 'react-router-dom';
import { Check } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* ═══ LEFT: Brand Panel ═══ */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a0a1f] via-[#151034] to-[#0a0a1f] p-10 text-white md:flex md:flex-col md:justify-between">
        {/* Background AI network image */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'screen',
          }}
        />

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a1f]/40 via-transparent to-[#0a0a1f]/80" />

        {/* Top content */}
        <div className="relative z-10">
          <div className="text-2xl font-semibold tracking-tight">
            SocialDesk
          </div>
          <p className="mt-6 max-w-sm text-base text-slate-200">
            A little inspiration. A clearer workflow. Generate, refine,
            approve, and publish — with every destination in view.
          </p>
        </div>

        {/* Feature list with checkmarks */}
        <ul className="relative z-10 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 ring-1 ring-white/20">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
            <span className="text-slate-200">Create content with AI</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 ring-1 ring-white/20">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
            <span className="text-slate-200">
              Make every post unmistakably yours
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 ring-1 ring-white/20">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
            <span className="text-slate-200">
              Know what happened on each platform
            </span>
          </li>
        </ul>
      </aside>

      {/* ═══ RIGHT: Auth Form ═══ */}
      <main className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}