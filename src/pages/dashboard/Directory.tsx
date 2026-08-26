import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Check, UserPlus, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { searchDirectory } from '@/lib/profiles';
import { getAllMyConnections, sendConnectionRequest, respondToRequest, type Connection } from '@/lib/connections';
import type { Profile } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';

function Directory() {
  const { user } = useAuth();
  const { draft } = useOutletContext<DashboardContext>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([searchDirectory('', user.id), getAllMyConnections(user.id)])
      .then(([profiles, conns]) => {
        setResults(profiles);
        setConnections(conns);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      searchDirectory(query, user.id)
        .then(setResults)
        .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'));
    }, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const connectionByUserId = useMemo(() => {
    if (!user) return new Map<string, Connection>();
    const map = new Map<string, Connection>();
    for (const c of connections) {
      const otherId = c.requesterId === user.id ? c.addresseeId : c.requesterId;
      map.set(otherId, c);
    }
    return map;
  }, [connections, user]);

  const handleConnect = async (otherUserId: string) => {
    if (!user) return;
    setBusyId(otherUserId);
    setError(null);
    try {
      const conn = await sendConnectionRequest(user.id, otherUserId);
      setConnections((prev) => [...prev.filter((c) => c.id !== conn.id), conn]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  };

  const handleAccept = async (connectionId: string, otherUserId: string) => {
    setBusyId(otherUserId);
    setError(null);
    try {
      await respondToRequest(connectionId, true);
      setConnections((prev) => prev.map((c) => (c.id === connectionId ? { ...c, status: 'accepted' } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Annuaire</h2>
        <p className="text-sm text-gray-500 mt-1">Découvre et connecte-toi aux autres membres de la plateforme.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, titre, ville ou lien..."
          className="w-full min-h-[48px] rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-gray-300"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {results.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun résultat.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map((p) => {
            const conn = p.userId ? connectionByUserId.get(p.userId) : undefined;
            const busy = busyId === p.userId;
            return (
              <div key={p.id} className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
                <img src={p.photo} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {p.firstName} {p.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {p.title || p.organization}
                    {p.city ? ` · ${p.city}` : ''}
                  </p>
                </div>
                {!p.userId ? null : !conn ? (
                  <button
                    onClick={() => handleConnect(p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Se connecter
                  </button>
                ) : conn.status === 'accepted' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 shrink-0">
                    <Check className="w-3.5 h-3.5" /> Connecté
                  </span>
                ) : conn.status === 'pending' && conn.addresseeId === user?.id ? (
                  <button
                    onClick={() => handleAccept(conn.id, p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-60 shrink-0"
                    style={{ backgroundColor: draft.themePrimary }}
                  >
                    <Check className="w-3.5 h-3.5" /> Accepter
                  </button>
                ) : conn.status === 'pending' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" /> Demande envoyée
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect(p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Se connecter
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Directory;
