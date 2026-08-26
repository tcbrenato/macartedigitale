import { useEffect, useState } from 'react';
import { getAllRfidOrders, updateRfidOrderStatus, type RfidOrderStatus, type RfidOrderWithProfile } from '@/lib/rfidOrders';

const STATUS_OPTIONS: RfidOrderStatus[] = ['pending', 'contacted', 'completed', 'cancelled'];
const STATUS_LABELS: Record<RfidOrderStatus, string> = {
  pending: 'En attente',
  contacted: 'Contacté(e)',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

function AdminRfidOrders() {
  const [orders, setOrders] = useState<RfidOrderWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllRfidOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: RfidOrderStatus) => {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateRfidOrderStatus(id, status);
    } catch (err) {
      setOrders(previous);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">Chargement…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Commandes RFID</h2>
        <p className="text-sm text-gray-500 mt-1">{orders.length} demande(s)</p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400">Aucune demande pour l'instant.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {order.profile ? `${order.profile.firstName} ${order.profile.lastName}` : 'Profil supprimé'}
                  </p>
                  {order.profile && (
                    <p className="text-xs text-gray-500 truncate">
                      {order.profile.email} · {order.profile.phone} · /{order.profile.slug}
                    </p>
                  )}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as RfidOrderStatus)}
                  className="text-xs font-semibold rounded-lg border border-gray-200 px-2 py-1.5 shrink-0"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-700">Quantité : {order.quantity}</p>
              {order.notes && <p className="text-xs text-gray-500">{order.notes}</p>}
              <p className="text-[11px] text-gray-400">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRfidOrders;
