import { MediaPreview } from '../MediaPreview/MediaPreview.jsx';

export function BrandPreview({ src, text, position = 'top-center', footer }) {
  const posClass = {
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',
    'center-left': 'items-center justify-start',
    center: 'items-center justify-center',
    'center-right': 'items-center justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end',
  }[position];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200">
      <img src={src} alt="brand preview" className="block w-full" />
      <div className={`pointer-events-none absolute inset-0 flex p-6 ${posClass}`}>
        <div className="text-3xl font-bold text-white drop-shadow-md">{text}</div>
      </div>
      {footer && <div className="bg-slate-100 px-3 py-2 text-xs text-slate-600">{footer}</div>}
    </div>
  );
}
