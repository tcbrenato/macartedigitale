import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Calendar } from 'lucide-react';
import { getAllEvents, createEvent, type EventSummary } from '@/lib/events';

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const reload = () => {
    getAllEvents()
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  };

  useEffect(reload, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createEvent(name.trim());
      setName('');
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Événements</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gère l'accès premium à l'Annuaire et aux Connexions par événement (ex. une conférence).
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du nouvel événement (ex. COPAF 2026)"
          className="flex-1 min-h-[48px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl px-4 text-sm outline-none focus:border-gray-400 transition-all shadow-2xs"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="flex items-center gap-1.5 text-sm font-bold px-4 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Créer
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Aucun événement pour l'instant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => navigate(`/dashboard/admin/events/${ev.id}`)}
              className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4 text-left hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-950 truncate">{ev.name}</h3>
                <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">/{ev.slug}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
