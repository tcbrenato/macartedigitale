import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function ClassicTemplate({ profile, logic }: TemplateProps) {
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
    darkSocial,
    socialLinks,
    labels,
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`rounded-3xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 ${darkCard}`}>
        {/* Photo */}
        <div className="relative shrink-0 w-full aspect-[4/5] max-h-[45%] overflow-hidden animate-scale-in">
          <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
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
          <p className="text-[11px] font-semibold brand-text leading-snug mt-0.5">{profile.title}</p>
          <p className={`text-[10px] leading-relaxed mt-1.5 max-w-[280px] mx-auto ${darkSubText}`}>{profile.tagline}</p>
        </div>

        {/* Contact direct */}
        {contactCount > 0 && (
          <div className="px-3 pt-2 pb-1 shrink-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-0.5 h-3.5 rounded-full bg-[var(--brand)]" />
              <h3 className={`text-[10px] font-bold tracking-wide uppercase ${darkLabel}`}>{labels.contactDirect}</h3>
            </div>
            <div className={`grid ${contactGridClass} gap-2`}>
              {phoneVisible && (
                <>
                  <a href={`tel:${profile.phoneRaw}`} className="contact-btn flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-semibold ${darkSubText}`}>{labels.call}</span>
                  </a>
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center group-hover:bg-[#1da851]">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-semibold ${darkSubText}`}>WhatsApp</span>
                  </a>
                </>
              )}
              {emailVisible && (
                <a href={`mailto:${profile.email}`} className="contact-btn flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-[9px] font-semibold ${darkSubText}`}>Email</span>
                </a>
              )}
              {profile.url && (
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="contact-btn flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand-dark)]">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-[9px] font-semibold ${darkSubText}`}>{labels.website}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Services + Save + Social */}
        <div className="px-3 pt-2 pb-3 shrink-0 space-y-2">
          <button
            onClick={() => setServicesOpen(true)}
            className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide shadow-md shadow-[var(--brand)]/25"
          >
            <Sparkles className="w-4 h-4" /> {labels.whatIDo}
          </button>
          <button
            onClick={handleSave}
            className="save-btn w-full brand-gradient text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide shadow-md shadow-[var(--brand)]/25"
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> {labels.contactSaved}</>
            ) : (
              <><Download className="w-4 h-4" /> {labels.saveContact}</>
            )}
          </button>

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

      {/* Footer */}
      <div className="mt-2 px-2 text-center shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-wrap items-center justify-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <p className={`text-[11px] font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{profile.city}</p>
          <span className="text-gray-600 mx-0.5">·</span>
          <p className={`text-[11px] font-medium tracking-wide uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {profile.countryLine}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClassicTemplate;
