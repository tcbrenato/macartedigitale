import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendContactMessage } from '@/lib/contact';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendContactMessage(name, email, message);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 text-center">
        <div className="max-w-[320px]">
          <h1 className="text-lg font-extrabold text-gray-900">Message envoyé</h1>
          <p className="text-sm text-gray-500 mt-2">Merci, on te répond dès que possible.</p>
          <Link to="/" className="text-sm text-[#0100AD] font-semibold mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-3xl card-shadow p-6">
        <h1 className="text-lg font-extrabold text-gray-900 text-center">Nous contacter</h1>
        <p className="text-xs text-gray-500 text-center mt-1">
          Une question, une demande sur tes données personnelles ? Écris-nous ici.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD]"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD]"
          />
          <textarea
            required
            rows={4}
            placeholder="Ton message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD] resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0100AD] hover:bg-[#00007a] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm"
          >
            {loading ? 'Envoi…' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
