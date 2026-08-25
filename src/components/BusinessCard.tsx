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
  Sparkles,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';
import { ICON_MAP } from '@/lib/icons';
import { darken } from '@/lib/color';
import type { Profile } from '@/types/profile';

interface BusinessCardProps {
  profile: Profile;
  /** True when rendered inside the dashboard's live-preview panel, not as the public page. */
  preview?: boolean;
}

const SOCIAL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
} as const;

function BusinessCard({ profile, preview = false }: BusinessCardProps) {
  const [saved, setSaved] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (preview) return;
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark, preview]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [servicesOpen]);

  useEffect(() => {
    if (preview) return;
    document.title = `${profile.firstName} ${profile.lastName} | Carte de visite digitale`;
  }, [profile.firstName, profile.lastName, preview]);

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
    '--brand': profile.themePrimary,
    '--brand-light': profile.themeSecondary,
    '--brand-dark': darken(profile.themePrimary, 0.15),
  } as CSSProperties;

  const darkCard = dark ? 'bg-[#0f1128] border border-[#1e2148]' : 'bg-white';
  const darkText = dark ? 'text-white' : 'text-gray-900';
  const darkSubText = dark ? 'text-gray-400' : 'text-gray-500';
  const darkLabel = dark ? 'text-gray-300' : 'text-gray-900';
  const darkSocial = dark ? 'bg-[#1e2148] hover:bg-[var(--brand)]' : 'bg-gray-100 hover:bg-[var(--brand)]';
  const darkModalBorder = dark ? 'border-[#1e2148]' : 'border-gray-100';
  const darkModalClose = dark ? 'bg-[#1e2148] hover:bg-[#2a2d5c]' : 'bg-gray-100 hover:bg-gray-200';

  const socialLinks = Object.entries(profile.social).filter(([, href]) => Boolean(href)) as [
    keyof typeof SOCIAL_ICONS,
    string,
  ][];

  return (
    <div className="h-full w-full flex items-center justify-center p-3 sm:p-4 overflow-hidden" style={themeStyle}>
      <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
        {/* ===== CARD ===== */}
        <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 ${darkCard}`}>
          {/* Photo */}
          <div className="relative shrink-0 w-full aspect-[4/5] max-h-[45%] overflow-hidden animate-scale-in">
            <img
              src={profile.photo}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setDark(!dark)}
              className="theme-toggle absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/40"
            >
              {dark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* Name + Title + Pitch */}
          <div className="text-center px-4 pt-3 pb-1 shrink-0">
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

          {/* ===== SERVICES + SAVE + SOCIAL ===== */}
          <div className="px-3 pt-2 pb-3 shrink-0 space-y-2">
            <button
              onClick={() => setServicesOpen(true)}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide shadow-md shadow-[var(--brand)]/25"
            >
              <Sparkles className="w-4 h-4" /> Ce que je fais concrètement
            </button>
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
              <div className="flex items-center justify-center gap-3">
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

      {/* ===== SERVICES MODAL ===== */}
      {servicesOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 animate-fade-in"
          onClick={() => setServicesOpen(false)}
        >
          <div
            className={`w-full max-w-[380px] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col animate-scale-in ${darkCard}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${darkModalBorder}`}>
              <h3 className={`text-sm font-bold ${darkText}`}>Ce que je fais concrètement</h3>
              <button
                onClick={() => setServicesOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${darkModalClose}`}
              >
                <X className={`w-4 h-4 ${darkText}`} />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {profile.services.map((s) => {
                const Icon = ICON_MAP[s.icon];
                return (
                  <div key={s.short} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 brand-text" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${darkText}`}>{s.short}</h4>
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${darkSubText}`}>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessCard;
