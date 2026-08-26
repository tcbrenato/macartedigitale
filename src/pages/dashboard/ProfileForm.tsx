import { useMemo, useState, type ReactNode } from 'react';
import { Plus, Trash2, ExternalLink, CheckCircle2, Eye, Pencil, ChevronDown, Check } from 'lucide-react';
import { derivePhoneFields } from '@/lib/phone';
import { ICON_MAP, type IconName } from '@/lib/icons';
import { useBusinessCardLogic } from '@/lib/useBusinessCardLogic';
import { TEMPLATES } from '@/templates';
import BusinessCard from '@/components/BusinessCard';
import type { Profile, ProfileService, ProfileSocialLinks, ProfileVisibility, TemplateId } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';

function TemplatePicker({ draft, onSelect }: { draft: DashboardContext['draft']; onSelect: (id: TemplateId) => void }) {
  const logic = useBusinessCardLogic({ profile: draft as Profile, preview: true });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map(({ id, name, desc, component: Template }) => {
        const selected = draft.templateId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="rounded-2xl overflow-hidden border-2 text-left transition-all bg-white/50 hover:border-gray-300"
            style={selected ? { borderColor: 'var(--dash-brand)', boxShadow: '0 4px 12px rgba(1, 0, 173, 0.1)' } : { borderColor: '#E5E7EB' }}
          >
            <div className="relative w-full h-[190px] overflow-hidden bg-gray-100">
              <div
                className="absolute top-1/2 left-1/2"
                style={{ width: 400, height: 820, transform: 'translate(-50%, -50%) scale(0.32)' }}
              >
                <Template profile={draft as Profile} logic={logic} />
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                {name}
                {selected && <Check className="w-3 h-3 shrink-0" style={{ color: 'var(--dash-brand)' }} />}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

const SOCIAL_FIELDS: { key: keyof ProfileSocialLinks; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', label: 'YouTube' },
];

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; desc: string }[] = [
  {
    value: 'public',
    label: 'Publique',
    desc: "Visible par tous. Sera listée dans l'annuaire de recherche une fois disponible.",
  },
  {
    value: 'link_only',
    label: 'Lien direct uniquement',
    desc: "Accessible à qui a le lien exact — ne sera pas listée dans l'annuaire (quand il existera). Pour l'instant, identique à \"Publique\".",
  },
  {
    value: 'connections_only',
    label: 'Mes connexions uniquement',
    desc: "Visible seulement par toi pour l'instant (le lien public est inaccessible) — les connexions arrivent bientôt.",
  },
];

const REQUIRED_FIELD_GETTERS: ((d: DashboardContext['draft']) => boolean)[] = [
  (d) => Boolean(d.slug),
  (d) => Boolean(d.photo),
  (d) => Boolean(d.firstName),
  (d) => Boolean(d.lastName),
  (d) => Boolean(d.title),
  (d) => Boolean(d.tagline),
  (d) => Boolean(d.phone),
  (d) => Boolean(d.email),
  (d) => Boolean(d.city),
  (d) => d.services.length > 0,
];

const inputBase =
  'w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs';
const textareaBase =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs';

function Field({ label, filled, children }: { label: string; filled?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
        {label}
        {filled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Card({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4.5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h2>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>}
    </section>
  );
}

/** The full card-editing form + live preview. Shared by the owner's "Modifier ma carte"
 * and the admin's per-user edit screen — both feed it the same shape of props. */
function ProfileForm({ draft, setDraft, saving, uploading, message, error, handleSave, handlePhotoChange }: DashboardContext) {
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

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
          {draft.status === 'published' && (
            <a
              href={`/${draft.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold w-fit px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xs border border-gray-100 hover:bg-white transition-all"
              style={{ color: draft.themePrimary }}
            >
              <ExternalLink className="w-4 h-4" /> Voir la carte publiée : /{draft.slug}
            </a>
          )}

          <Card title="Identité">
            <div>
              <label className="text-xs font-semibold text-gray-600">Photo</label>
              <div className="flex items-center gap-4 mt-2">
                {draft.photo && <img src={draft.photo} alt="Photo" className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs border border-gray-100" />}
                <label className="min-h-[48px] px-5 flex items-center rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 cursor-pointer hover:border-gray-300 transition-all shadow-2xs">
                  Choisir une photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              {uploading && <p className="text-xs text-gray-400 mt-2 font-medium">Envoi de la photo…</p>}
            </div>

            <Field label="Lien de la carte (slug)" filled={Boolean(draft.slug)}>
              <p className="text-xs text-gray-400 mb-1.5 truncate font-medium">macartedigitale.vercel.app/</p>
              <input
                className={inputBase}
                value={draft.slug}
                onChange={(e) => update('slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="ton-nom"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom" filled={Boolean(draft.firstName)}>
                <input className={inputBase} value={draft.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </Field>
              <Field label="Nom" filled={Boolean(draft.lastName)}>
                <input className={inputBase} value={draft.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </Field>
            </div>

            <Field label="Organisation" filled={Boolean(draft.organization)}>
              <input className={inputBase} value={draft.organization} onChange={(e) => update('organization', e.target.value)} />
            </Field>
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

export default ProfileForm;