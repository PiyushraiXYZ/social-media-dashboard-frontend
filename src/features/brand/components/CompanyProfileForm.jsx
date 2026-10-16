import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useSaveProfileMutation } from '../api.js';
import { setProfile } from '../brandSlice.js';
import { ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Static Options
   ═══════════════════════════════════════════════════════ */

const PERSONAS = [
  { value: 'Influencer / Creator', label: 'Influencer / Creator', emoji: '🎥' },
  { value: 'HR Professional', label: 'HR Professional', emoji: '👥' },
  { value: 'Founder / CEO', label: 'Founder / CEO', emoji: '🚀' },
  { value: 'Marketer', label: 'Marketer', emoji: '📣' },
  { value: 'Professional', label: 'Professional', emoji: '💼' },
  { value: 'Freelancer', label: 'Freelancer', emoji: '💻' },
];

const INDUSTRIES = [
  { value: 'Tech', emoji: '💻' },
  { value: 'Fashion', emoji: '👗' },
  { value: 'Food', emoji: '🍽️' },
  { value: 'Finance', emoji: '💰' },
  { value: 'Health', emoji: '📱' },
  { value: 'Education', emoji: '📚' },
  { value: 'Marketing', emoji: '📊' },
  { value: 'Retail', emoji: '🛍️' },
  { value: 'Other', emoji: '🌐' },
];

const TONES = [
  { value: 'Professional', label: 'Professional', emoji: '🤝' },
  { value: 'Casual & Friendly', label: 'Casual & Friendly', emoji: '😊' },
  { value: 'Inspirational', label: 'Inspirational', emoji: '✨' },
  { value: 'Witty & Humorous', label: 'Witty & Humorous', emoji: '😄' },
];

const AUDIENCES = [
  'Working Professionals',
  'Students',
  'Job Seekers',
  'Entrepreneurs',
  'General Consumers',
  'B2B / Businesses',
];

const COUNTRIES = [
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'SG', label: '🇸🇬 Singapore' },
];

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Japanese', label: '日本語' },
];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

function parseList(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}

function isInList(listStr, value) {
  return parseList(listStr).includes(value);
}

function toggleInList(listStr, value) {
  const current = parseList(listStr);
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return next.join(', ');
}

function cardClass(active) {
  return `rounded-lg border-2 p-2.5 text-left transition ${
    active
      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
      : 'border-slate-200 bg-white hover:border-brand-300'
  }`;
}

function pillClass(active) {
  return `rounded-lg border-2 px-3 py-2 text-xs text-left transition ${
    active
      ? 'border-brand-500 bg-brand-50 font-medium text-brand-900'
      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
  }`;
}

/* ═══════════════════════════════════════════════════════
   Section — better styling
   ═══════════════════════════════════════════════════════ */

function Section({ title, emoji, count, isOpen, onToggle, children }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition ${
        isOpen
          ? 'border-brand-200 bg-white'
          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        {/* Emoji in circle */}
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-base shadow-sm">
          {emoji}
        </span>

        {/* Title */}
        <span className="flex-1 text-sm font-medium text-slate-700">
          {title}
        </span>

        {/* Count badge */}
        {count > 0 && (
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
            {count}
          </span>
        )}

        {/* Chevron — rotate */}
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 px-3 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */

export function CompanyProfileForm() {
  const profile = useSelector((s) => s.brand.profile);
  const dispatch = useDispatch();

  const [saveProfile, { isLoading }] = useSaveProfileMutation();
  const [feedback, setFeedback] = useState(null);
  const [openSection, setOpenSection] = useState('persona');

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const setField = (field, value) => {
    dispatch(setProfile({ [field]: value }));
  };

  const togglePersona = (value) =>
    setField('persona', toggleInList(profile.persona, value));
  const toggleIndustry = (value) =>
    setField('industry', toggleInList(profile.industry, value));
  const toggleTone = (value) =>
    setField('tone', toggleInList(profile.tone, value));
  const toggleAudience = (aud) =>
    setField('audience', toggleInList(profile.audience, aud));

  const handleSave = async () => {
    setFeedback(null);
    try {
      await saveProfile({
        persona: profile.persona,
        industry: profile.industry,
        brand_name: profile.brand_name,
        logo_url: profile.logo_url,
        tone: profile.tone,
        audience: profile.audience,
        country_code: profile.country_code,
        language: profile.language,
        posts_per_week: Number(profile.posts_per_week) || 3,
        logo_size: profile.logo_size,
        logo_position_x: profile.logo_position_x,
        logo_position_y: profile.logo_position_y,
        footer_height: profile.footer_height,
        footer_width: profile.footer_width,
        footer_position_x: profile.footer_position_x,
        footer_position_y: profile.footer_position_y,
        overlay_color: profile.overlay_color,
      }).unwrap();
      setFeedback({ tone: 'success', message: 'Profile saved ✅' });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Save failed',
      });
    }
  };

  const personaCount = parseList(profile.persona).length;
  const industryCount = parseList(profile.industry).length;
  const toneCount = parseList(profile.tone).length;
  const audienceCount = parseList(profile.audience).length;

  return (
    <Card title="Your Profile">
      <div className="space-y-2">

        {/* ─── 1. PERSONA ─── */}
        <Section
          title="Who best describes you?"
          emoji="🎭"
          count={personaCount}
          isOpen={openSection === 'persona'}
          onToggle={() => toggleSection('persona')}
        >
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((p) => {
              const active = isInList(profile.persona, p.value);
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => togglePersona(p.value)}
                  className={cardClass(active)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-xs font-medium">
                      {p.label}
                    </span>
                    {active && (
                      <span className="ml-auto grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── 2. INDUSTRY ─── */}
        <Section
          title="What's your industry?"
          emoji="🏭"
          count={industryCount}
          isOpen={openSection === 'industry'}
          onToggle={() => toggleSection('industry')}
        >
          <div className="grid grid-cols-3 gap-2">
            {INDUSTRIES.map((i) => {
              const active = isInList(profile.industry, i.value);
              return (
                <button
                  key={i.value}
                  type="button"
                  onClick={() => toggleIndustry(i.value)}
                  className={cardClass(active)}
                >
                  <div className="flex flex-col items-center gap-1 py-1">
                    <span className="text-base">{i.emoji}</span>
                    <span className="text-[11px] font-medium">
                      {i.value}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── 3. BRAND NAME ─── */}
        <Section
          title="Brand / Name"
          emoji="🏢"
          count={profile.brand_name ? 1 : 0}
          isOpen={openSection === 'brand'}
          onToggle={() => toggleSection('brand')}
        >
          <input
            type="text"
            value={profile.brand_name || ''}
            onChange={(e) => setField('brand_name', e.target.value)}
            placeholder="e.g. ShilshaTech, Shreya Singh"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </Section>

        {/* ─── 4. TONE ─── */}
        <Section
          title="How should posts sound?"
          emoji="🎨"
          count={toneCount}
          isOpen={openSection === 'tone'}
          onToggle={() => toggleSection('tone')}
        >
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((t) => {
              const active = isInList(profile.tone, t.value);
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleTone(t.value)}
                  className={cardClass(active)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{t.emoji}</span>
                    <span className="text-xs font-medium">
                      {t.label}
                    </span>
                    {active && (
                      <span className="ml-auto grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── 5. AUDIENCE ─── */}
        <Section
          title="Target audience"
          emoji="👥"
          count={audienceCount}
          isOpen={openSection === 'audience'}
          onToggle={() => toggleSection('audience')}
        >
          <div className="grid grid-cols-2 gap-2">
            {AUDIENCES.map((a) => {
              const active = isInList(profile.audience, a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAudience(a)}
                  className={pillClass(active)}
                >
                  <div className="flex items-center justify-between">
                    <span>{a}</span>
                    {active && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── 6. LOCATION ─── */}
        <Section
          title="Location & language"
          emoji="🌍"
          count={1}
          isOpen={openSection === 'geo'}
          onToggle={() => toggleSection('geo')}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Country
              </label>
              <select
                value={profile.country_code || 'IN'}
                onChange={(e) => setField('country_code', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Language
              </label>
              <select
                value={profile.language || 'English'}
                onChange={(e) => setField('language', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ─── 7. POSTS PER WEEK ─── */}
        <Section
          title="Posts per week"
          emoji="📅"
          count={profile.posts_per_week || 3}
          isOpen={openSection === 'posts'}
          onToggle={() => toggleSection('posts')}
        >
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={21}
              value={profile.posts_per_week || 3}
              onChange={(e) =>
                setField('posts_per_week', Number(e.target.value))
              }
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
            />
            <div className="w-10 text-right text-2xl font-bold text-brand-600">
              {profile.posts_per_week || 3}
            </div>
          </div>
        </Section>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mt-3">
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        </div>
      )}

      {/* Save button */}
      <div className="mt-4">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </Card>
  );
}