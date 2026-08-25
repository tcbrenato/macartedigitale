import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getMyProfile, saveProfile, uploadPhoto } from '@/lib/profiles';
import { ICON_MAP, type IconName } from '@/lib/icons';
import BusinessCard from '@/components/BusinessCard';
import type { Profile, ProfileService, ProfileSocialLinks } from '@/types/profile';

type DraftProfile = Omit<Profile, 'id'> & { id?: string };

function emptyProfile(userId: string, email: string): DraftProfile {
  return {
    userId,
    slug: '',
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    tagline: '',
    photo: '',
    phone: '',
    phoneRaw: '',
    whatsapp: '',
    email,
    url: undefined,
    address: '',
    city: '',
    countryLine: '',
    status: 'draft',
    templateId: 'classic',
    themePrimary: '#0100AD',
    themeSecondary: '#3a39d0',
    services: [],
    social: {},
  };
}

const SOCIAL_FIELDS: { key: keyof ProfileSocialLinks; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', label: 'YouTube' },
];

const inputClass =
  'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0100AD]';
const labelClass = 'text-xs font-semibold text-gray-600';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DraftProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyProfile(user.id)
      .then((existing) => setDraft(existing ?? emptyProfile(user.id, user.email ?? '')))
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, [user]);

  const update = <K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
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

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const previewUrl = URL.createObjectURL(file);
    update('photo', previewUrl);
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadPhoto(user.id, file);
      update('photo', publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const saved = await saveProfile({ ...draft, status });
      setDraft(saved);
      setMessage(status === 'published' ? 'Carte publiée !' : 'Brouillon enregistré.');
    } catch (err) {
      if (err instanceof Error && err.message.includes('duplicate key')) {
        setError('Ce lien (slug) est déjà pris, choisis-en un autre.');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center text-sm text-gray-400">
        Chargement…
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center p-6 text-center text-sm text-red-600">
        {error ?? 'Une erreur est survenue.'}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#f4f5fb] pb-16">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-sm font-extrabold text-gray-900">Mon tableau de bord</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          <LogOut className="w-3.5 h-3.5" /> Déconnexion
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 grid lg:grid-cols-[1fr_400px] gap-6 items-start">
        {/* ===== FORM ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-5">
          {draft.status === 'published' && (
            <a
              href={`/${draft.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0100AD] w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Voir ma carte publiée : /{draft.slug}
            </a>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Identité</h2>
            <div>
              <label className={labelClass}>Photo</label>
              <div className="flex items-center gap-3 mt-1">
                {draft.photo && (
                  <img src={draft.photo} alt="Photo" className="w-14 h-14 rounded-xl object-cover" />
                )}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-xs" />
              </div>
              {uploading && <p className="text-xs text-gray-400 mt-1">Envoi de la photo…</p>}
            </div>
            <div>
              <label className={labelClass}>Lien de ta carte (slug)</label>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-gray-400">macartedigitale.vercel.app/</span>
                <input
                  className={inputClass}
                  value={draft.slug}
                  onChange={(e) => update('slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="ton-nom"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Prénom</label>
                <input className={`${inputClass} mt-1`} value={draft.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input className={`${inputClass} mt-1`} value={draft.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Organisation</label>
              <input className={`${inputClass} mt-1`} value={draft.organization} onChange={(e) => update('organization', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Titre / fonction</label>
              <input className={`${inputClass} mt-1`} value={draft.title} onChange={(e) => update('title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phrase d'accroche</label>
              <textarea className={`${inputClass} mt-1`} rows={2} value={draft.tagline} onChange={(e) => update('tagline', e.target.value)} />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Contact</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Téléphone (affiché)</label>
                <input className={`${inputClass} mt-1`} value={draft.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+229 01 23 45 67 89" />
              </div>
              <div>
                <label className={labelClass}>Téléphone (lien tel:)</label>
                <input className={`${inputClass} mt-1`} value={draft.phoneRaw} onChange={(e) => update('phoneRaw', e.target.value)} placeholder="+2290123456789" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>WhatsApp (chiffres seuls)</label>
                <input className={`${inputClass} mt-1`} value={draft.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="229012345689" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={`${inputClass} mt-1`} value={draft.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Site web (optionnel)</label>
              <input className={`${inputClass} mt-1`} value={draft.url ?? ''} onChange={(e) => update('url', e.target.value || undefined)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Ville</label>
                <input className={`${inputClass} mt-1`} value={draft.city} onChange={(e) => update('city', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ligne pays / dispo</label>
                <input className={`${inputClass} mt-1`} value={draft.countryLine} onChange={(e) => update('countryLine', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Adresse (utilisée pour le contact enregistré)</label>
              <input className={`${inputClass} mt-1`} value={draft.address} onChange={(e) => update('address', e.target.value)} />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Réseaux sociaux</h2>
            {SOCIAL_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={`${inputClass} mt-1`}
                  value={draft.social[key] ?? ''}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder="https://..."
                />
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Ce que je fais</h2>
              <button onClick={addService} className="flex items-center gap-1 text-xs font-semibold text-[#0100AD]">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
            {draft.services.map((service, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <select
                    className={`${inputClass} flex-1`}
                    value={service.icon}
                    onChange={(e) => updateService(i, { icon: e.target.value as IconName })}
                  >
                    {Object.keys(ICON_MAP).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => removeService(i)} className="text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  className={inputClass}
                  value={service.short}
                  onChange={(e) => updateService(i, { short: e.target.value })}
                  placeholder="Titre court"
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  value={service.desc}
                  onChange={(e) => updateService(i, { desc: e.target.value })}
                  placeholder="Description"
                />
              </div>
            ))}
            {draft.services.length === 0 && (
              <p className="text-xs text-gray-400">Aucun élément pour l'instant.</p>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Apparence</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Couleur 1 (principale)</label>
                <input
                  type="color"
                  className="w-full h-10 mt-1 rounded-xl border border-gray-200"
                  value={draft.themePrimary}
                  onChange={(e) => update('themePrimary', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Couleur 2 (dégradé)</label>
                <input
                  type="color"
                  className="w-full h-10 mt-1 rounded-xl border border-gray-200"
                  value={draft.themeSecondary}
                  onChange={(e) => update('themeSecondary', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Modèle de carte</label>
              <select className={`${inputClass} mt-1`} value={draft.templateId} disabled>
                <option value="classic">Classique (d'autres modèles arrivent bientôt)</option>
              </select>
            </div>
          </section>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-bold py-2.5 rounded-xl text-sm"
            >
              Enregistrer en brouillon
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex-1 bg-[#0100AD] hover:bg-[#00007a] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm"
            >
              Publier
            </button>
          </div>
        </div>

        {/* ===== LIVE PREVIEW ===== */}
        <div className="lg:sticky lg:top-6">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 text-center">Aperçu en direct</p>
          <div className="w-full max-w-[380px] h-[720px] mx-auto rounded-[2.5rem] overflow-hidden border-8 border-gray-900 bg-[#f4f5fb] shadow-xl">
            <BusinessCard profile={draft as Profile} preview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
