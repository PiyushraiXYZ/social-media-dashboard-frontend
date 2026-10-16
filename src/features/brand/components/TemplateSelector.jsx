import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setProfile, setOverlay, setAppliedTemplate } from '../brandSlice.js';
import { Check } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   CATEGORIES
   ═══════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍' },
  { id: 'work-anniv', label: 'Work Anniv.', emoji: '🏆' },
  { id: 'congrats', label: 'Congrats', emoji: '🎉' },
  { id: 'festival', label: 'Festival', emoji: '🪔' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'motivational', label: 'Motivational', emoji: '🚀' },
];

/* ═══════════════════════════════════════════════════════
   TEMPLATES — with bgImage (static, later AI-generated)
   ═══════════════════════════════════════════════════════ */

const TEMPLATES = [
  /* ═══════ BIRTHDAY ═══════ */
  {
    id: 'bday-confetti',
    name: 'Confetti Party',
    category: 'birthday',
    bg: 'from-pink-500 via-fuchsia-600 to-purple-700',
    bgImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎉',
  },
  {
    id: 'bday-balloons',
    name: 'Balloon Bash',
    category: 'birthday',
    bg: 'from-red-400 via-orange-500 to-yellow-500',
    bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1080&q=80',
    overlayPos: 'top-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎈',
  },
  {
    id: 'bday-cake',
    name: 'Sweet Cake',
    category: 'birthday',
    bg: 'from-rose-400 via-pink-500 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎂',
  },
  {
    id: 'bday-neon',
    name: 'Neon Party',
    category: 'birthday',
    bg: 'from-purple-700 via-indigo-700 to-blue-900',
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#a5f3fc',
    logoPos: { x: 4, y: 4 },
    emoji: '🎊',
  },

  /* ═══════ ANNIVERSARY ═══════ */
  {
    id: 'anniv-romantic',
    name: 'Romantic Red',
    category: 'anniversary',
    bg: 'from-red-600 via-rose-700 to-pink-900',
    bgImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '💕',
  },
  {
    id: 'anniv-golden',
    name: 'Golden Elegance',
    category: 'anniversary',
    bg: 'from-yellow-500 via-amber-600 to-orange-700',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '💛',
  },
  {
    id: 'anniv-roses',
    name: 'Rose Garden',
    category: 'anniversary',
    bg: 'from-pink-400 via-rose-500 to-red-700',
    bgImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1080&q=80',
    overlayPos: 'top-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🌹',
  },
  {
    id: 'anniv-elegant',
    name: 'Black & Gold',
    category: 'anniversary',
    bg: 'from-black via-slate-900 to-yellow-900',
    bgImage: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#fcd34d',
    logoPos: { x: 4, y: 4 },
    emoji: '🥂',
  },

  /* ═══════ WORK ANNIVERSARY ═══════ */
  {
    id: 'work-corporate',
    name: 'Corporate Blue',
    category: 'work-anniv',
    bg: 'from-blue-700 via-blue-900 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🏢',
  },
  {
    id: 'work-achievement',
    name: 'Achievement',
    category: 'work-anniv',
    bg: 'from-emerald-600 via-teal-700 to-blue-900',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎯',
  },
  {
    id: 'work-trophy',
    name: 'Trophy Gold',
    category: 'work-anniv',
    bg: 'from-amber-500 via-yellow-600 to-orange-700',
    bgImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1080&q=80',
    overlayPos: 'top-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🏆',
  },
  {
    id: 'work-milestone',
    name: 'Milestone',
    category: 'work-anniv',
    bg: 'from-indigo-600 via-purple-700 to-pink-800',
    bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '⭐',
  },

  /* ═══════ CONGRATULATIONS ═══════ */
  {
    id: 'congrats-celebration',
    name: 'Celebration',
    category: 'congrats',
    bg: 'from-yellow-400 via-orange-500 to-pink-600',
    bgImage: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎉',
  },
  {
    id: 'congrats-success',
    name: 'Success Green',
    category: 'congrats',
    bg: 'from-green-500 via-emerald-600 to-teal-800',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '✅',
  },

  /* ═══════ FESTIVAL ═══════ */
  {
    id: 'fest-diwali',
    name: 'Diwali Gold',
    category: 'festival',
    bg: 'from-yellow-500 via-amber-700 to-red-800',
    bgImage: 'https://images.unsplash.com/photo-1604423043492-41303788de58?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🪔',
  },
  {
    id: 'fest-holi',
    name: 'Holi Colors',
    category: 'festival',
    bg: 'from-pink-500 via-yellow-500 to-cyan-500',
    bgImage: 'https://images.unsplash.com/photo-1617126777011-5d15f9f6e6a5?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🌈',
  },
  {
    id: 'fest-christmas',
    name: 'Christmas Red',
    category: 'festival',
    bg: 'from-red-600 via-green-700 to-red-900',
    bgImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
    emoji: '🎄',
  },
  {
    id: 'fest-newyear',
    name: 'New Year',
    category: 'festival',
    bg: 'from-purple-700 via-blue-800 to-black',
    bgImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#fbbf24',
    logoPos: { x: 4, y: 4 },
    emoji: '✨',
  },

  /* ═══════ TECH ═══════ */
  {
    id: 'tech-dark',
    name: 'Dark Tech',
    category: 'tech',
    bg: 'from-slate-800 via-slate-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'tech-blue',
    name: 'Blue Gradient',
    category: 'tech',
    bg: 'from-blue-600 via-blue-800 to-indigo-900',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&q=80',
    overlayPos: 'top-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'tech-purple',
    name: 'Purple Night',
    category: 'tech',
    bg: 'from-purple-800 via-purple-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#c4b5fd',
    logoPos: { x: 4, y: 4 },
  },

  /* ═══════ BUSINESS ═══════ */
  {
    id: 'business-clean',
    name: 'Clean Corporate',
    category: 'business',
    bg: 'from-slate-200 via-slate-300 to-slate-400',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&q=80',
    overlayPos: 'top-left',
    overlayColor: '#0f172a',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'business-navy',
    name: 'Navy Professional',
    category: 'business',
    bg: 'from-blue-900 via-slate-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },

  /* ═══════ FOOD ═══════ */
  {
    id: 'food-warm',
    name: 'Warm Kitchen',
    category: 'food',
    bg: 'from-amber-600 via-orange-700 to-red-800',
    bgImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&q=80',
    overlayPos: 'bottom-left',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'food-fresh',
    name: 'Fresh Green',
    category: 'food',
    bg: 'from-green-500 via-emerald-700 to-teal-900',
    bgImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1080&q=80',
    overlayPos: 'top-left',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },

  /* ═══════ CREATIVE ═══════ */
  {
    id: 'creative-pink',
    name: 'Pink Burst',
    category: 'creative',
    bg: 'from-pink-500 via-rose-700 to-purple-900',
    bgImage: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'creative-mint',
    name: 'Mint Fresh',
    category: 'creative',
    bg: 'from-teal-400 via-cyan-600 to-blue-800',
    bgImage: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1080&q=80',
    overlayPos: 'top-right',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },

  /* ═══════ MOTIVATIONAL ═══════ */
  {
    id: 'moti-bold',
    name: 'Bold Black',
    category: 'motivational',
    bg: 'from-black via-slate-900 to-slate-800',
    bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#fbbf24',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'moti-sunrise',
    name: 'Sunrise',
    category: 'motivational',
    bg: 'from-orange-400 via-pink-500 to-purple-700',
    bgImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1080&q=80',
    overlayPos: 'center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
  {
    id: 'moti-ocean',
    name: 'Ocean Wave',
    category: 'motivational',
    bg: 'from-cyan-500 via-blue-700 to-indigo-900',
    bgImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1080&q=80',
    overlayPos: 'bottom-center',
    overlayColor: '#ffffff',
    logoPos: { x: 4, y: 4 },
  },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function TemplateSelector() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('all');
  const [appliedId, setAppliedId] = useState(null);

  const filteredTemplates =
    activeCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const applyTemplate = (template) => {
    setAppliedId(template.id);
    dispatch(setAppliedTemplate(template));
    dispatch(setProfile({
      logo_position_x: template.logoPos.x,
      logo_position_y: template.logoPos.y,
    }));
    dispatch(setOverlay({
      position: template.overlayPos,
      color: template.overlayColor,
    }));
  };

  return (
    <div className="space-y-3">

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
              activeCategory === cat.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            <span className="mr-1">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* TEMPLATE GRID — shows bgImage thumbnail */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
        {filteredTemplates.map((t) => {
          const isSelected = appliedId === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-200'
                  : 'border-slate-200 hover:border-brand-400'
              }`}
              title={t.name}
            >
              {/* ⭐ Thumbnail — bgImage if present, else gradient */}
              {t.bgImage ? (
                <img
                  src={t.bgImage}
                  alt={t.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${t.bg}`} />
              )}

              {/* Emoji + Aa preview */}
              <div className="relative flex h-full flex-col items-center justify-center gap-0.5 bg-black/30">
                {t.emoji && <span className="text-sm">{t.emoji}</span>}
                <span
                  className="text-[9px] font-bold"
                  style={{ color: t.overlayColor }}
                >
                  Aa
                </span>
              </div>

              {/* Selected check */}
              {isSelected && (
                <div className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-white">
                  <Check size={9} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-md bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
        💡 Click a template to apply. Customize further below.
      </div>
    </div>
  );
}