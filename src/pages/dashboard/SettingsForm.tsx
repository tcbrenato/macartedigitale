import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Eye, Pencil, Check } from 'lucide-react';
import { ICON_MAP, type IconName } from '@/lib/icons';
import BusinessCard from '@/components/BusinessCard';
import type { Profile, ProfileService } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';
import { Card, Field, TemplatePicker, VISIBILITY_OPTIONS, inputBase, textareaBase } from './profileFormShared';

/** Everything that isn't needed for a fast first publish: the card's link, organisation,
 * location, services, privacy, template, and colors. Reached from EssentialForm's
 * "Plus de paramètres" card. */
function SettingsForm({ draft, setDraft, saving, message, error, handleSave }: DashboardContext) {
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const update = <K extends keyof DashboardContext['draft']>(key: K, value: DashboardContext['draft'][K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateService = (index: number, patch: Partial<ProfileService>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const services = [...prev.services];
      services[index] = { ...services[index], ...patch };
      return { ...prev, services };
    });
  };

  const addService = () => {
    setDraft((prev) =>
      prev ? { ...prev, services: [...prev.services, { icon: 'Briefcase' as IconName, short: '', desc: '' }] } : prev
    );
  };

  const removeService = (index: number) => {
    setDraft((prev) => (prev ? { ...prev, services: prev.services.filter((_, i) => i !== index) } : prev));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 pb-28 lg:pb-16 flex flex-col gap-6">
      <Link
        to="/dashboard/edit"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 w-fit transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour à l'essentiel
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start min-w-0">
        <div className={`${mobileView === 'edit' ? 'flex' : 'hidden'} lg:flex flex-col gap-5 min-w-0`}>
          <Card title="Lien et organisation">
            <Field label="Lien de la carte (slug)" filled={Boolean(draft.slug)}>
              <p className="text-xs text-gray-400 mb-1.5 truncate font-medium">macartedigitale.vercel.app/</p>
              <input
                className={inputBase}
                value={draft.slug}
                onChange={(e) => update('slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="ton-nom"
              />
            </Field>
            <Field label="Organisation" filled={Boolean(draft.organization)}>
              <input className={inputBase} value={draft.organization} onChange={(e) => update('organization', e.target.value)} />
            </Field>
            <Field label="Langue de la carte">
              <select
                className={inputBase}
                value={draft.language}
                onChange={(e) => update('language', e.target.value as Profile['language'])}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Change la langue des boutons de la carte (Appeler/Call, Site web/Website...). Le contenu que tu écris
                (nom, titre, services...) reste dans la langue que tu choisis toi-même.
              </p>
            </Field>
          </Card>

          <Card title="Profil">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ville" filled={Boolean(draft.city)}>
                <input className={inputBase} value={draft.city} onChange={(e) => update('city', e.target.value)} />
              </Field>
              <Field label="Ligne pays / dispo">
                <input className={inputBase} value={draft.countryLine} onChange={(e) => update('countryLine', e.target.value)} />
              </Field>
            </div>
            <Field label="Adresse (utilisée pour le contact enregistré)">
              <input className={inputBase} value={draft.address} onChange={(e) => update('address', e.target.value)} />
              <div className="mt-2.5">
                <label className="flex items-center gap-2.5 text-xs text-gray-600 font-medium cursor-pointer w-fit select-none">
                  <input
                    type="checkbox"
                    checked={draft.addressPublic}
                    onChange={(v) => update('addressPublic', v.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-300 text-[var(--dash-brand)] focus:ring-[var(--dash-brand)]/20"
                  />
                  Visible publiquement sur ma carte
                </label>
              </div>
            </Field>
          </Card>

          <Card title="Ce que je fais">
            <div className="flex items-center justify-between -mt-1">
              <span className="text-xs text-gray-400 font-medium">{draft.services.length} élément(s)</span>
              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                style={{ color: draft.themePrimary }}
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            {draft.services.map((service, i) => (
              <div key={i} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xs">
                <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                  {Object.entries(ICON_MAP).map(([name, Icon]) => {
                    const selected = service.icon === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => updateService(i, { icon: name as IconName })}
                        className="shrink-0 snap-start w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-2xs"
                        style={
                          selected
                            ? { backgroundColor: draft.themePrimary, borderColor: draft.themePrimary, color: '#fff' }
                            : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#9CA3AF' }
                        }
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
                <input
                  className={inputBase}
                  value={service.short}
                  onChange={(e) => updateService(i, { short: e.target.value })}
                  placeholder="Titre court"
                />
                <textarea
                  className={textareaBase}
                  rows={2}
                  value={service.desc}
                  onChange={(e) => updateService(i, { desc: e.target.value })}
                  placeholder="Description"
                />
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 w-fit transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Retirer
                </button>
              </div>
            ))}
            {draft.services.length === 0 && <p className="text-xs text-gray-400 font-medium py-2">Aucun élément pour l'instant.</p>}
          </Card>

          <Card title="Confidentialité">
            <div className="flex flex-col gap-3">
              {VISIBILITY_OPTIONS.map(({ value, label, desc }) => {
                const selected = draft.visibility === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('visibility', value)}
                    className="flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all"
                    style={selected ? { borderColor: draft.themePrimary, backgroundColor: `${draft.themePrimary}08` } : { borderColor: '#E5E7EB', backgroundColor: '#fff' }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: selected ? draft.themePrimary : '#D1D5DB' }}
                    >
                      {selected && <Check className="w-3 h-3 font-bold" style={{ color: draft.themePrimary }} />}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-gray-900">{label}</span>
                      <span className="block text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Modèle de carte">
            <TemplatePicker draft={draft} onSelect={(id) => update('templateId', id)} />
          </Card>

          <Card title="Apparence">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Couleur 1 (principale)">
                <input
                  type="color"
                  className="w-full h-12 rounded-2xl border border-gray-200 cursor-pointer bg-white p-1 shadow-2xs"
                  value={draft.themePrimary}
                  onChange={(e) => update('themePrimary', e.target.value)}
                />
              </Field>
              <Field label="Couleur 2 (dégradé)">
                <input
                  type="color"
                  className="w-full h-12 rounded-2xl border border-gray-200 cursor-pointer bg-white p-1 shadow-2xs"
                  value={draft.themeSecondary}
                  onChange={(e) => update('themeSecondary', e.target.value)}
                />
              </Field>
            </div>
          </Card>

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

export default SettingsForm;
