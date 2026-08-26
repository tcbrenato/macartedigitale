import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Palette, Share2, QrCode, Contact, Sparkles, ArrowRight, Zap, Linkedin, Facebook, Instagram, Mail } from 'lucide-react';

const RENATO_SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/renato-tchobo/',
  facebook: 'https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL',
  instagram: 'https://www.instagram.com/renato_tchobo?igsh=MXFqMGs1eTB6Zm5vdQ%3D%3D&utm_source=qr',
};

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

// Liste des avantages et cas d'usage pour l'effet dynamique
const HERO_BENEFITS = [
  "Partage tes contacts en un tap grâce à la technologie NFC.",
  "Fais sensation lors de tes conférences et événements pro.",
  "Génère un QR Code unique, instantané et élégant.",
  "Dis adieu aux cartes en papier qui finissent à la poubelle."
];

function Landing() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Effet machine à écrire (Typewriter)
  useEffect(() => {
    const i = loopNum % HERO_BENEFITS.length;
    const fullText = HERO_BENEFITS[i];

    const handleTyping = () => {
      setDisplayText(
        isDeleting 
          ? fullText.substring(0, displayText.length - 1) 
          : fullText.substring(0, displayText.length + 1)
      );

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause avant d'effacer
        setTypingSpeed(50);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-gray-50 text-gray-900 selection:bg-[#0100AD] selection:text-white">
      
      {/* ===== HEADER BLANC AVEC TEXTE CENTRÉ ===== */}
      <header className="w-full bg-white text-gray-900 py-4 px-6 shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-black text-lg tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-[#0100AD] flex items-center justify-center text-white shadow-md shadow-[#0100AD]/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span>Cardify</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0100AD]/10 border border-[#0100AD]/20 text-[#0100AD] text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>La nouvelle génération de carte de visite</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">Se connecter</Link>
            <Link to="/signup" className="px-4 py-2 text-xs font-bold bg-[#0100AD] text-white hover:bg-[#00008f] rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95">Commencer</Link>
          </div>
        </div>
      </header>

      {/* ===== SECTION HERO EN BLEU AVEC TYPEWRITER ===== */}
      <section className="w-full bg-[#0100AD] text-white px-6 py-16 sm:py-24 relative overflow-hidden">
        {/* Éléments lumineux décoratifs & Anneaux inspirés du design */}
        <div className="absolute -top-12 -left-12 w-64 h-64 border-[30px] border-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-white/5 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 items-center gap-12 relative z-10">
          
          {/* Texte & Effet Typewriter */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Fais sensation lors de tes rencontres et conférences.
            </h1>
            
            {/* Zone Typewriter */}
            <div className="min-h-[60px] flex items-center">
              <p className="text-lg sm:text-xl text-amber-200 font-medium tracking-wide">
                <span>{displayText}</span>
                <span className="animate-pulse ml-1 border-r-2 border-amber-200 pr-1"></span>
              </p>
            </div>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
              Une seule carte connectée pour impressionner, partager instantanément tes liens et ne plus jamais passer inaperçu auprès de tes futurs clients ou partenaires.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to="/signup"
                className="min-h-[52px] px-8 flex items-center justify-center gap-2 bg-white text-[#0100AD] hover:bg-gray-100 font-bold rounded-2xl text-sm shadow-xl transition-all hover:scale-[1.02]"
              >
                Créer ma carte <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Vidéo de démo */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-[450px] h-[450px] rounded-full bg-white"></div>
            </div>
            <video
              src="/vidm2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg rounded-3xl object-cover aspect-[4/3] shadow-2xl border-4 border-white/30"
            />
          </div>

        </div>
      </section>

      {/* ===== 2. COMMENT ÇA MARCHE ===== */}
      <section className="px-6 py-20 bg-white border-b border-gray-100 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0100AD] mb-2">Processus simple</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">Comment ça marche ?</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group bg-gray-50/60 hover:bg-white border border-gray-100 hover:border-[#0100AD]/20 rounded-3xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#0100AD]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#0100AD]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0100AD] text-white text-xs font-bold flex items-center justify-center shadow-md">{i + 1}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 2.5 VOIS-LA EN ACTION ===== */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0100AD] mb-2">Démonstration</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">Vois-la en action</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <img
              src="/carte.png"
              alt="Carte de visite digitale scannée depuis un téléphone"
              className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
            />
            <video
              src="/vidmcd.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* ===== 3. FONCTIONNALITÉS ===== */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0100AD] mb-2">Fonctionnalités clés</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">Ce que tu peux faire</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#0100AD]/10 flex items-center justify-center group-hover:bg-[#0100AD] transition-colors">
                  <Icon className="w-5 h-5 text-[#0100AD] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. CTA FINAL (Style inspiré de l'image avec anneaux) ===== */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-[#0100AD] rounded-3xl p-10 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          
          {/* Cercles / Anneaux décoratifs en arrière-plan */}
          <div className="absolute -top-16 -left-16 w-56 h-56 border-[25px] border-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 border-[35px] border-white/10 rounded-full pointer-events-none" />

          <div className="max-w-lg mx-auto flex flex-col items-center gap-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Prêt à créer ta carte ?</h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Rejoins ceux qui modernisent leur réseau professionnel. Ça prend quelques minutes, et c'est gratuit pour commencer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
              <Link
                to="/signup"
                className="min-h-[48px] px-8 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#0100AD] font-bold rounded-2xl text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Créer ma carte maintenant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-10 border-t border-gray-100 bg-white text-xs text-gray-500">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 font-black text-lg tracking-tight text-gray-900">
                    <div className="w-9 h-9 rounded-xl bg-[#0100AD] flex items-center justify-center text-white">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span>Cardify</span>
                  </div>
                  <p className="max-w-sm">© {new Date().getFullYear()} Cardify. La solution idéale pour un réseau professionnel moderne, rapide et impactant.</p>
              </div>
              <div className="flex flex-col md:items-end gap-6">
                  <div className="flex items-center gap-5 text-[#0100AD]">
                    <a href={RENATO_SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Linkedin className="w-5 h-5" /></a>
                    <a href={RENATO_SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Facebook className="w-5 h-5" /></a>
                    <a href={RENATO_SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Instagram className="w-5 h-5" /></a>
                    <Link to="/contact" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><Mail className="w-5 h-5" /></Link>
                  </div>
                  <div className="flex items-center gap-6 font-medium flex-wrap">
                    <Link to="/confidentialite" className="hover:text-gray-900">Confidentialité</Link>
                    <Link to="/cgu" className="hover:text-gray-900">Conditions d'utilisation</Link>
                    <Link to="/contact" className="hover:text-gray-900">Contact</Link>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default Landing;