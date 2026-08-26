import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Pencil, QrCode, LogOut, Menu, X, CreditCard, ShieldCheck, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getMyProfile, saveProfile, uploadPhoto } from '@/lib/profiles';
import { generateAndUploadQrCode } from '@/lib/qrcode';
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
  { to: '/dashboard/qrcode', label: 'QR Code', icon: QrCode, end: false },
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

  useEffect(() => {
    localStorage.setItem('dashboard-sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    if (!user) return;
    getMyProfile(user.id)
      .then((existing) => setDraft(existing ?? emptyProfile(user.id, user.email ?? '')))
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
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

  const dashStyle = { '--dash-brand': draft.themePrimary } as CSSProperties;

  const navLinkClass = (isActive: boolean, isCollapsed: boolean) =>
    `flex items-center gap-3 rounded-xl text-sm font-semibold transition-colors ${
      isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'
    } ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  const renderSidebarContent = (isCollapsed: boolean) => (
    <>
      <div className={`mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3.5'}`}>
        {!isCollapsed && <h1 className="text-sm font-extrabold text-gray-900">Mon tableau de bord</h1>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          title={isCollapsed ? 'Déplier' : 'Replier'}
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
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
        {isAdmin(user?.email) && (
          <NavLink
            to="/dashboard/admin/rfid"
            title={isCollapsed ? 'Commandes RFID (admin)' : undefined}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
            style={({ isActive }) => (isActive ? { backgroundColor: draft.themePrimary } : undefined)}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {!isCollapsed && 'Commandes RFID (admin)'}
          </NavLink>
        )}
      </nav>
      <button
        onClick={handleLogout}
        title={isCollapsed ? 'Déconnexion' : undefined}
        className={`flex items-center gap-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 ${
          isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'
        }`}
      >
        <LogOut className="w-4 h-4 shrink-0" /> {!isCollapsed && 'Déconnexion'}
      </button>
    </>
  );

  return (
    <div className="min-h-[100dvh] w-full bg-[#F9FAFB] flex" style={dashStyle}>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-gray-200 bg-white p-4 transition-[width] duration-200 ${
          collapsed ? 'w-[72px]' : 'w-60'
        }`}
      >
        {renderSidebarContent(collapsed)}
      </aside>

      {/* ===== MOBILE HEADER + DRAWER ===== */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <h1 className="text-sm font-extrabold text-gray-900">Mon tableau de bord</h1>
        <button onClick={() => setMobileNavOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-64 bg-white h-full p-4 flex flex-col animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileNavOpen(false)}
              className="self-end w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 mb-2"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent(false)}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
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
