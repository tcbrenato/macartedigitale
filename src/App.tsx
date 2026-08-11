import { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Download,
  MapPin,
  Code2,
  ClipboardList,
  Megaphone,
  Palette,
  Workflow,
  BarChart3,
  CheckCircle2,
  Facebook,
  Linkedin,
  Instagram,
  RotateCw,
  Sun,
  Moon,
} from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';

const PROFILE_PHOTO = '/renatotcb.png';

const BANNER =
  'https://images.pexels.com/photos/13577780/pexels-photo-13577780.jpeg?auto=compress&cs=tinysrgb&w=900&h=300&fit=crop';

const CONTACT = {
  firstName: 'Rénato',
  lastName: 'TCHOBO',
  organization: 'RÉNATQ',
  title: 'Consultant en Transformation Digitale & Développeur Full-Stack',
  phone: '+229 01 92 37 77 77',
  phoneRaw: '+2290192377777',
  whatsapp: '2290192377777',
  email: 'renatotchobo0@gmail.com',
  url: 'https://www.renatotchobo.com',
  address: 'Cotonou, Bénin',
};

const SERVICES = [
  {
    icon: Code2,
    short: 'Web & Mobile',
    desc: 'Sites, apps, billetterie, vote en ligne',
  },
  {
    icon: ClipboardList,
    short: 'Outils de gestion',
    desc: 'Proforma, facturation, suivi de dossiers',
  },
  {
    icon: Megaphone,
    short: 'Marketing digital',
    desc: 'Réseaux sociaux, contenus, campagnes',
  },
  {
    icon: Palette,
    short: 'Identité visuelle',
    desc: 'Logos, chartes, supports graphiques',
  },
  {
    icon: Workflow,
    short: 'Pilotage projets',
    desc: 'Coordination technique et éditoriale',
  },
  {
    icon: BarChart3,
    short: 'Data & formation',
    desc: 'Tableaux de bord, modules de formation',
  },
];

function App() {
  const [saved, setSaved] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);

  const handleSave = () => {
    downloadVCard({
      firstName: CONTACT.firstName,
      lastName: CONTACT.lastName,
      organization: CONTACT.organization,
      title: CONTACT.title,
      phone: CONTACT.phone,
      email: CONTACT.email,
      url: CONTACT.url,
      address: CONTACT.address,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const darkCard = dark ? 'bg-[#0f1128] border border-[#1e2148]' : 'bg-white';
  const darkText = dark ? 'text-white' : 'text-gray-900';
  const darkSubText = dark ? 'text-gray-400' : 'text-gray-500';
  const darkLabel = dark ? 'text-gray-300' : 'text-gray-900';
  const darkHint = dark ? 'text-gray-500' : 'text-gray-400';
  const darkSocial = dark ? 'bg-[#1e2148] hover:bg-[#0100AD]' : 'bg-gray-100 hover:bg-[#0100AD]';

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
        {/* ===== CARD ===== */}
        <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 ${darkCard}`}>
          {/* Banner + Profile */}
          <div className="relative shrink-0">
            <div className="h-20 sm:h-24 overflow-hidden relative">
              <img src={BANNER} alt="Bannière" className="w-full h-full object-cover" />
              <div className="absolute inset-0 brand-gradient opacity-85" />
              {/* Bienvenue pushed up */}
              <div className="absolute inset-x-0 top-1.5 flex items-center justify-center">
                <h1 className="shimmer-text text-xl sm:text-2xl font-extrabold tracking-tight animate-fade-in">
                  Bienvenue
                </h1>
              </div>
              {/* Theme toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="theme-toggle absolute top-1.5 right-2.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
              >
                {dark ? <Sun className="w-3.5 h-3.5 text-white" /> : <Moon className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
            <div className="flex justify-center -mt-9">
              <div className="relative animate-scale-in">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-[3px] ring-white shadow-md">
                  <img src={PROFILE_PHOTO} alt="Rénato TCHOBO" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0100AD] border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Name + Title + Pitch */}
          <div className="text-center px-4 pt-2 pb-1 shrink-0">
            <h2 className={`text-lg font-extrabold tracking-tight leading-tight ${darkText}`}>
              {CONTACT.firstName} {CONTACT.lastName}
            </h2>
            <p className="text-[11px] font-semibold brand-text leading-snug mt-0.5">
              {CONTACT.title}
            </p>
            <p className={`text-[10px] leading-relaxed mt-1.5 max-w-[280px] mx-auto ${darkSubText}`}>
              Je crée des plateformes web et des logiciels de travail simples à utiliser.
            </p>
          </div>

          {/* ===== SERVICES (flip cards) ===== */}
          <div className="px-3 pt-2 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
              <div className="w-0.5 h-3.5 rounded-full bg-[#0100AD]" />
              <h3 className={`text-[10px] font-bold tracking-wide uppercase ${darkLabel}`}>
                Ce que je fais concrètement
              </h3>
              <span className={`ml-auto text-[9px] flex items-center gap-0.5 ${darkHint}`}>
                <RotateCw className="w-2.5 h-2.5" /> Appuyez
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                const isFlipped = flipped === i;
                return (
                  <div
                    key={s.short}
                    className={`flip-card ${isFlipped ? 'flipped' : ''} animate-fade-in-up`}
                    style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                    onClick={() => setFlipped(isFlipped ? null : i)}
                  >
                    <div className="flip-inner">
                      {/* Front */}
                      <div className="flip-front">
                        <div className="w-8 h-8 rounded-lg bg-[#0100AD]/10 flex items-center justify-center mb-1.5">
                          <Icon className="w-4 h-4 brand-text" />
                        </div>
                        <h4 className={`text-[10px] font-bold leading-tight ${darkText}`}>
                          {s.short}
                        </h4>
                      </div>
                      {/* Back */}
                      <div className="flip-back">
                        <Icon className="w-4 h-4 text-white/80 mb-1.5" />
                        <p className="text-[9px] font-medium leading-snug px-0.5">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== CONTACT DIRECT ===== */}
          <div className="px-3 pt-2 pb-1 shrink-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-0.5 h-3.5 rounded-full bg-[#0100AD]" />
              <h3 className={`text-[10px] font-bold tracking-wide uppercase ${darkLabel}`}>
                Contact direct
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <a href={`tel:${CONTACT.phoneRaw}`} className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[#0100AD] flex items-center justify-center group-hover:bg-[#00007a]">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>Appeler</span>
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center group-hover:bg-[#1da851]">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>WhatsApp</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[#0100AD] flex items-center justify-center group-hover:bg-[#00007a]">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>Email</span>
              </a>
              <a href={CONTACT.url} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[#0100AD] flex items-center justify-center group-hover:bg-[#00007a]">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>Site web</span>
              </a>
            </div>
          </div>

          {/* ===== SAVE + SOCIAL ===== */}
          <div className="px-3 pt-2 pb-3 shrink-0">
            <button
              onClick={handleSave}
              className="save-btn w-full brand-gradient text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide shadow-md shadow-[#0100AD]/25"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</>
              ) : (
                <><Download className="w-4 h-4" /> Enregistrer le contact</>
              )}
            </button>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-3 mt-2.5">
              <a href="https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className={`social-btn w-8 h-8 rounded-full flex items-center justify-center group ${darkSocial}`}>
                <Facebook className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className={`social-btn w-8 h-8 rounded-full flex items-center justify-center group ${darkSocial}`}>
                <Linkedin className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
              </a>
              <a href="https://www.instagram.com/renato_tchobo?igsh=MXFqMGs1eTB6Zm5vdQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className={`social-btn w-8 h-8 rounded-full flex items-center justify-center group ${darkSocial}`}>
                <Instagram className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-2 text-center shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <p className={`text-[11px] font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Cotonou</p>
            <span className="text-gray-600 mx-0.5">·</span>
            <p className={`text-[11px] font-medium tracking-wide uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Bénin · Disponible à distance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
