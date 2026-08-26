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
    return <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">Chargement…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Messages de contact</h2>
        <p className="text-sm text-gray-500 mt-1">{messages.length} message(s)</p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {messages.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun message pour l'instant.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2 ${
                m.read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500 truncate">{m.email}</p>
                </div>
                <button
                  onClick={() => toggleRead(m.id, !m.read)}
                  className="text-xs font-semibold rounded-lg border border-gray-200 px-2.5 py-1.5 shrink-0 hover:bg-gray-50"
                >
                  {m.read ? 'Marquer non lu' : 'Marquer lu'}
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
              <p className="text-[11px] text-gray-400">{new Date(m.createdAt).toLocaleString('fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;
