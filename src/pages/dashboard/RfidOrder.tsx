import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { createRfidOrder, getMyRfidOrders, type RfidOrder, type RfidOrderStatus } from '@/lib/rfidOrders';
import type { DashboardContext } from './DashboardLayout';

const STATUS_LABELS: Record<RfidOrderStatus, string> = {
  pending: 'En attente',
  contacted: 'Contacté(e)',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<RfidOrderStatus, string> = {
  pending: '#B45309',
  contacted: '#0E7490',
  completed: '#15803D',
  cancelled: '#DC2626',
};

function RfidOrder() {
  const { draft } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [orders, setOrders] = useState<RfidOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMyRfidOrders(user.id)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !draft.id) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const order = await createRfidOrder(user.id, draft.id, quantity, notes);
      setOrders((prev) => [order, ...prev]);
      setNotes('');
      setQuantity(1);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Commander une carte RFID</h2>
        <p className="text-sm text-gray-500 mt-1">
          Envoie ta demande — on te recontacte directement pour discuter du design, des matériaux et de la quantité.
        </p>
      </div>

      {!draft.id ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Enregistre d'abord ta carte (dans "Modifier ma carte") avant de commander.
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Quantité</label>
            <input
              type="number"
              min={1}
              className="w-full min-h-[48px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none mt-1.5 focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs transition-all"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Précisions (design, matériaux, délai...)</label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none mt-1.5 focus:border-[var(--dash-brand)] focus:ring-2 focus:ring-[var(--dash-brand)]/15 shadow-2xs transition-all"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : fond noir mat avec logo doré..."
            />
          </div>
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-600 font-medium">
              Demande envoyée !
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:opacity-95"
            style={{ backgroundColor: draft.themePrimary }}
          >
            <Send className="w-4 h-4" /> {submitting ? 'Envoi…' : 'Envoyer ma demande'}
          </button>
        </div>
      )}

      {!loadingOrders && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Mes demandes</h3>
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-3 transition-all"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{order.quantity} carte(s)</p>
                  {order.notes && <p className="text-xs text-gray-500 mt-0.5 truncate font-medium">{order.notes}</p>}
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${STATUS_COLORS[order.status]}1A`, color: STATUS_COLORS[order.status] }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RfidOrder;