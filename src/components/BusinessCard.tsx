import { useState, useEffect, type CSSProperties } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Download,
  MapPin,
  CheckCircle2,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  RotateCw,
  Sun,
  Moon,
} from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';
import { ICON_MAP } from '@/lib/icons';
import type { Profile } from '@/types/profile';

interface BusinessCardProps {
  profile: Profile;
}

const SOCIAL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
} as const;

function BusinessCard({ profile }: BusinessCardProps) {
  const [saved, setSaved] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    document.title = `${profile.firstName} ${profile.lastName} | Carte de visite digitale`;
  }, [profile.firstName, profile.lastName]);

  const handleSave = () => {
    downloadVCard({
      firstName: profile.firstName,
      lastName: profile.lastName,
      organization: profile.organization,
      title: profile.title,
      phone: profile.phone,
      email: profile.email,
      url: profile.url,
      address: profile.address,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const themeStyle = {
    '--brand': profile.theme.brand,
    '--brand-light': profile.theme.brandLight,
    '--brand-dark': profile.theme.brandDark,
  } as CSSProperties;

  const darkCard = dark ? 'bg-[#0f1128] border border-[#1e2148]' : 'bg-white';
  const darkText = dark ? 'text-white' : 'text-gray-900';
  const darkSubText = dark ? 'text-gray-400' : 'text-gray-500';
  const darkLabel = dark ? 'text-gray-300' : 'text-gray-900';
  const darkHint = dark ? 'text-gray-500' : 'text-gray-400';
  const darkSocial = dark ? 'bg-[#1e2148] hover:bg-[var(--brand)]' : 'bg-gray-100 hover:bg-[var(--brand)]';

  const socialLinks = Object.entries(profile.social).filter(([, href]) => Boolean(href)) as [
    keyof typeof SOCIAL_ICONS,
    string,
  ][];

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-3 sm:p-4 overflow-hidden" style={themeStyle}>
      <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
        {/* ===== CARD ===== */}
        <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 ${darkCard}`}>
          {/* Banner + Profile */}
          <div className="relative shrink-0">
            <div className="h-20 sm:h-24 overflow-hidden relative">
              <img src={profile.banner} alt="Bannière" className="w-full h-full object-cover" />
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
                  <img
                    src={profile.photo}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--brand)] border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Name + Title + Pitch */}
          <div className="text-center px-4 pt-2 pb-1 shrink-0">
            <h2 className={`text-lg font-extrabold tracking-tight leading-tight ${darkText}`}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-[11px] font-semibold brand-text leading-snug mt-0.5">
              {profile.title}
            </p>
            <p className={`text-[10px] leading-relaxed mt-1.5 max-w-[280px] mx-auto ${darkSubText}`}>
              {profile.tagline}
            </p>
          </div>

          {/* ===== SERVICES (flip cards) ===== */}
          <div className="px-3 pt-2 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
              <div className="w-0.5 h-3.5 rounded-full bg-[var(--brand)]" />
              <h3 className={`text-[10px] font-bold tracking-wide uppercase ${darkLabel}`}>
                Ce que je fais concrètement
              </h3>
              <span className={`ml-auto text-[9px] flex items-center gap-0.5 ${darkHint}`}>
                <RotateCw className="w-2.5 h-2.5" /> Appuyez
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
              {profile.services.map((s, i) => {
                const Icon = ICON_MAP[s.icon];
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
                        <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center mb-1.5">
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
              <div className="w-0.5 h-3.5 rounded-full bg-[var(--brand)]" />
              <h3 className={`text-[10px] font-bold tracking-wide uppercase ${darkLabel}`}>
                Contact direct
              </h3>
            </div>
            <div className={`grid ${profile.url ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
              <a href={`tel:${profile.phoneRaw}`} className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>Appeler</span>
              </a>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center group-hover:bg-[#1da851]">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>WhatsApp</span>
              </a>
              <a href={`mailto:${profile.email}`} className="contact-btn flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[9px] font-semibold ${darkSubText}`}>Email</span>
              </a>
              {profile.url && (
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-[9px] font-semibold ${darkSubText}`}>Site web</span>
                </a>
              )}
            </div>
          </div>

          {/* ===== SAVE + SOCIAL ===== */}
          <div className="px-3 pt-2 pb-3 shrink-0">
            <button
              onClick={handleSave}
              className="save-btn w-full brand-gradient text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide shadow-md shadow-[var(--brand)]/25"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</>
              ) : (
                <><Download className="w-4 h-4" /> Enregistrer le contact</>
              )}
            </button>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-2.5">
                {socialLinks.map(([key, href]) => {
                  const SocialIcon = SOCIAL_ICONS[key];
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-btn w-8 h-8 rounded-full flex items-center justify-center group ${darkSocial}`}
                    >
                      <SocialIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-2 text-center shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <p className={`text-[11px] font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{profile.city}</p>
            <span className="text-gray-600 mx-0.5">·</span>
            <p className={`text-[11px] font-medium tracking-wide uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {profile.countryLine}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
