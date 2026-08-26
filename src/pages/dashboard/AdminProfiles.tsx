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
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Cartes des utilisateurs</h2>
        <p className="text-sm text-gray-500 mt-1">{profiles.length} carte(s)</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, email ou lien..."
          className="w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl pl-11 pr-4 py-3 text-sm text-gray-950 placeholder-gray-400 outline-none focus:border-gray-400 transition-all shadow-2xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Aucune carte trouvée.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`/dashboard/admin/profiles/${p.id}`)}
              className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4 text-left hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-950 truncate">
                    {p.firstName} {p.lastName}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      p.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-gray-100 text-gray-500 border border-gray-200/60'
                    }`}
                  >
                    {p.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </span>
                  {!p.userId && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                      Non réclamée
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1 font-medium">
                  {p.email || 'Sans email'} · /{p.slug || 'sans-lien'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProfiles;