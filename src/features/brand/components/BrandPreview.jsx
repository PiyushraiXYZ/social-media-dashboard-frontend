import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import html2canvas from 'html2canvas';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Move, RotateCcw, Check, Download } from 'lucide-react';
import { setProfile } from '../brandSlice.js';
import { TemplateSelector } from './TemplateSelector.jsx';

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

const DEFAULT_TEMPLATE = {
  id: 'default',
  name: 'Default',
  bg: 'from-indigo-600 via-purple-700 to-slate-900',
  bgImage: null,
  emoji: null,
  overlayPos: 'bottom-center',
  overlayColor: '#ffffff',
  logoPos: { x: 4, y: 4 },
};

export function BrandPreview() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.brand.profile);
  const footerUrl = useSelector((s) => s.brand.footer_url);
  const overlay = useSelector((s) => s.brand.overlay);
  const appliedTemplate = useSelector((s) => s.brand.appliedTemplate);

  const activeTemplate = appliedTemplate || DEFAULT_TEMPLATE;

  const logoUrl = profile.logo_url;
  const overlayText = overlay?.text || '';
  const overlayPosition = overlay?.position || 'top-center';
  const overlayTextSize = Number(overlay?.text_size) || 40;
  const overlayColor = overlay?.color || '#ffffff';

  const positionClass =
    POSITION_CLASSES[overlayPosition] || POSITION_CLASSES['top-center'];

  const [logoSize, setLogoSize] = useState(profile.logo_size || 60);
  const [logoX, setLogoX] = useState(profile.logo_position_x ?? 4);
  const [logoY, setLogoY] = useState(profile.logo_position_y ?? 4);

  const [footerHeight, setFooterHeight] = useState(
    profile.footer_height ?? 60
  );
  const [footerWidth, setFooterWidth] = useState(
    profile.footer_width ?? 100
  );
  const [footerX, setFooterX] = useState(profile.footer_position_x ?? 0);
  const [footerY, setFooterY] = useState(profile.footer_position_y ?? 0);

  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [logoChanged, setLogoChanged] = useState(false);
  const [footerChanged, setFooterChanged] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (appliedTemplate) {
      setLogoX(profile.logo_position_x ?? 4);
      setLogoY(profile.logo_position_y ?? 4);
      setFooterX(profile.footer_position_x ?? 0);
      setFooterY(profile.footer_position_y ?? 0);
    }
  }, [appliedTemplate, profile]);

  const handleMouseDown = (e) => {
    if (!logoUrl) return;
    e.preventDefault();
    setDragging(true);

    const rect = containerRef.current.getBoundingClientRect();
    const currentLogoX = (logoX / 100) * rect.width;
    const currentLogoY = (logoY / 100) * rect.height;

    setDragOffset({
      x: e.clientX - rect.left - currentLogoX,
      y: e.clientY - rect.top - currentLogoY,
    });
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const rawX = e.clientX - rect.left - dragOffset.x;
      const rawY = e.clientY - rect.top - dragOffset.y;

      const pctX = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
      const pctY = Math.max(0, Math.min(100, (rawY / rect.height) * 100));

      setLogoX(Math.round(pctX));
      setLogoY(Math.round(pctY));
      setLogoChanged(true);
    };

    const handleUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, dragOffset]);

  const handleResetLogo = () => {
    setLogoSize(60);
    setLogoX(4);
    setLogoY(4);
    setLogoChanged(false);
  };

  const handleResetFooter = () => {
    setFooterHeight(60);
    setFooterWidth(100);
    setFooterX(0);
    setFooterY(0);
    setFooterChanged(false);
  };

  const handleSaveLogo = () => {
    dispatch(setProfile({
      logo_size: logoSize,
      logo_position_x: logoX,
      logo_position_y: logoY,
    }));
    setLogoChanged(false);
  };

  const handleSaveFooter = () => {
    dispatch(setProfile({
      footer_height: footerHeight,
      footer_width: footerWidth,
      footer_position_x: footerX,
      footer_position_y: footerY,
    }));
    setFooterChanged(false);
  };

  /* ⭐ DOWNLOAD — capture canvas as PNG */
  const handleDownload = async () => {
    if (!containerRef.current) return;

    setDownloading(true);

    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        ignoreElements: (element) => {
          return element.hasAttribute('data-html2canvas-ignore');
        },
      });

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setDownloading(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `brand-preview-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setDownloading(false);
        },
        'image/png',
        0.95
      );
    } catch (err) {
      console.error('Download failed:', err);
      setDownloading(false);
    }
  };

  const hasLogo = Boolean(logoUrl);
  const hasFooter = Boolean(footerUrl);
  const hasOverlay = Boolean(overlayText);
  const hasAnything = hasLogo || hasFooter || hasOverlay || appliedTemplate;

  const canvasBg = activeTemplate.bg;

  return (
    <Card title="Brand preview">
      {/* TEMPLATE SELECTOR */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">
            🎨 Quick templates
          </div>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
            {activeTemplate.name}
          </span>
        </div>
        <TemplateSelector />
      </div>

      {!hasAnything && (
        <Alert tone="info">
          Upload a logo or footer to see a preview.
        </Alert>
      )}

      {hasAnything && (
        <div className="space-y-4">

          {/* CANVAS */}
          <div
            ref={containerRef}
            className={`relative aspect-square w-full select-none overflow-hidden rounded-xl border border-slate-200 shadow-lg ${
              !activeTemplate.bgImage ? `bg-gradient-to-br ${canvasBg}` : ''
            }`}
            style={
              activeTemplate.bgImage
                ? {
                    backgroundImage: `url(${activeTemplate.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : {}
            }
          >
            {/* ⭐ DOWNLOAD BUTTON — top-right corner */}
            <button
              type="button"
              data-html2canvas-ignore="true"
              onClick={handleDownload}
              disabled={downloading}
              className="absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm transition hover:bg-black/90 disabled:opacity-50"
              title="Download as PNG"
            >
              <Download size={12} />
              {downloading ? 'Saving…' : 'Download'}
            </button>

            {/* Dark overlay for readability */}
            {activeTemplate.bgImage && (
              <div className="absolute inset-0 bg-black/40" />
            )}

            {/* EMOJI STICKER */}
            {activeTemplate.emoji && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span
                  style={{
                    fontSize: '180px',
                    lineHeight: 1,
                    opacity: 0.85,
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
                  }}
                >
                  {activeTemplate.emoji}
                </span>
              </div>
            )}

            {/* Logo */}
            {hasLogo && (
              <div
                onMouseDown={handleMouseDown}
                className={`absolute cursor-move rounded-md transition-shadow ${
                  dragging
                    ? 'ring-2 ring-brand-400 shadow-lg'
                    : 'hover:ring-2 hover:ring-brand-200'
                }`}
                style={{
                  left: `${logoX}%`,
                  top: `${logoY}%`,
                  width: `${logoSize}px`,
                }}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="block h-auto w-full select-none drop-shadow-md pointer-events-none"
                  draggable={false}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute -left-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white shadow">
                  <Move size={10} />
                </div>
              </div>
            )}

            {/* Overlay text */}
            {hasOverlay && (
              <div
                className={`pointer-events-none absolute inset-0 flex p-6 ${positionClass}`}
              >
                <div
                  className="text-center font-bold drop-shadow-lg"
                  style={{
                    fontSize: `${overlayTextSize}px`,
                    lineHeight: 1.1,
                    color: overlayColor,
                  }}
                >
                  {overlayText}
                </div>
              </div>
            )}

            {/* Footer */}
            {hasFooter && footerHeight > 0 && (
              <div
                className="absolute bg-black/40 backdrop-blur-sm"
                style={{
                  left: `${footerX}%`,
                  bottom: `${footerY}%`,
                  width: `${footerWidth}%`,
                  height: `${footerHeight}px`,
                }}
              >
                <img
                  src={footerUrl}
                  alt="Footer"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {dragging && (
              <div className="pointer-events-none absolute inset-0 bg-brand-500/5" />
            )}

            {/* Hint — bottom-right */}
            <div
              data-html2canvas-ignore="true"
              className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white"
            >
              💡 Drag logo to move
            </div>
          </div>

          {/* CONTROLS */}
          <div className="grid gap-3 sm:grid-cols-2">
            {hasLogo && (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-800">Logo</div>
                  <Button variant="ghost" size="sm" onClick={handleResetLogo}>
                    <RotateCcw size={12} />
                  </Button>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Size</span>
                    <span className="text-slate-500">{logoSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    value={logoSize}
                    onChange={(e) => {
                      setLogoSize(Number(e.target.value));
                      setLogoChanged(true);
                    }}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">X</span>
                      <span className="text-slate-500">{logoX}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={logoX}
                      onChange={(e) => {
                        setLogoX(Number(e.target.value));
                        setLogoChanged(true);
                      }}
                      className="w-full accent-brand-600"
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">Y</span>
                      <span className="text-slate-500">{logoY}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={logoY}
                      onChange={(e) => {
                        setLogoY(Number(e.target.value));
                        setLogoChanged(true);
                      }}
                      className="w-full accent-brand-600"
                    />
                  </div>
                </div>
                {logoChanged && (
                  <div className="flex items-center justify-between rounded-md bg-amber-50 px-2 py-1.5">
                    <span className="text-xs text-amber-700">Unsaved</span>
                    <Button size="sm" onClick={handleSaveLogo}>
                      <Check size={12} />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            )}

            {hasFooter && (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-800">Footer</div>
                  <Button variant="ghost" size="sm" onClick={handleResetFooter}>
                    <RotateCcw size={12} />
                  </Button>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Height</span>
                    <span className={footerHeight === 0 ? 'text-red-600 font-medium' : 'text-slate-500'}>
                      {footerHeight}px{footerHeight === 0 && ' (hidden)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={footerHeight}
                    onChange={(e) => {
                      setFooterHeight(Number(e.target.value));
                      setFooterChanged(true);
                    }}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Width</span>
                    <span className="text-slate-500">{footerWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={footerWidth}
                    onChange={(e) => {
                      setFooterWidth(Number(e.target.value));
                      setFooterChanged(true);
                    }}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">X</span>
                      <span className="text-slate-500">{footerX}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={footerX}
                      onChange={(e) => {
                        setFooterX(Number(e.target.value));
                        setFooterChanged(true);
                      }}
                      className="w-full accent-brand-600"
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">Y</span>
                      <span className="text-slate-500">{footerY}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={footerY}
                      onChange={(e) => {
                        setFooterY(Number(e.target.value));
                        setFooterChanged(true);
                      }}
                      className="w-full accent-brand-600"
                    />
                  </div>
                </div>
                {footerChanged && (
                  <div className="flex items-center justify-between rounded-md bg-amber-50 px-2 py-1.5">
                    <span className="text-xs text-amber-700">Unsaved</span>
                    <Button size="sm" onClick={handleSaveFooter}>
                      <Check size={12} />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}