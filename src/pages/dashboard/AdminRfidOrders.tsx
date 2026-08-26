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
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Commandes RFID</h2>
        <p className="text-sm text-gray-500 mt-1">{orders.length} demande(s)</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Aucune demande pour l'instant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-950">
                    {order.profile ? `${order.profile.firstName} ${order.profile.lastName}` : 'Profil supprimé'}
                  </p>
                  {order.profile && (
                    <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                      {order.profile.email} · {order.profile.phone} · /{order.profile.slug}
                    </p>
                  )}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as RfidOrderStatus)}
                  className="text-xs font-bold rounded-2xl border border-gray-200 bg-white px-3 py-2 shrink-0 outline-none transition-all shadow-2xs cursor-pointer hover:border-gray-300"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-900">Quantité : {order.quantity} carte(s)</p>
                {order.notes && <p className="text-xs text-gray-600 font-medium">{order.notes}</p>}
                <p className="text-[11px] text-gray-400 font-medium mt-1">
                  {new Date(order.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRfidOrders;