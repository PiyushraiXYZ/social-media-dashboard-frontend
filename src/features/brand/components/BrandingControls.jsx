import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useUpdateOverlayMutation } from '../api.js';
import { setOverlay } from '../brandSlice.js';
import { Check, Sparkles, RotateCcw, Type, Palette } from 'lucide-react';

const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

/* ⭐ Enhanced color palette with categories */
const COLOR_GROUPS = [
  {
    label: 'Neutrals',
    colors: [
      { value: '#ffffff', label: 'White' },
      { value: '#f1f5f9', label: 'Light Gray' },
      { value: '#64748b', label: 'Slate' },
      { value: '#1e293b', label: 'Charcoal' },
      { value: '#000000', label: 'Black' },
    ],
  },
  {
    label: 'Vibrant',
    colors: [
      { value: '#ef4444', label: 'Red' },
      { value: '#f59e0b', label: 'Amber' },
      { value: '#eab308', label: 'Yellow' },
      { value: '#10b981', label: 'Green' },
      { value: '#06b6d4', label: 'Cyan' },
      { value: '#3b82f6', label: 'Blue' },
      { value: '#8b5cf6', label: 'Purple' },
      { value: '#ec4899', label: 'Pink' },
    ],
  },
  {
    label: 'Brand',
    colors: [
      { value: '#6366f1', label: 'Indigo' },
      { value: '#dc2626', label: 'Crimson' },
      { value: '#059669', label: 'Emerald' },
      { value: '#7c3aed', label: 'Violet' },
      { value: '#db2777', label: 'Rose' },
    ],
  },
];

/* ⭐ Contrast helper — for readability check */
function getLuminance(hex) {
  const clean = (hex || '#ffffff').replace('#', '');
  if (clean.length !== 6) return 1;

  const r = parseInt(clean.substr(0, 2), 16) / 255;
  const g = parseInt(clean.substr(2, 2), 16) / 255;
  const b = parseInt(clean.substr(4, 2), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

const FONT_WEIGHTS = [
  { value: 'font-normal', label: 'Regular' },
  { value: 'font-bold', label: 'Bold' },
  { value: 'font-extrabold', label: 'Black' },
];

export function BrandingControls() {
  const overlay = useSelector((s) => s.brand.overlay);
  const dispatch = useDispatch();
  const [updateOverlay, { isLoading }] = useUpdateOverlayMutation();
  const [feedback, setFeedback] = useState(null);
  const [recentColors, setRecentColors] = useState([]);

  /* Track recent colors */
  useEffect(() => {
    const color = overlay.color || '#ffffff';
    if (!recentColors.includes(color)) {
      setRecentColors((prev) => [color, ...prev].slice(0, 5));
    }
  }, [overlay.color]);  // eslint-disable-line

  const handleSave = async () => {
    setFeedback(null);
    try {
      await updateOverlay({
        text: overlay.text,
        position: overlay.position,
        text_size: Number(overlay.text_size) || 40,
        color: overlay.color || '#ffffff',
      }).unwrap();
      setFeedback({ tone: 'success', message: 'Overlay saved ✅' });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Save failed',
      });
    }
  };

  const currentColor = overlay.color || '#ffffff';
  const luminance = getLuminance(currentColor);
  const isLight = luminance > 0.6;

  return (
    <Card title="Overlay text">
      <div className="space-y-4">

        {/* ═══════════════════════════════════════
            LIVE PREVIEW CHIP
            ═══════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-4">
          <div
            className="text-center font-bold drop-shadow-lg"
            style={{
              fontSize: `${Math.min(overlay.text_size || 40, 32)}px`,
              color: currentColor,
              lineHeight: 1.2,
            }}
          >
            {overlay.text || 'Preview text'}
          </div>
          <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
            Live preview
          </div>
        </div>

        {/* ═══════════════════════════════════════
            TEXT INPUT
            ═══════════════════════════════════════ */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-600">
            <Type size={11} />
            Text
          </label>
          <input
            className="input"
            value={overlay.text}
            onChange={(e) => dispatch(setOverlay({ text: e.target.value }))}
            placeholder="Build. Learn. Grow."
          />
        </div>

        {/* ═══════════════════════════════════════
            POSITION + SIZE
            ═══════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Position
            </label>
            <select
              className="input"
              value={overlay.position}
              onChange={(e) =>
                dispatch(setOverlay({ position: e.target.value }))
              }
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Size (px)
            </label>
            <input
              type="number"
              className="input"
              value={overlay.text_size}
              onChange={(e) =>
                dispatch(setOverlay({ text_size: e.target.value }))
              }
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            TEXT COLOR — ENHANCED
            ═══════════════════════════════════════ */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-1 text-xs font-medium text-slate-600">
              <Palette size={11} />
              Text color
            </label>

            {/* Contrast indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">
                {isLight ? '☀️ Light' : '🌙 Dark'}
              </span>
              <span className="font-mono text-[10px] uppercase text-slate-500">
                {currentColor}
              </span>
            </div>
          </div>

          {/* Picker + Hex + Reset */}
          <div className="flex items-center gap-2">
            <label
              className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: currentColor }}
              title="Click to pick a custom color"
            >
              <input
                type="color"
                value={currentColor}
                onChange={(e) =>
                  dispatch(setOverlay({ color: e.target.value }))
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              {/* Color preview icon */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className={`text-base ${isLight ? 'text-slate-800' : 'text-white'}`}
                >
                  🎨
                </div>
              </div>
            </label>

            <input
              type="text"
              className="input flex-1 font-mono text-xs uppercase"
              value={currentColor}
              onChange={(e) =>
                dispatch(setOverlay({ color: e.target.value }))
              }
              placeholder="#FFFFFF"
              maxLength={7}
            />

            <button
              type="button"
              onClick={() => dispatch(setOverlay({ color: '#ffffff' }))}
              className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              title="Reset to white"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* ═══ RECENT COLORS ═══ */}
          {recentColors.length > 1 && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                <Sparkles size={10} />
                Recent
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.slice(1).map((c, idx) => (
                  <button
                    key={`${c}-${idx}`}
                    type="button"
                    onClick={() => dispatch(setOverlay({ color: c }))}
                    className="h-6 w-6 rounded-md border border-slate-200 transition hover:scale-110"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ═══ COLOR GROUPS ═══ */}
          {COLOR_GROUPS.map((group) => (
            <div key={group.label} className="mt-3">
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {group.label}
              </div>

              <div className="flex flex-wrap gap-2">
                {group.colors.map((c) => {
                  const isSelected =
                    currentColor.toLowerCase() === c.value.toLowerCase();

                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() =>
                        dispatch(setOverlay({ color: c.value }))
                      }
                      className={`group relative grid h-8 w-8 place-items-center rounded-full border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-brand-500 ring-2 ring-brand-200 scale-110'
                          : 'border-slate-200 hover:border-slate-300 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {isSelected && (
                        <Check
                          size={12}
                          strokeWidth={3}
                          className={
                            c.value === '#ffffff' ||
                            c.value === '#f1f5f9' ||
                            c.value === '#eab308' ||
                            c.value === '#f59e0b'
                              ? 'text-slate-900'
                              : 'text-white'
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            FEEDBACK
            ═══════════════════════════════════════ */}
        {feedback && (
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        )}

        {/* ═══════════════════════════════════════
            SAVE
            ═══════════════════════════════════════ */}
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? 'Saving…' : 'Apply branding'}
        </Button>
      </div>
    </Card>
  );
}