import { useState, type ChangeEvent, type ReactNode } from 'react';
import { CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { useBusinessCardLogic } from '@/lib/useBusinessCardLogic';
import { TEMPLATES } from '@/templates';
import type { Profile, ProfileVisibility, TemplateId } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';

export const inputBase =
  'w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs';
export const textareaBase =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs';

export const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', label: 'YouTube' },
] as const;

export const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; desc: string }[] = [
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

/** The fields that count toward the "carte complétée" progress bar shown on Overview and the edit forms. */
export const REQUIRED_FIELD_GETTERS: ((d: DashboardContext['draft']) => boolean)[] = [
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

export function Field({ label, filled, children }: { label: string; filled?: boolean; children: ReactNode }) {
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

export function Card({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
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

export function PhotoField({
  photo,
  uploading,
  onChange,
}: {
  photo: string;
  uploading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">Photo</label>
      <div className="flex items-center gap-4 mt-2">
        {photo && <img src={photo} alt="Photo" className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs border border-gray-100" />}
        <label className="min-h-[48px] px-5 flex items-center rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 cursor-pointer hover:border-gray-300 transition-all shadow-2xs">
          Choisir une photo
          <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        </label>
      </div>
      {uploading && <p className="text-xs text-gray-400 mt-2 font-medium">Envoi de la photo…</p>}
    </div>
  );
}

export function TemplatePicker({ draft, onSelect }: { draft: DashboardContext['draft']; onSelect: (id: TemplateId) => void }) {
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
