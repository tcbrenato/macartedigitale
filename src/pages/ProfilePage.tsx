import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import { getPublishedProfileBySlug } from '@/lib/profiles';
import { getConnectionStatusWith } from '@/lib/connections';
import { useAuth } from '@/lib/auth';
import type { Profile } from '@/types/profile';
import NotFound from './NotFound';
import { AlertCircle, Loader2 } from 'lucide-react';

function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isConnection, setIsConnection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setIsConnection(false);

    getPublishedProfileBySlug(slug)
      .then(async (result) => {
        if (cancelled) return;
        setProfile(result);
        if (result?.userId && user && user.id !== result.userId) {
          try {
            const conn = await getConnectionStatusWith(user.id, result.userId);
            if (!cancelled) setIsConnection(conn?.status === 'accepted');
          } catch {
            // Non-fatal: worst case, private fields just stay hidden.
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden gap-4">
        <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        
        <div className="w-14 h-14 rounded-2xl bg-[#0100AD]/10 text-[#0100AD] flex items-center justify-center shadow-inner relative z-10">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <p className="text-sm font-bold text-gray-600 tracking-tight relative z-10">Chargement du profil…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />

        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 relative z-10 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Oups, une erreur</h1>
            <p className="text-sm text-gray-500 leading-relaxed">{error}</p>
          </div>
          <Link
            to="/"
            className="w-full mt-2 bg-[#0100AD] hover:bg-[#00008f] text-white font-bold py-3.5 rounded-2xl text-sm shadow-xl shadow-[#0100AD]/20 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
      <BusinessCard profile={profile} isConnection={isConnection} />
    </div>
  );
}

export default ProfilePage;