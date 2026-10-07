export function FormatChecks() {
  const rows = [
    ['Facebook', 'Image, video, or text'],
    ['LinkedIn', 'Image or text after validation'],
    ['Instagram', 'Supported media required; text-only not selectable'],
  ];
  return (
    <ul className="space-y-2 text-sm">
      {rows.map(([k, v]) => (
        <li key={k} className="flex justify-between">
          <span className="text-slate-600">{k}</span>
          <span className="text-right text-slate-800">{v}</span>
        </li>
      ))}
    </ul>
  );
}

