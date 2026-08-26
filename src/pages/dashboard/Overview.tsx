import { useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Pencil, QrCode, ExternalLink, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import type { DashboardContext } from './DashboardLayout';

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

interface AccessCardProps {
  icon: typeof Pencil;
  title: string;
  desc: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  badge?: string;
  color: string;
}

function AccessCard({ icon: Icon, title, desc, onClick, href, disabled, badge, color }: AccessCardProps) {
  const inner = (
    <>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: disabled ? '#F3F4F6' : `${color}1A`, color: disabled ? '#9CA3AF' : color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h3>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className={`text-xs mt-0.5 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>{desc}</p>
      </div>
      {!disabled && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
    </>
  );

  const className =
    'flex items-center gap-3 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 text-left transition-transform ' +
    (disabled ? 'cursor-not-allowed' : 'hover:-translate-y-0.5 cursor-pointer');

  if (disabled) {
    return <div className={className}>{inner}</div>;
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

function Overview() {
  const { draft } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const progress = useMemo(() => {
    const filled = REQUIRED_FIELD_GETTERS.filter((check) => check(draft)).length;
    return Math.round((filled / REQUIRED_FIELD_GETTERS.length) * 100);
  }, [draft]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">
          Bonjour {draft.firstName || ''} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {draft.status === 'published' ? 'Ta carte est publiée et accessible en ligne.' : 'Ta carte est en brouillon — publie-la pour la partager.'}
        </p>
      </div>

      <div>
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

      <div className="flex flex-col gap-3">
        <AccessCard
          icon={Pencil}
          title="Modifier ma carte"
          desc="Identité, contacts, réseaux, services, couleurs"
          onClick={() => navigate('/dashboard/edit')}
          color={draft.themePrimary}
        />
        <AccessCard
          icon={QrCode}
          title="QR Code"
          desc={draft.qrCodeUrl ? 'Télécharger ou partager ton QR code' : 'Publie ta carte pour générer ton QR code'}
          onClick={() => navigate('/dashboard/qrcode')}
          color={draft.themePrimary}
        />
        {draft.status === 'published' && (
          <AccessCard
            icon={ExternalLink}
            title="Voir ma carte publiée"
            desc={`macartedigitale.vercel.app/${draft.slug}`}
            href={`/${draft.slug}`}
            color={draft.themePrimary}
          />
        )}
        <AccessCard
          icon={CreditCard}
          title="Commander une carte RFID"
          desc="Design personnalisé, matériaux, quantité — on en discute directement"
          onClick={() => navigate('/dashboard/rfid')}
          color={draft.themePrimary}
        />
        {isAdmin(user?.email) && (
          <AccessCard
            icon={ShieldCheck}
            title="Commandes RFID (admin)"
            desc="Voir et gérer toutes les demandes des utilisateurs"
            onClick={() => navigate('/dashboard/admin/rfid')}
            color={draft.themePrimary}
          />
        )}
      </div>
    </div>
  );
}

export default Overview;
