import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import { getPublishedProfileBySlug } from '@/lib/profiles';
import { getConnectionStatusWith } from '@/lib/connections';
import { useAuth } from '@/lib/auth';
import type { Profile } from '@/types/profile';
import NotFound from './NotFound';

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
      <div className="h-[100dvh] w-full flex items-center justify-center text-sm text-gray-400">
        Chargement…
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="h-[100dvh] w-full">
      <BusinessCard profile={profile} isConnection={isConnection} />
    </div>
  );
}

export default ProfilePage;
