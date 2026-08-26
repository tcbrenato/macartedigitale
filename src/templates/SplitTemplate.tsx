import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function SplitTemplate({ profile, logic }: TemplateProps) {
  const {
    saved,
    setServicesOpen,
    dark,
    setDark,
    phoneVisible,
    emailVisible,
    handleSave,
    contactCount,
    contactGridClass,
    darkCard,
    darkSubText,
    socialLinks,
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 relative ${darkCard}`}>
        <div className="absolute top-0 inset-x-0 h-40 brand-gradient" />
        <button
          onClick={() => setDark(!dark)}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
        >
          {dark ? <Sun className="w-3.5 h-3.5 text-white" /> : <Moon className="w-3.5 h-3.5 text-white" />}
        </button>

        <div className="relative z-[1] pt-8 shrink-0 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-[5px] ring-white shadow-lg animate-scale-in">
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-white mt-3 drop-shadow-sm">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-[11px] font-semibold text-white/90 mt-0.5">{profile.title}</p>
        </div>

        <div className="relative z-[1] flex-1 min-h-0 flex flex-col mt-4">
          <p className={`text-[10px] leading-relaxed px-6 text-center max-w-[280px] mx-auto ${darkSubText}`}>{profile.tagline}</p>

          {contactCount > 0 && (
            <div className="px-4 pt-4 shrink-0">
              <div className={`grid ${contactGridClass} gap-2`}>
                {phoneVisible && (
                  <>
                    <a href={`tel:${profile.phoneRaw}`} className="contact-btn flex flex-col items-center gap-1 group">
                      <div className="w-9 h-9 rounded-full bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)]">
                        <Phone className="w-4 h-4 brand-text group-hover:text-white" />
                      </div>
                      <span className={`text-[9px] font-semibold ${darkSubText}`}>Appeler</span>
                    </a>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                      <div className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]">
                        <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white" />
                      </div>
                      <span className={`text-[9px] font-semibold ${darkSubText}`}>WhatsApp</span>
                    </a>
                  </>
                )}
                {emailVisible && (
                  <a href={`mailto:${profile.email}`} className="contact-btn flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 rounded-full bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)]">
                      <Mail className="w-4 h-4 brand-text group-hover:text-white" />
                    </div>
                    <span className={`text-[9px] font-semibold ${darkSubText}`}>Email</span>
                  </a>
                )}
                {profile.url && (
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 rounded-full bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)]">
                      <Globe className="w-4 h-4 brand-text group-hover:text-white" />
                    </div>
                    <span className={`text-[9px] font-semibold ${darkSubText}`}>Site web</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="px-4 pt-4 pb-4 shrink-0 space-y-2 mt-auto">
            <button
              onClick={() => setServicesOpen(true)}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 text-xs tracking-wide"
            >
              <Sparkles className="w-4 h-4" /> Ce que je fais concrètement
            </button>
            <button
              onClick={handleSave}
              className="w-full border-2 py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold tracking-wide brand-text"
              style={{ borderColor: 'var(--brand)' }}
            >
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</> : <><Download className="w-4 h-4" /> Enregistrer le contact</>}
            </button>
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map(([key, href]) => {
                  const SocialIcon = SOCIAL_ICONS[key];
                  return (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--brand)]/10 hover:bg-[var(--brand)] group">
                      <SocialIcon className="w-3.5 h-3.5 brand-text group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center shrink-0">
        <p className={`text-[11px] font-medium tracking-wide uppercase flex items-center justify-center gap-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <MapPin className="w-3 h-3" /> {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default SplitTemplate;
