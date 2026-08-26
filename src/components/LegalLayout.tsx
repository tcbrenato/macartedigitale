import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: ReactNode;
}

function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#F9FAFB]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour à l'accueil
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-4">{title}</h1>
        <p className="text-xs text-gray-400 mt-1">Dernière mise à jour : {updated}</p>
        <div className="mt-6 flex flex-col gap-6 text-sm text-gray-700 leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LegalLayout;
