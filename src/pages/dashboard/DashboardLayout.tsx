import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Pencil,
  QrCode,
  LogOut,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Compass,
  UserCheck,
  Mail,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getMyProfile, saveProfile, uploadPhoto } from '@/lib/profiles';
import { generateAndUploadQrCode } from '@/lib/qrcode';
import { getPendingIncomingCount } from '@/lib/connections';
import { isAdmin } from '@/lib/admin';
import type { Profile } from '@/types/profile';

export type DraftProfile = Omit<Profile, 'id'> & { id?: string };

export interface DashboardContext {
  draft: DraftProfile;
  setDraft: React.Dispatch<React.SetStateAction<DraftProfile | null>>;
  saving: boolean;
  uploading: boolean;
  message: string | null;
  error: string | null;
  handleSave: (status: 'draft' | 'published') => Promise<void>;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

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
    phonePublic: true,
    email,
    emailPublic: true,
    url: undefined,
    address: '',
    addressPublic: true,
    city: '',
    countryLine: '',
    status: 'draft',
    visibility: 'public',
    templateId: 'classic',
    themePrimary: '#0100AD',
    themeSecondary: '#3a39d0',
    services: [],
    social: {},
  };
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Accueil', icon: LayoutGrid, end: true },
  { to: '/dashboard/edit', label: 'Modifier ma carte', icon: Pencil, end: false },
  { to: '/dashboard/settings', label: 'Paramètres', icon: SlidersHorizontal, end: false },
  { to: '/dashboard/qrcode', label: 'QR Code', icon: QrCode, end: false },
  { to: '/dashboard/directory', label: 'Annuaire', icon: Compass, end: false },
  { to: '/dashboard/rfid', label: 'Commander une carte RFID', icon: CreditCard, end: false },
];

function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DraftProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('dashboard-sidebar-collapsed') === '1');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('dashboard-sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    if (!user) return;
    getMyProfile(user.id)
      .then((existing) => setDraft(existing ?? emptyProfile(user.id, user.email ?? '')))
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
    getPendingIncomingCount(user.id)
      .then(setPendingCount)
      .catch(() => {});
  }, [user]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const previewUrl = URL.createObjectURL(file);
    setDraft((prev) => (prev ? { ...prev, photo: previewUrl } : prev));
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadPhoto(user.id, file);
      setDraft((prev) => (prev ? { ...prev, photo: publicUrl } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!draft || !user) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      let saved = await saveProfile({ ...draft, status });
      if (status === 'published') {
        try {
          const qrCodeUrl = await generateAndUploadQrCode(user.id, saved.slug);
          saved = await saveProfile({ ...saved, qrCodeUrl });
        } catch {
          // Publishing still succeeds even if QR generation fails; retry from the QR Code page.
        }
      }
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
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden text-sm text-gray-500 font-medium">
        <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <span className="relative z-10">Chargement…</span>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center relative z-10">
          <p className="text-sm text-red-600 font-medium">{error ?? 'Une erreur est survenue.'}</p>
        </div>
      </div>
    );
  }

  const dashStyle = { '--dash-brand': draft.themePrimary } as CSSProperties;

  const navLinkClass = (isActive: boolean, isCollapsed: boolean) =>
    `relative flex items-center gap-3 rounded-2xl text-sm font-semibold transition-all ${
      isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
    } ${isActive ? 'text-white shadow-md shadow-[#0100AD]/20' : 'text-gray-600 hover:bg-gray-100/80'}`;

  const renderSidebarContent = (isCollapsed: boolean) => (
    <>
      <div className={`mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
        {!isCollapsed && <h1 className="text-sm font-black text-gray-900 tracking-tight">Tableau de bord</h1>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title={isCollapsed ? 'Déplier' : 'Replier'}
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isCollapsed ? label : undefined}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
            style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!isCollapsed && label}
          </NavLink>
        ))}
        <NavLink
          to="/dashboard/connections"
          title={isCollapsed ? 'Connexions' : undefined}
          onClick={() => setMobileNavOpen(false)}
          className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
          style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          {!isCollapsed && (
            <span className="flex items-center gap-1.5 flex-1">
              Connexions
              {pendingCount > 0 && (
                <span
                  className="ml-auto text-[10px] font-bold text-white rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: draft.themePrimary }}
                >
                  {pendingCount}
                </span>
              )}
            </span>
          )}
          {isCollapsed && pendingCount > 0 && (
            <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-red-500 shadow-sm" />
          )}
        </NavLink>
        {isAdmin(user?.email) && (
          <>
            <div className="pt-3 pb-1">
              {!isCollapsed && <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Admin</span>}
              {isCollapsed && <div className="border-t border-gray-100 my-2" />}
            </div>
            <NavLink
              to="/dashboard/admin/profiles"
              title={isCollapsed ? 'Gérer les cartes (admin)' : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
              style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!isCollapsed && 'Gérer les cartes'}
            </NavLink>
            <NavLink
              to="/dashboard/admin/rfid"
              title={isCollapsed ? 'Commandes RFID (admin)' : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
              style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {!isCollapsed && 'Commandes RFID'}
            </NavLink>
            <NavLink
              to="/dashboard/admin/contact"
              title={isCollapsed ? 'Messages (admin)' : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
              style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
            >
              <Mail className="w-4 h-4 shrink-0" />
              {!isCollapsed && 'Messages'}
            </NavLink>
            <NavLink
              to="/dashboard/admin/events"
              title={isCollapsed ? 'Événements (admin)' : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
              style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              {!isCollapsed && 'Événements'}
            </NavLink>
          </>
        )}
      </nav>
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Déconnexion' : undefined}
          className={`flex items-center gap-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all ${
            isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" /> {!isCollapsed && 'Déconnexion'}
        </button>
        {!isCollapsed && (
          <div className="flex items-center justify-center gap-2 px-2 pt-2 text-[11px] text-gray-400 font-medium">
            <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
              Confidentialité
            </a>
            <span>·</span>
            <a href="/cgu" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
              CGU
            </a>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex relative overflow-x-hidden" style={dashStyle}>
      {/* Éléments décoratifs en arrière-plan (anneaux / cercles) */}
      <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-gray-100 bg-white/80 backdrop-blur-xl p-5 transition-[width] duration-300 relative z-20 shadow-sm ${
          collapsed ? 'w-[84px]' : 'w-68'
        }`}
      >
        {renderSidebarContent(collapsed)}
      </aside>

      {/* ===== MOBILE HEADER + DRAWER ===== */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <h1 className="text-sm font-black text-gray-900 tracking-tight">Tableau de bord</h1>
        <button onClick={() => setMobileNavOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
          <div
            className="relative w-72 bg-white h-full p-5 flex flex-col shadow-2xl transition-transform animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileNavOpen(false)}
              className="self-end w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 mb-4 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent(false)}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 relative z-10 flex flex-col">
        <Outlet
          context={
            {
              draft,
              setDraft,
              saving,
              uploading,
              message,
              error,
              handleSave,
              handlePhotoChange,
            } satisfies DashboardContext
          }
        />
      </main>
    </div>
  );
}

export default DashboardLayout;