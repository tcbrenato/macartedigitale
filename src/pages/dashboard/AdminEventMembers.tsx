import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { getAllProfileSummaries, type ProfileSummary } from '@/lib/profiles';
import { getEvent, getEventMembers, addEventMember, removeEventMember, deleteEvent, type EventSummary } from '@/lib/events';
import type { Profile } from '@/types/profile';

function AdminEventMembers() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [allProfiles, setAllProfiles] = useState<ProfileSummary[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = () => {
    if (!id) return;
    Promise.all([getEvent(id), getEventMembers(id), getAllProfileSummaries()])
      .then(([ev, mem, profiles]) => {
        setEvent(ev);
        setMembers(mem);
        setAllProfiles(profiles);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  };

  useEffect(reload, [id]);

  const memberIds = useMemo(() => new Set(members.map((m) => m.userId).filter(Boolean)), [members]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProfiles
      .filter((p) => p.userId && !memberIds.has(p.userId))
      .filter((p) => [p.firstName, p.lastName, p.slug, p.email].some((field) => field.toLowerCase().includes(q)))
      .slice(0, 10);
  }, [allProfiles, memberIds, query]);

  const handleAdd = async (userId: string) => {
    if (!id) return;
    setBusyId(userId);
    setError(null);
    try {
      await addEventMember(id, userId);
      setQuery('');
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!id) return;
    setBusyId(userId);
    setError(null);
    try {
      await removeEventMember(id, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id || !event) return;
    if (!window.confirm(`Supprimer l'événement « ${event.name} » ? Tous ses membres perdront l'accès à l'Annuaire/Connexions liés.`)) return;
    try {
      await deleteEvent(id);
      navigate('/dashboard/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  if (!event) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-red-600 font-medium">{error ?? 'Événement introuvable.'}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate('/dashboard/admin/events')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 self-start"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les événements
      </button>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-950 tracking-tight">{event.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} membre(s) · /{event.slug}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeleteEvent}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" /> Supprimer
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une carte à ajouter (nom, email, lien)..."
          className="w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-400 transition-all shadow-2xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="flex flex-col gap-2">
          {searchResults.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-950 truncate">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{p.email}</p>
              </div>
              <button
                type="button"
                onClick={() => handleAdd(p.userId as string)}
                disabled={busyId === p.userId}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white transition-all shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 mb-3">Membres</h3>
        {members.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray-400 font-medium">Aucun membre pour l'instant.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4"
              >
                <img
                  src={m.photo}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-950 truncate">
                    {m.firstName} {m.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{m.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(m.userId as string)}
                  disabled={busyId === m.userId}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-60 shrink-0 transition-all shadow-2xs"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Retirer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEventMembers;
