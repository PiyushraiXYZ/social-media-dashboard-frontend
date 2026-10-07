export function MediaPreview({ src, alt = 'preview', footer }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      <img src={src} alt={alt} className="block w-full" />
      {footer && (
        <figcaption className="bg-slate-100 px-3 py-2 text-xs text-slate-600">{footer}</figcaption>
      )}
    </figure>
  );
}
