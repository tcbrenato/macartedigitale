import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { getAllProfileSummaries, type ProfileSummary } from '@/lib/profiles';

function AdminProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getAllProfileSummaries()
      .then(setProfiles)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) =>
      [p.firstName, p.lastName, p.slug, p.email].some((field) => field.toLowerCase().includes(q))
    );
  }, [profiles, query]);

  if (loading) {
    return <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Cartes des utilisateurs</h2>
        <p className="text-sm text-gray-500 mt-1">{profiles.length} carte(s)</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, email ou lien..."
          className="w-full min-h-[48px] rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-gray-300"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Aucune carte trouvée.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/dashboard/admin/profiles/${p.id}`)}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 text-left hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {p.firstName} {p.lastName}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0 ${
                      p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {p.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </span>
                  {!p.userId && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
                      Non réclamée
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {p.email || 'Sans email'} · /{p.slug || 'sans-lien'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProfiles;
