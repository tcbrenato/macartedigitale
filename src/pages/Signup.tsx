import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Zap, ArrowLeft, Lock, Mail, CheckCircle2 } from 'lucide-react';

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

  // État de confirmation d'email envoyé
  if (sent) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />

        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 relative z-10 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0100AD]/10 text-[#0100AD] flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Vérifie tes emails</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Un lien de confirmation vient d'être envoyé à <span className="font-semibold text-gray-800">{email}</span>. Clique dessus pour activer ton compte.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-2xl text-sm transition-all"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
      
      {/* Éléments décoratifs (anneaux / cercles inspirés du design global) */}
      <div className="absolute -top-24 -left-24 w-80 h-80 border-[35px] border-[#0100AD]/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[45px] border-[#0100AD]/5 rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 relative z-10 flex flex-col gap-6">
        
        {/* En-tête / Retour & Logo */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 font-black text-base tracking-tight text-gray-900">
            <div className="w-8 h-8 rounded-xl bg-[#0100AD] flex items-center justify-center text-white shadow-md shadow-[#0100AD]/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>TCBcard</span>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Créer un compte 🚀</h1>
          <p className="text-xs sm:text-sm text-gray-500">Commence à créer ta carte de visite connectée</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Adresse email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-[#0100AD] focus:ring-4 focus:ring-[#0100AD]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Mot de passe</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="6 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-[#0100AD] focus:ring-4 focus:ring-[#0100AD]/10 transition-all"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-xs text-gray-500 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 shrink-0 w-4 h-4 rounded border-gray-300 text-[#0100AD] focus:ring-[#0100AD]"
            />
            <span className="leading-relaxed">
              J'accepte la{' '}
              <Link to="/confidentialite" target="_blank" className="text-[#0100AD] font-semibold hover:underline">
                politique de confidentialité
              </Link>{' '}
              et les{' '}
              <Link to="/cgu" target="_blank" className="text-[#0100AD] font-semibold hover:underline">
                conditions d'utilisation
              </Link>
              .
            </span>
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !accepted}
            className="mt-2 w-full bg-[#0100AD] hover:bg-[#00008f] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl text-sm shadow-xl shadow-[#0100AD]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? 'Création en cours…' : 'Créer mon compte'}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium uppercase tracking-wider">ou</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Bouton Google */}
        <button
          onClick={handleGoogle}
          disabled={!accepted}
          type="button"
          className="w-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-3 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continuer avec Google
        </button>

        {/* Lien Connexion */}
        <p className="text-xs text-gray-500 text-center pt-1">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#0100AD] font-bold hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;