export function Table({ columns = [], rows = [], empty = 'No records' }) {
  if (!rows.length) return <div className="p-6 text-sm text-slate-500">{empty}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            {columns.map((c) => <th key={c.key} className="px-4 py-3">{c.title}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-middle">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
