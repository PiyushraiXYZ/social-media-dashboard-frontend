import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useSaveProfileMutation } from '../api.js';
import { setProfile } from '../brandSlice.js';

/* ═══════════════════════════════════════════════════════
   Static Options
   ═══════════════════════════════════════════════════════ */

const PERSONAS = [
  { value: 'Influencer / Creator', label: 'Influencer / Creator', emoji: '🎥', hint: 'Content, lifestyle, vlogs' },
  { value: 'HR Professional', label: 'HR Professional', emoji: '👥', hint: 'Recruitment, culture' },
  { value: 'Founder / CEO', label: 'Founder / CEO', emoji: '🚀', hint: 'Startup, business' },
  { value: 'Marketer', label: 'Marketer', emoji: '📣', hint: 'Campaigns, growth' },
  { value: 'Professional', label: 'Professional', emoji: '💼', hint: 'Working at a company' },
  { value: 'Freelancer', label: 'Freelancer', emoji: '💻', hint: 'Independent, consulting' },
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
  { value: 'Professional', label: 'Professional', emoji: '🤝', hint: 'Formal, authoritative' },
  { value: 'Casual & Friendly', label: 'Casual & Friendly', emoji: '😊', hint: 'Warm, approachable' },
  { value: 'Inspirational', label: 'Inspirational', emoji: '✨', hint: 'Motivating, uplifting' },
  { value: 'Witty & Humorous', label: 'Witty & Humorous', emoji: '😄', hint: 'Playful, entertaining' },
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
   Reusable Styles — BLUE highlight for selected
   ═══════════════════════════════════════════════════════ */

/**
 * Card selection style — Blue border + tint + shadow
 */
function cardClass(active) {
  return `rounded-xl border-2 p-3 text-left transition-all duration-150 ${
    active
      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200 shadow-sm'
      : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'
  }`;
}

/**
 * Pill selection style — Blue for audience
 */
function pillClass(active) {
  return `rounded-lg border-2 px-3 py-2 text-sm text-left transition-all duration-150 ${
    active
      ? 'border-brand-500 bg-brand-50 font-medium text-brand-900 ring-2 ring-brand-200'
      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/30'
  }`;
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */

export function CompanyProfileForm() {
  const profile = useSelector((s) => s.brand.profile);
  const dispatch = useDispatch();

  const [saveProfile, { isLoading }] = useSaveProfileMutation();
  const [feedback, setFeedback] = useState(null);

  const setField = (field, value) => {
    dispatch(setProfile({ [field]: value }));
  };

  const toggleAudience = (aud) => {
    const list = (profile.audience || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const next = list.includes(aud)
      ? list.filter((x) => x !== aud)
      : [...list, aud];

    setField('audience', next.join(', '));
  };

  const isAudienceSelected = (aud) =>
    (profile.audience || '')
      .split(',')
      .map((s) => s.trim())
      .includes(aud);

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
      }).unwrap();
      setFeedback({ tone: 'success', message: 'Profile saved ✅' });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Save failed',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Helper Banner */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        <span className="mr-1">ℹ️</span>
        Your answers are used by our AI to generate relevant, on-brand
        posts automatically — no prompting needed.
      </div>

      {/* 1. Persona */}
      <Card
        title="Who best describes you?"
        subtitle="Pick the role that fits you most."
      >
        <div className="grid grid-cols-2 gap-3">
          {PERSONAS.map((p) => {
            const active = profile.persona === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setField('persona', p.value)}
                className={cardClass(active)}
              >
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{p.emoji}</div>
                  {active && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-semibold ${
                    active ? 'text-brand-900' : 'text-slate-900'
                  }`}
                >
                  {p.label}
                </div>
                <div
                  className={`text-xs ${
                    active ? 'text-brand-700' : 'text-slate-500'
                  }`}
                >
                  {p.hint}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Industry */}
      <Card
        title="What's your industry?"
        subtitle="We'll tailor content suggestions."
      >
        <div className="grid grid-cols-3 gap-3">
          {INDUSTRIES.map((i) => {
            const active = profile.industry === i.value;
            return (
              <button
                key={i.value}
                type="button"
                onClick={() => setField('industry', i.value)}
                className={cardClass(active)}
              >
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{i.emoji}</div>
                  {active && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-medium ${
                    active ? 'text-brand-900' : 'text-slate-900'
                  }`}
                >
                  {i.value}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Brand Name (typing) */}
      <Card
        title="What's your brand or name?"
        subtitle="This will appear in generated posts."
      >
        <input
          type="text"
          value={profile.brand_name || ''}
          onChange={(e) => setField('brand_name', e.target.value)}
          placeholder="e.g. ShilshaTech, Shreya Singh, My Store…"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </Card>

      {/* 4. Tone */}
      <Card
        title="How should your posts sound?"
        subtitle="AI will match this style."
      >
        <div className="grid grid-cols-2 gap-3">
          {TONES.map((t) => {
            const active = profile.tone === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setField('tone', t.value)}
                className={cardClass(active)}
              >
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{t.emoji}</div>
                  {active && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-semibold ${
                    active ? 'text-brand-900' : 'text-slate-900'
                  }`}
                >
                  {t.label}
                </div>
                <div
                  className={`text-xs ${
                    active ? 'text-brand-700' : 'text-slate-500'
                  }`}
                >
                  {t.hint}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 5. Audience (multi) */}
      <Card
        title="Who is your target audience?"
        subtitle="Select all that apply."
      >
        <div className="grid grid-cols-2 gap-2">
          {AUDIENCES.map((a) => {
            const active = isAudienceSelected(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                className={pillClass(active)}
              >
                <div className="flex items-center justify-between">
                  <span>{a}</span>
                  {active && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[9px] text-white">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 6. Country + Language */}
      <Card
        title="Where are you based?"
        subtitle="Used for trending topics + timing."
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Country
            </label>
            <select
              value={profile.country_code || 'IN'}
              onChange={(e) => setField('country_code', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 7. Posts per Week */}
      <Card
        title="How many AI posts per week?"
        subtitle="AI will generate this many posts each week for your approval."
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
      </Card>

      {/* Feedback + Save */}
      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <div className="sticky bottom-4 z-10">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </div>
  );
}