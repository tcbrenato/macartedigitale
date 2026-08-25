import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate('/dashboard');
  };

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white rounded-3xl card-shadow p-6">
        <h1 className="text-lg font-extrabold text-gray-900 text-center">Connexion</h1>
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
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0100AD]"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0100AD] hover:bg-[#00007a] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <button
          onClick={handleGoogle}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 rounded-xl text-sm"
        >
          Continuer avec Google
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-[#0100AD] font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
