import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, X, UserMinus, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  getMyConnections,
  getPendingIncoming,
  getPendingOutgoing,
  respondToRequest,
  removeConnection,
  type ConnectionWithProfile,
} from '@/lib/connections';
import type { DashboardContext } from './DashboardLayout';

function PersonRow({
  entry,
  children,
}: {
  entry: ConnectionWithProfile;
  children: React.ReactNode;
}) {
  const { otherProfile } = entry;
  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-4 transition-all">
      {otherProfile ? (
        <img
          src={otherProfile.photo}
          alt=""
          className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-2xs"
        />
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0 border border-gray-100" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-950 truncate">
          {otherProfile ? `${otherProfile.firstName} ${otherProfile.lastName}` : 'Profil indisponible'}
        </h3>
        {otherProfile && (
          <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
            {otherProfile.title || otherProfile.organization}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );
}

function Connections() {
  const { user } = useAuth();
  const { draft } = useOutletContext<DashboardContext>();
  const [incoming, setIncoming] = useState<ConnectionWithProfile[]>([]);
  const [outgoing, setOutgoing] = useState<ConnectionWithProfile[]>([]);
  const [accepted, setAccepted] = useState<ConnectionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    if (!user) return;
    setLoading(true);
    Promise.all([getPendingIncoming(user.id), getPendingOutgoing(user.id), getMyConnections(user.id)])
      .then(([inc, out, acc]) => {
        setIncoming(inc);
        setOutgoing(out);
        setAccepted(acc);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  };

  useEffect(reload, [user]);

  const handleAccept = async (id: string) => {
    setError(null);
    try {
      await respondToRequest(id, true);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const handleDecline = async (id: string) => {
    setError(null);
    try {
      await respondToRequest(id, false);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const handleRemove = async (id: string) => {
    setError(null);
    try {
      await removeConnection(id);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Connexions</h2>
        <p className="text-sm text-gray-500 mt-1">Gère tes demandes et tes connexions.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Demandes reçues */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Demandes reçues {incoming.length > 0 && `(${incoming.length})`}
        </h3>
        {incoming.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-xs text-gray-400 font-medium">Aucune demande en attente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {incoming.map((entry) => (
              <PersonRow key={entry.connection.id} entry={entry}>
                <button
                  type="button"
                  onClick={() => handleAccept(entry.connection.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl text-white shadow-md hover:opacity-95 transition-all"
                  style={{ backgroundColor: draft.themePrimary }}
                >
                  <Check className="w-3.5 h-3.5" /> Accepter
                </button>
                <button
                  type="button"
                  onClick={() => handleDecline(entry.connection.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all shadow-2xs text-gray-700"
                >
                  <X className="w-3.5 h-3.5" /> Refuser
                </button>
              </PersonRow>
            ))}
          </div>
        )}
      </section>

      {/* Demandes envoyées */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Demandes envoyées</h3>
        {outgoing.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-xs text-gray-400 font-medium">Aucune demande envoyée.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {outgoing.map((entry) => (
              <PersonRow key={entry.connection.id} entry={entry}>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.connection.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all shadow-2xs text-gray-700"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Annuler
                </button>
              </PersonRow>
            ))}
          </div>
        )}
      </section>

      {/* Mes connexions */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Mes connexions {accepted.length > 0 && `(${accepted.length})`}
        </h3>
        {accepted.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-xs text-gray-400 font-medium">Aucune connexion pour l'instant.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {accepted.map((entry) => (
              <PersonRow key={entry.connection.id} entry={entry}>
                {entry.otherProfile && (
                  <a
                    href={`/${entry.otherProfile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all shadow-2xs text-gray-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Voir la carte
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(entry.connection.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 transition-all shadow-2xs text-red-600 border border-red-100"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Retirer
                </button>
              </PersonRow>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Connections;