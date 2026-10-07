export function Skeleton({ className = '', rows = 1 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-md bg-slate-200 ${className || 'h-4 w-full'}`} />
      ))}
    </div>
  );
}
