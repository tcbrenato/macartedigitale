import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Carte de visite digitale</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
          Crée, personnalise et partage ta carte de visite digitale en quelques minutes.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <Link
          to="/signup"
          className="bg-[#0100AD] hover:bg-[#00007a] text-white font-bold py-2.5 rounded-xl text-sm text-center"
        >
          Créer ma carte
        </Link>
        <Link
          to="/login"
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2.5 rounded-xl text-sm text-center"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}

export default Landing;
