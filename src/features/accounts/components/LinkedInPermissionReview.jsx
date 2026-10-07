export function LinkedInPermissionReview() {
  const rows = [
    ['Member identity', 'Received'],
    ['Images API access', 'Pending'],
    ['Posts API access', 'Pending'],
    ['Live publishing', 'Unavailable'],
  ];
  return (
    <ul className="divide-y divide-slate-100 text-sm">
      {rows.map(([k, v]) => (
        <li key={k} className="flex justify-between py-2">
          <span className="text-slate-600">{k}</span>
          <span className="font-medium text-slate-800">{v}</span>
        </li>
      ))}
    </ul>
  );
}
