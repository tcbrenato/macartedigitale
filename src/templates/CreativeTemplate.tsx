import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function CreativeTemplate({ profile, logic }: TemplateProps) {
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
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div
        className={`relative overflow-hidden rounded-[2.5rem] flex flex-col flex-1 min-h-0 ${dark ? 'bg-[#14101f]' : 'bg-white'}`}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: 'var(--brand)' }} />
        <div className="absolute top-24 -left-12 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: 'var(--brand-light)' }} />

        <button
          onClick={() => setDark(!dark)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-black/5'}`}
        >
          {dark ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </button>

        <div className="relative z-[1] flex flex-col items-center pt-7 shrink-0">
          <div
            className="w-28 h-28 overflow-hidden animate-scale-in"
            style={{ borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%', boxShadow: '0 8px 24px -6px var(--brand)' }}
          >
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <h2 className={`text-xl font-black tracking-tight mt-3 ${darkText}`}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p
            className="text-[11px] font-bold mt-1 px-3 py-0.5 rounded-full text-white"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            {profile.title}
          </p>
          <p className={`text-[10px] leading-relaxed mt-2 max-w-[260px] text-center ${darkSubText}`}>{profile.tagline}</p>
        </div>

        <div className="relative z-[1] flex-1 min-h-0 flex flex-col mt-3">
          {contactCount > 0 && (
            <div className="px-5 shrink-0">
              <div className={`grid ${contactGridClass} gap-2.5`}>
                {phoneVisible && (
                  <>
                    <a href={`tel:${profile.phoneRaw}`} className="flex flex-col items-center gap-1 group">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:-rotate-6" style={{ backgroundColor: 'var(--brand)' }}>
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-[9px] font-bold ${darkSubText}`}>Appeler</span>
                    </a>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                      <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center transition-transform group-hover:rotate-6">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-[9px] font-bold ${darkSubText}`}>WhatsApp</span>
                    </a>
                  </>
                )}
                {emailVisible && (
                  <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:-rotate-6" style={{ backgroundColor: 'var(--brand-light)' }}>
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-bold ${darkSubText}`}>Email</span>
                  </a>
                )}
                {profile.url && (
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6" style={{ backgroundColor: 'var(--brand)' }}>
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-bold ${darkSubText}`}>Site web</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="px-5 pt-4 pb-5 shrink-0 space-y-2 mt-auto">
            <button
              onClick={() => setServicesOpen(true)}
              className="w-full text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wide"
              style={{ background: 'linear-gradient(120deg, var(--brand), var(--brand-light))' }}
            >
              <Sparkles className="w-4 h-4" /> Ce que je fais concrètement
            </button>
            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</> : <><Download className="w-4 h-4" /> Enregistrer le contact</>}
            </button>
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map(([key, href]) => {
                  const SocialIcon = SOCIAL_ICONS[key];
                  return (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <SocialIcon className={`w-3.5 h-3.5 ${darkSubText}`} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center shrink-0">
        <p className={`text-[11px] font-bold flex items-center justify-center gap-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          <MapPin className="w-3 h-3" /> {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default CreativeTemplate;
