import { useEffect, useState } from 'react';
import { getContactMessages, markContactMessageRead, type ContactMessage } from '@/lib/contact';

function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getContactMessages()
      .then(setMessages)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id: string, read: boolean) => {
    const previous = messages;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      await markContactMessageRead(id, read);
    } catch (err) {
      setMessages(previous);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-950 tracking-tight">Messages de contact</h2>
        <p className="text-sm text-gray-500 mt-1">{messages.length} message(s)</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 transition-all ${
                m.opacity ?? (m.read ? 'opacity-60' : '')
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-950">{m.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{m.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, !m.read)}
                  className="text-xs font-bold rounded-2xl border border-gray-200 bg-white px-3 py-2 shrink-0 hover:bg-gray-50 transition-all shadow-2xs text-gray-700 cursor-pointer"
                >
                  {m.read ? 'Marquer non lu' : 'Marquer lu'}
                </button>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap font-medium">{m.message}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1">
                  {new Date(m.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;