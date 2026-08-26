import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Check, UserPlus, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getMyEvents, searchEventDirectory, type EventSummary } from '@/lib/events';
import { getAllMyConnections, sendConnectionRequest, respondToRequest, type Connection } from '@/lib/connections';
import type { Profile } from '@/types/profile';
import type { DashboardContext } from './DashboardLayout';

function Directory() {
  const { user } = useAuth();
  const { draft } = useOutletContext<DashboardContext>();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [eventId, setEventId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([getMyEvents(user.id), getAllMyConnections(user.id)])
      .then(([myEvents, conns]) => {
        setEvents(myEvents);
        setEventId(myEvents[0]?.id ?? null);
        setConnections(conns);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user || !eventId) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchEventDirectory(eventId, query, user.id)
        .then(setResults)
        .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, eventId, user]);

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
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  if (events.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-10 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--dash-brand)]/10 text-[var(--dash-brand)] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-gray-950 tracking-tight">Fonctionnalité premium</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            L'Annuaire et les Connexions sont réservés aux participants d'un événement (par exemple une conférence).
            Contacte-nous pour en savoir plus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Annuaire</h2>
        <p className="text-sm text-gray-500 mt-1">Découvre et connecte-toi aux autres participants.</p>
      </div>

      {events.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {events.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEventId(e.id)}
              className="text-xs font-bold px-4 py-2 rounded-2xl transition-all"
              style={
                eventId === e.id
                  ? { backgroundColor: draft.themePrimary, color: 'white' }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }
              }
            >
              {e.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, titre, ville ou lien..."
          className="w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl pl-11 pr-4 py-3 text-sm outline-none transition-all focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Aucun résultat.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((p) => {
            const conn = p.userId ? connectionByUserId.get(p.userId) : undefined;
            const busy = busyId === p.userId;
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4 transition-all"
              >
                <img
                  src={p.photo}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-950 truncate">
                    {p.firstName} {p.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                    {p.title || p.organization}
                    {p.city ? ` · ${p.city}` : ''}
                  </p>
                </div>
                {!p.userId ? null : !conn ? (
                  <button
                    type="button"
                    onClick={() => handleConnect(p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-60 shrink-0 transition-all shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Se connecter
                  </button>
                ) : conn.status === 'accepted' ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 shrink-0 px-3 py-1.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <Check className="w-3.5 h-3.5" /> Connecté
                  </span>
                ) : conn.status === 'pending' && conn.addresseeId === user?.id ? (
                  <button
                    type="button"
                    onClick={() => handleAccept(conn.id, p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl text-white disabled:opacity-60 shrink-0 transition-all shadow-md hover:opacity-95"
                    style={{ backgroundColor: draft.themePrimary }}
                  >
                    <Check className="w-3.5 h-3.5" /> Accepter
                  </button>
                ) : conn.status === 'pending' ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 shrink-0 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <Clock className="w-3.5 h-3.5" /> Demande envoyée
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(p.userId as string)}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-60 shrink-0 transition-all shadow-2xs"
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
