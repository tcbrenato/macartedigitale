import { Link } from 'react-router-dom';
import { UserPlus, Palette, Share2, QrCode, Contact, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: UserPlus, title: 'Inscris-toi', desc: 'Crée ton compte en quelques secondes, avec ton email ou Google.' },
  { icon: Palette, title: 'Personnalise ta carte', desc: 'Photo, contacts, services, réseaux sociaux et couleurs de marque — avec un aperçu en direct.' },
  { icon: Share2, title: 'Partage-la', desc: 'Un lien unique et un QR code prêts à être partagés ou imprimés.' },
];

const FEATURES = [
  { icon: Contact, title: 'Contacts en un tap', desc: 'Appel, WhatsApp, email, site web et réseaux sociaux directement accessibles.' },
  { icon: QrCode, title: 'QR code automatique', desc: 'Généré à chaque publication, téléchargeable et prêt à imprimer.' },
  { icon: Sparkles, title: 'À ton image', desc: "Deux couleurs de marque personnalisables pour que la carte te ressemble." },
];

function Landing() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col">
      {/* ===== 1. HERO ===== */}
      <section className="flex flex-col items-center justify-center text-center gap-6 px-6 py-20 sm:py-28">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 max-w-lg leading-tight">
          Ta carte de visite digitale, prête en quelques minutes
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-md">
          Crée, personnalise et partage ta carte de visite digitale — avec ton propre lien et ton QR code.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[360px] sm:max-w-none justify-center">
          <Link
            to="/signup"
            className="min-h-[48px] px-6 flex items-center justify-center gap-2 bg-[#0100AD] hover:bg-[#00007a] text-white font-bold rounded-xl text-sm"
          >
            Créer ma carte <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="min-h-[48px] px-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl text-sm"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* ===== 2. COMMENT ÇA MARCHE ===== */}
      <section className="px-6 py-16 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 text-center mb-10">
            Comment ça marche
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#0100AD]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0100AD]" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0100AD] text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. FONCTIONNALITÉS ===== */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 text-center mb-10">
            Ce que tu peux faire
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0100AD]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0100AD]" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. CTA FINAL ===== */}
      <section className="px-6 py-16 bg-[#0100AD] text-center">
        <div className="max-w-md mx-auto flex flex-col items-center gap-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Prêt à créer ta carte ?</h2>
          <p className="text-sm text-white/80">
            Ça prend quelques minutes, et c'est gratuit pour commencer.
          </p>
          <Link
            to="/signup"
            className="min-h-[48px] px-6 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#0100AD] font-bold rounded-xl text-sm"
          >
            Créer ma carte <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link to="/confidentialite" className="hover:text-gray-700">
            Confidentialité
          </Link>
          <Link to="/cgu" className="hover:text-gray-700">
            Conditions d'utilisation
          </Link>
          <Link to="/contact" className="hover:text-gray-700">
            Contact
          </Link>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Carte de visite digitale</p>
      </footer>
    </div>
  );
}

export default Landing;
