import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
      <p className="text-sm text-gray-500">Cette carte de visite n'existe pas.</p>
      <Link to="/" className="text-sm font-semibold text-[#0100AD] hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
