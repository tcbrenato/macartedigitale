import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { derivePhoneFields } from '@/lib/phone';
import { slugify } from '@/lib/slug';
import BusinessCard from '@/components/BusinessCard';
import type { Profile, ProfileSocialLinks } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';
import { Card, Field, PhotoField, SOCIAL_FIELDS, REQUIRED_FIELD_GETTERS, inputBase, textareaBase } from './profileFormShared';

/** Fast-path card editor: only what's needed to publish something usable in ~1-2 minutes.
 * Everything else (slug, organisation, ville/adresse, services, confidentialité, modèle,
 * couleurs) lives in Paramètres — see SettingsForm.tsx. */
function EssentialForm({ draft, setDraft, saving, uploading, message, error, handleSave, handlePhotoChange }: DashboardContext) {
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const autoSlugRef = useRef(!draft.slug && !draft.id);

  const progress = useMemo(() => {
    const filled = REQUIRED_FIELD_GETTERS.filter((check) => check(draft)).length;
    return Math.round((filled / REQUIRED_FIELD_GETTERS.length) * 100);
  }, [draft]);

  const update = <K extends keyof DashboardContext['draft']>(key: K, value: DashboardContext['draft'][K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updatePhone = (raw: string) => {
    setDraft((prev) => (prev ? { ...prev, ...derivePhoneFields(raw) } : prev));
  };

  const updateSocial = (key: keyof ProfileSocialLinks, value: string) => {
    setDraft((prev) => (prev ? { ...prev, social: { ...prev.social, [key]: value || undefined } } : prev));
  };

  // Quietly derive a slug from the name so a brand-new card can publish without
  // a detour to Paramètres — the slug column is required (unique, not null) in
  // the database. Stops for good the moment the card is saved once (draft.id
  // gets set), so a later name edit can't silently change an already-shared
  // link; from then on the slug is only editable from Paramètres.
  useEffect(() => {
    if (!autoSlugRef.current) return;
    const generated = slugify(`${draft.firstName} ${draft.lastName}`);
    if (generated) update('slug', generated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.firstName, draft.lastName]);

  useEffect(() => {
    if (draft.id) autoSlugRef.current = false;
  }, [draft.id]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 pb-28 lg:pb-16 flex flex-col gap-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
          <span className="font-bold text-gray-900">Carte complétée</span>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 font-bold">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: draft.themePrimary }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start min-w-0">
        <div className={`${mobileView === 'edit' ? 'flex' : 'hidden'} lg:flex flex-col gap-5 min-w-0`}>
          <Card title="Identité">
            <PhotoField photo={draft.photo} uploading={uploading} onChange={handlePhotoChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom" filled={Boolean(draft.firstName)}>
                <input className={inputBase} value={draft.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </Field>
              <Field label="Nom" filled={Boolean(draft.lastName)}>
                <input className={inputBase} value={draft.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </Field>
            </div>

            <Field label="Titre / fonction" filled={Boolean(draft.title)}>
              <input className={inputBase} value={draft.title} onChange={(e) => update('title', e.target.value)} />
            </Field>
            <Field label="Phrase d'accroche" filled={Boolean(draft.tagline)}>
              <textarea className={textareaBase} rows={2} value={draft.tagline} onChange={(e) => update('tagline', e.target.value)} />
            </Field>
          </Card>

          <Card title="Contact">
            <Field label="Téléphone" filled={Boolean(draft.phone)}>
              <input
                type="tel"
                inputMode="tel"
                className={inputBase}
                value={draft.phone}
                onChange={(e) => updatePhone(e.target.value)}
                placeholder="+229 01 92 37 77 77"
              />
              <div className="mt-2.5">
                <label className="flex items-center gap-2.5 text-xs text-gray-600 font-medium cursor-pointer w-fit select-none">
                  <input
                    type="checkbox"
                    checked={draft.phonePublic}
                    onChange={(v) => update('phonePublic', v.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-300 text-[var(--dash-brand)] focus:ring-[var(--dash-brand)]/20"
                  />
                  Visible publiquement sur ma carte
                </label>
              </div>
            </Field>
            <p className="text-[11px] text-gray-400 -mt-1 font-medium">
              Le lien d'appel et le lien WhatsApp sont générés automatiquement à partir de ce numéro.
            </p>

            <Field label="Email" filled={Boolean(draft.email)}>
              <input type="email" className={inputBase} value={draft.email} onChange={(e) => update('email', e.target.value)} />
              <div className="mt-2.5">
                <label className="flex items-center gap-2.5 text-xs text-gray-600 font-medium cursor-pointer w-fit select-none">
                  <input
                    type="checkbox"
                    checked={draft.emailPublic}
                    onChange={(v) => update('emailPublic', v.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-300 text-[var(--dash-brand)] focus:ring-[var(--dash-brand)]/20"
                  />
                  Visible publiquement sur ma carte
                </label>
              </div>
            </Field>

            <Field label="Site web (optionnel)">
              <input
                type="url"
                className={inputBase}
                value={draft.url ?? ''}
                onChange={(e) => update('url', e.target.value || undefined)}
                placeholder="https://..."
              />
            </Field>
          </Card>

          <Card title="Réseaux sociaux">
            {SOCIAL_FIELDS.map(({ key, label }) => (
              <Field key={key} label={label}>
                <input
                  type="url"
                  className={inputBase}
                  value={draft.social[key] ?? ''}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            ))}
          </Card>

          <Link
            to="/dashboard/settings"
            className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${draft.themePrimary}1A`, color: draft.themePrimary }}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-950">Plus de paramètres</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Organisation, ville, services, confidentialité, modèle, couleurs — et le lien de ta carte
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
          </Link>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-600 font-medium">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex-1 min-h-[48px] bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-bold rounded-2xl text-sm transition-all shadow-2xs"
            >
              Enregistrer en brouillon
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex-1 min-h-[48px] disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:opacity-95"
              style={{ backgroundColor: draft.themePrimary }}
            >
              Publier
            </button>
          </div>
        </div>

        {/* ===== LIVE PREVIEW ===== */}
        <div className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">Aperçu en direct</p>
          <div className="w-full max-w-[380px] h-[720px] mx-auto rounded-[2.5rem] overflow-hidden border-8 border-gray-900 bg-[#f4f5fb] shadow-2xl">
            <BusinessCard profile={draft as Profile} preview />
          </div>
        </div>
      </div>

      {/* ===== MOBILE EDIT/PREVIEW TOGGLE ===== */}
      <button
        type="button"
        onClick={() => setMobileView((v) => (v === 'edit' ? 'preview' : 'edit'))}
        className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 min-h-[48px] px-6 rounded-full text-white font-bold text-sm shadow-xl transition-all"
        style={{ backgroundColor: draft.themePrimary }}
      >
        {mobileView === 'edit' ? (
          <>
            <Eye className="w-4 h-4" /> Aperçu
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4" /> Modifier
          </>
        )}
      </button>
    </div>
  );
}

export default EssentialForm;
