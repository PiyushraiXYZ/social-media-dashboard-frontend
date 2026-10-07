import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-slate-950 p-10 text-white md:flex">
        <div>
          <div className="text-xl font-semibold">SocialDesk</div>
          <p className="mt-6 max-w-sm text-sm text-slate-300">
            A little inspiration. A clearer workflow. Generate, refine, approve, and publish — with every destination in view.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-slate-400">
          <li>• Create content with AI</li>
          <li>• Make every post unmistakably yours</li>
          <li>• Know what happened on each platform</li>
        </ul>
      </aside>
      <main className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md"><Outlet /></div>
      </main>
    </div>
  );
}
