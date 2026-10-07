import { useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

/* ═══════════════════════════════════════════════════════════
   Position → Tailwind classes for the overlay text
   ═══════════════════════════════════════════════════════════ */
const POSITION_CLASSES = {
  'top-left': 'items-start justify-start',
  'top-center': 'items-start justify-center',
  'top-right': 'items-start justify-end',
  'center-left': 'items-center justify-start',
  center: 'items-center justify-center',
  'center-right': 'items-center justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-center': 'items-end justify-center',
  'bottom-right': 'items-end justify-end',
};

export function BrandPreview() {
  const profile = useSelector((s) => s.brand.profile);
  const footerUrl = useSelector((s) => s.brand.footer_url);
  const overlay = useSelector((s) => s.brand.overlay);

  const logoUrl = profile.logo_url;
  const brandName = profile.brand_name || 'Your Brand';

  const overlayText = overlay?.text || '';
  const overlayPosition = overlay?.position || 'top-center';
  const overlayTextSize = Number(overlay?.text_size) || 40;

  const positionClass = POSITION_CLASSES[overlayPosition] || POSITION_CLASSES['top-center'];

  // Determine if we have anything to show
  const hasLogo = Boolean(logoUrl);
  const hasFooter = Boolean(footerUrl);
  const hasOverlay = Boolean(overlayText);
  const hasAnything = hasLogo || hasFooter || hasOverlay;

  return (
    <Card
      title="Brand preview"
      subtitle="This is how your branded image will look."
    >
      {!hasAnything && (
        <Alert tone="info" title="Nothing to preview yet">
          Upload a logo or footer, and set overlay text to see a live
          preview here.
        </Alert>
      )}

      {hasAnything && (
        <div className="space-y-4">
          {/* ═══ Preview Canvas ═══ */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            {/* Base background — placeholder image or gradient */}
            {/*
              If you have a sample image URL, you can use it here.
              For now we use a gradient backdrop.
            */}

            {/* ─── Logo (top-left) ─── */}
            {hasLogo && (
              <img
                src={logoUrl}
                alt="Brand logo"
                className="absolute left-4 top-4 h-10 w-auto object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            {/* ─── Overlay Text ─── */}
            {hasOverlay && (
              <div
                className={`pointer-events-none absolute inset-0 flex p-8 ${positionClass}`}
              >
                <div
                  className="text-center font-bold text-white drop-shadow-lg"
                  style={{ fontSize: `${overlayTextSize}px`, lineHeight: 1.1 }}
                >
                  {overlayText}
                </div>
              </div>
            )}

            {/* ─── Footer (bottom-full) ─── */}
            {hasFooter && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm">
                <img
                  src={footerUrl}
                  alt="Brand footer"
                  className="h-10 w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* ═══ Status Badges ═══ */}
          <div className="flex flex-wrap gap-2">
            {hasLogo && <Badge tone="success">✓ Logo</Badge>}
            {hasOverlay && <Badge tone="success">✓ Overlay text</Badge>}
            {hasFooter && <Badge tone="success">✓ Footer</Badge>}

            {!hasLogo && <Badge tone="neutral">Logo not set</Badge>}
            {!hasOverlay && <Badge tone="neutral">Overlay not set</Badge>}
            {!hasFooter && <Badge tone="neutral">Footer not set</Badge>}
          </div>

          {/* ═══ Current Settings ═══ */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium text-slate-700">Brand:</span>{' '}
                {brandName}
              </div>
              <div>
                <span className="font-medium text-slate-700">Position:</span>{' '}
                {overlayPosition}
              </div>
              <div>
                <span className="font-medium text-slate-700">Text size:</span>{' '}
                {overlayTextSize}px
              </div>
              <div>
                <span className="font-medium text-slate-700">Tone:</span>{' '}
                {profile.tone || '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}