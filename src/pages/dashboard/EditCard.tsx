import { useMemo, useState, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, CheckCircle2, Eye, Pencil, ChevronDown } from 'lucide-react';
import { derivePhoneFields } from '@/lib/phone';
import { ICON_MAP, type IconName } from '@/lib/icons';
import BusinessCard from '@/components/BusinessCard';
import type { Profile, ProfileService, ProfileSocialLinks } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';

const SOCIAL_FIELDS: { key: keyof ProfileSocialLinks; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', label: 'YouTube' },
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
  'w-full min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15';
const textareaBase =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15';

function Field({ label, filled, children }: { label: string; filled?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
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
    <section className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">{title}</h2>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 flex flex-col gap-4">{children}</div>}
    </section>
  );
}

function VisibilityToggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs text-gray-500 mt-1.5"
    >
      <span
        className="w-9 h-5 rounded-full relative shrink-0 transition-colors"
        style={{ backgroundColor: checked ? 'var(--dash-brand)' : '#E5E7EB' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
      Visible publiquement sur ma carte
    </button>
  );
}

function EditCard() {
  const { draft, setDraft, saving, uploading, message, error, handleSave, handlePhotoChange } =
    useOutletContext<DashboardContext>();
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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 pb-28 lg:pb-16">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1.5">
          <span>Carte complétée</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: draft.themePrimary }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start min-w-0">
      <div className={`${mobileView === 'edit' ? 'flex' : 'hidden'} lg:flex flex-col gap-4 min-w-0`}>
      {draft.status === 'published' && (
        <a
          href={`/${draft.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold w-fit"
          style={{ color: draft.themePrimary }}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Voir ma carte publiée : /{draft.slug}
        </a>
      )}

      <Card title="Identité">
        <div>
          <label className="text-xs font-semibold text-gray-600">Photo</label>
          <div className="flex items-center gap-3 mt-1.5">
            {draft.photo && <img src={draft.photo} alt="Photo" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
            <label className="min-h-[48px] px-4 flex items-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 cursor-pointer hover:border-gray-300">
              Choisir une photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
          {uploading && <p className="text-xs text-gray-400 mt-1.5">Envoi de la photo…</p>}
        </div>

        <Field label="Lien de ta carte (slug)" filled={Boolean(draft.slug)}>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 shrink-0">macartedigitale.vercel.app/</span>
            <input
              className={inputBase}
              value={draft.slug}
              onChange={(e) => update('slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="ton-nom"
            />
          </div>
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
          <VisibilityToggle checked={draft.phonePublic} onChange={(v) => update('phonePublic', v)} />
        </Field>
        <p className="text-[11px] text-gray-400 -mt-2">
          Le lien d'appel et le lien WhatsApp sont générés automatiquement à partir de ce numéro.
        </p>

        <Field label="Email" filled={Boolean(draft.email)}>
          <input type="email" className={inputBase} value={draft.email} onChange={(e) => update('email', e.target.value)} />
          <VisibilityToggle checked={draft.emailPublic} onChange={(v) => update('emailPublic', v)} />
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
          <VisibilityToggle checked={draft.addressPublic} onChange={(v) => update('addressPublic', v)} />
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
          <span className="text-xs text-gray-400">{draft.services.length} élément(s)</span>
          <button onClick={addService} className="flex items-center gap-1 text-xs font-semibold" style={{ color: draft.themePrimary }}>
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {draft.services.map((service, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
              {Object.entries(ICON_MAP).map(([name, Icon]) => {
                const selected = service.icon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateService(i, { icon: name as IconName })}
                    className="shrink-0 snap-start w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                    style={
                      selected
                        ? { backgroundColor: draft.themePrimary, borderColor: draft.themePrimary, color: '#fff' }
                        : { borderColor: '#E5E7EB', color: '#9CA3AF' }
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
            <button onClick={() => removeService(i)} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 w-fit">
              <Trash2 className="w-3.5 h-3.5" /> Retirer
            </button>
          </div>
        ))}
        {draft.services.length === 0 && <p className="text-xs text-gray-400">Aucun élément pour l'instant.</p>}
      </Card>

      <Card title="Apparence">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Couleur 1 (principale)">
            <input
              type="color"
              className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
              value={draft.themePrimary}
              onChange={(e) => update('themePrimary', e.target.value)}
            />
          </Field>
          <Field label="Couleur 2 (dégradé)">
            <input
              type="color"
              className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
              value={draft.themeSecondary}
              onChange={(e) => update('themeSecondary', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Modèle de carte">
          <select className={inputBase} value={draft.templateId} disabled>
            <option value="classic">Classique (d'autres modèles arrivent bientôt)</option>
          </select>
        </Field>
      </Card>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {message && <p className="text-xs text-emerald-600">{message}</p>}

      <div className="flex gap-3">
        <button
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="flex-1 min-h-[48px] bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-bold rounded-xl text-sm"
        >
          Enregistrer en brouillon
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={saving}
          className="flex-1 min-h-[48px] disabled:opacity-60 text-white font-bold rounded-xl text-sm"
          style={{ backgroundColor: draft.themePrimary }}
        >
          Publier
        </button>
      </div>
      </div>

      {/* ===== LIVE PREVIEW ===== */}
      <div className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 text-center">Aperçu en direct</p>
        <div className="w-full max-w-[380px] h-[720px] mx-auto rounded-[2.5rem] overflow-hidden border-8 border-gray-900 bg-[#f4f5fb] shadow-xl">
          <BusinessCard profile={draft as Profile} preview />
        </div>
      </div>
      </div>

      {/* ===== MOBILE EDIT/PREVIEW TOGGLE ===== */}
      <button
        onClick={() => setMobileView((v) => (v === 'edit' ? 'preview' : 'edit'))}
        className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 min-h-[48px] px-5 rounded-full text-white font-bold text-sm shadow-lg"
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

export default EditCard;
