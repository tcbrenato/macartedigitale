import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function ElegantTemplate({ profile, logic }: TemplateProps) {
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
    darkText,
    darkSubText,
    socialLinks,
    labels,
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div
        className={`rounded-lg overflow-hidden flex flex-col flex-1 min-h-0 border ${dark ? 'bg-[#141110] border-[var(--brand)]/40' : 'bg-[#FDFBF7] border-[var(--brand)]/25'}`}
      >
        <div className="flex justify-end px-4 pt-4 shrink-0">
          <button onClick={() => setDark(!dark)} className="w-7 h-7 flex items-center justify-center">
            {dark ? <Sun className="w-3.5 h-3.5 text-gray-400" /> : <Moon className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>

        <div className="flex flex-col items-center px-6 -mt-2 shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden p-1 border animate-scale-in" style={{ borderColor: 'var(--brand)' }}>
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
            </div>
          </div>
          <h2
            className={`text-xl tracking-wide mt-4 text-center ${darkText}`}
            style={{ fontFamily: "'Playfair Display', 'Plus Jakarta Sans', serif" }}
          >
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="w-8 h-px my-2" style={{ backgroundColor: 'var(--brand)' }} />
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase brand-text">{profile.title}</p>
          <p className={`text-[10px] leading-relaxed mt-3 max-w-[260px] text-center italic ${darkSubText}`}>{profile.tagline}</p>
        </div>

        <div className="flex-1 min-h-0 flex flex-col mt-4">
          {contactCount > 0 && (
            <div className="px-6 shrink-0">
              <div className={`grid ${contactGridClass} gap-3 pt-3 border-t`} style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                {phoneVisible && (
                  <>
                    <a href={`tel:${profile.phoneRaw}`} className="flex flex-col items-center gap-1">
                      <Phone className="w-4 h-4 brand-text" />
                      <span className={`text-[8px] font-semibold uppercase tracking-wide ${darkSubText}`}>{labels.call}</span>
                    </a>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1">
                      <MessageCircle className="w-4 h-4 brand-text" />
                      <span className={`text-[8px] font-semibold uppercase tracking-wide ${darkSubText}`}>WhatsApp</span>
                    </a>
                  </>
                )}
                {emailVisible && (
                  <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-1">
                    <Mail className="w-4 h-4 brand-text" />
                    <span className={`text-[8px] font-semibold uppercase tracking-wide ${darkSubText}`}>Email</span>
                  </a>
                )}
                {profile.url && (
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1">
                    <Globe className="w-4 h-4 brand-text" />
                    <span className={`text-[8px] font-semibold uppercase tracking-wide ${darkSubText}`}>{labels.website}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="px-6 pt-5 pb-5 shrink-0 space-y-2.5 mt-auto">
            <button
              onClick={() => setServicesOpen(true)}
              className="w-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] border-y"
              style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
            >
              {labels.whatIDo}
            </button>
            <button
              onClick={handleSave}
              className="w-full text-white py-2.5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> {labels.contactSaved}</> : <><Download className="w-3.5 h-3.5" /> {labels.saveContact}</>}
            </button>
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-4 pt-1">
                {socialLinks.map(([key, href]) => {
                  const SocialIcon = SOCIAL_ICONS[key];
                  return (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={darkSubText}>
                      <SocialIcon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center shrink-0">
        <p className={`text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <MapPin className="w-3 h-3" /> {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default ElegantTemplate;
