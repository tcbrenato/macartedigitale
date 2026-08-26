import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate('/dashboard');
    } else {
      setSent(true);
    }
  };

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  if (sent) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center p-4 text-center">
        <div className="max-w-[320px]">
          <h1 className="text-lg font-extrabold text-gray-900">Vérifie tes emails</h1>
          <p className="text-sm text-gray-500 mt-2">
            Un lien de confirmation vient d'être envoyé à {email}. Clique dessus pour activer ton compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white rounded-3xl card-shadow p-6">
        <h1 className="text-lg font-extrabold text-gray-900 text-center">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD]"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mot de passe (6 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD]"
          />
          <label className="flex items-start gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <span>
              J'accepte la{' '}
              <Link to="/confidentialite" target="_blank" className="text-[#0100AD] font-semibold">
                politique de confidentialité
              </Link>{' '}
              et les{' '}
              <Link to="/cgu" target="_blank" className="text-[#0100AD] font-semibold">
                conditions d'utilisation
              </Link>
              .
            </span>
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !accepted}
            className="w-full bg-[#0100AD] hover:bg-[#00007a] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm"
          >
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <button
          onClick={handleGoogle}
          disabled={!accepted}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-semibold py-2.5 rounded-xl text-sm"
        >
          Continuer avec Google
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#0100AD] font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
