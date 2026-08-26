import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function SocialTemplate({ profile, logic }: TemplateProps) {
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
    darkText,
    darkSubText,
    darkLabel,
    socialLinks,
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 ${darkCard}`}>
        <div className="flex flex-col items-center pt-6 pb-2 px-4 shrink-0">
          <button
            onClick={() => setDark(!dark)}
            className={`self-end w-7 h-7 rounded-full flex items-center justify-center -mt-2 mb-1 ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}
          >
            {dark ? <Sun className="w-3.5 h-3.5 text-gray-300" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
          </button>
          <div className="w-20 h-20 rounded-full overflow-hidden ring-[3px] animate-scale-in" style={{ boxShadow: '0 0 0 3px var(--brand)' }}>
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <h2 className={`text-lg font-extrabold tracking-tight mt-3 ${darkText}`}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-[11px] font-semibold brand-text mt-0.5">{profile.title}</p>
        </div>

        {socialLinks.length > 0 && (
          <div className="px-4 pb-2 shrink-0">
            <p className={`text-[9px] font-bold uppercase tracking-widest text-center mb-2 ${darkLabel}`}>Suivez-moi</p>
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map(([key, href]) => {
                const SocialIcon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-light))' }}
                  >
                    <SocialIcon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <p className={`text-[10px] leading-relaxed px-6 text-center max-w-[280px] mx-auto shrink-0 ${darkSubText}`}>{profile.tagline}</p>

        <div className="flex-1 min-h-0 flex flex-col mt-3">
          {contactCount > 0 && (
            <div className="px-4 shrink-0">
              <div className={`grid ${contactGridClass} gap-2`}>
                {phoneVisible && (
                  <>
                    <a href={`tel:${profile.phoneRaw}`} className="contact-btn flex flex-col items-center gap-1 group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}>
                        <Phone className="w-3.5 h-3.5 brand-text" />
                      </div>
                      <span className={`text-[8px] font-semibold ${darkSubText}`}>Appeler</span>
                    </a>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}>
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      </div>
                      <span className={`text-[8px] font-semibold ${darkSubText}`}>WhatsApp</span>
                    </a>
                  </>
                )}
                {emailVisible && (
                  <a href={`mailto:${profile.email}`} className="contact-btn flex flex-col items-center gap-1 group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}>
                      <Mail className="w-3.5 h-3.5 brand-text" />
                    </div>
                    <span className={`text-[8px] font-semibold ${darkSubText}`}>Email</span>
                  </a>
                )}
                {profile.url && (
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}>
                      <Globe className="w-3.5 h-3.5 brand-text" />
                    </div>
                    <span className={`text-[8px] font-semibold ${darkSubText}`}>Site web</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="px-4 pt-3 pb-4 shrink-0 space-y-2 mt-auto">
            <button
              onClick={() => setServicesOpen(true)}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide"
            >
              <Sparkles className="w-4 h-4" /> Ce que je fais concrètement
            </button>
            <button
              onClick={handleSave}
              className="save-btn w-full brand-gradient text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide"
            >
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</> : <><Download className="w-4 h-4" /> Enregistrer le contact</>}
            </button>
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

export default SocialTemplate;
