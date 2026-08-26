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
    <div className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4">
      {otherProfile ? (
        <img src={otherProfile.photo} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 truncate">
          {otherProfile ? `${otherProfile.firstName} ${otherProfile.lastName}` : 'Profil indisponible'}
        </h3>
        {otherProfile && <p className="text-xs text-gray-500 truncate">{otherProfile.title || otherProfile.organization}</p>}
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
    return <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">Chargement…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Connexions</h2>
        <p className="text-sm text-gray-500 mt-1">Gère tes demandes et tes connexions.</p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Demandes reçues {incoming.length > 0 && `(${incoming.length})`}
        </h3>
        {incoming.length === 0 ? (
          <p className="text-xs text-gray-400">Aucune demande en attente.</p>
        ) : (
          incoming.map((entry) => (
            <PersonRow key={entry.connection.id} entry={entry}>
              <button
                onClick={() => handleAccept(entry.connection.id)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white"
                style={{ backgroundColor: draft.themePrimary }}
              >
                <Check className="w-3.5 h-3.5" /> Accepter
              </button>
              <button
                onClick={() => handleDecline(entry.connection.id)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-3.5 h-3.5" /> Refuser
              </button>
            </PersonRow>
          ))
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Demandes envoyées</h3>
        {outgoing.length === 0 ? (
          <p className="text-xs text-gray-400">Aucune demande envoyée.</p>
        ) : (
          outgoing.map((entry) => (
            <PersonRow key={entry.connection.id} entry={entry}>
              <button
                onClick={() => handleRemove(entry.connection.id)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <UserMinus className="w-3.5 h-3.5" /> Annuler
              </button>
            </PersonRow>
          ))
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Mes connexions {accepted.length > 0 && `(${accepted.length})`}
        </h3>
        {accepted.length === 0 ? (
          <p className="text-xs text-gray-400">Aucune connexion pour l'instant.</p>
        ) : (
          accepted.map((entry) => (
            <PersonRow key={entry.connection.id} entry={entry}>
              {entry.otherProfile && (
                <a
                  href={`/${entry.otherProfile.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Voir la carte
                </a>
              )}
              <button
                onClick={() => handleRemove(entry.connection.id)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-red-500"
              >
                <UserMinus className="w-3.5 h-3.5" /> Retirer
              </button>
            </PersonRow>
          ))
        )}
      </section>
    </div>
  );
}

export default Connections;
