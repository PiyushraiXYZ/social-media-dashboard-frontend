const items = [
  'Business or Creator Instagram account',
  'Account linked to the selected Facebook Page',
  'Required Page and Instagram permissions',
  'Supported image or video / Reel for publishing',
];

export function InstagramEligibilityChecklist() {
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
          {t}
        </li>
      ))}
      <li className="pt-2 text-xs text-slate-500">
        Personal accounts aren't eligible. Switch to a Business or Creator account and link it to a Page.
      </li>
    </ul>
  );
}
