import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sun, Moon } from 'lucide-react';
import { ICON_MAP } from '@/lib/icons';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function CompactTemplate({ profile, logic }: TemplateProps) {
  const {
    saved,
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
    darkSocial,
    socialLinks,
  } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`rounded-2xl overflow-hidden card-shadow flex flex-col flex-1 min-h-0 p-3 gap-2 ${darkCard}`}>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 animate-scale-in">
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`text-sm font-extrabold leading-tight truncate ${darkText}`}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-[10px] font-semibold brand-text truncate">{profile.title}</p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}
          >
            {dark ? <Sun className="w-3.5 h-3.5 text-gray-300" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
          </button>
        </div>

        <p className={`text-[10px] leading-snug shrink-0 ${darkSubText}`}>{profile.tagline}</p>

        {contactCount > 0 && (
          <div className={`grid ${contactGridClass} gap-1.5 shrink-0`}>
            {phoneVisible && (
              <>
                <a href={`tel:${profile.phoneRaw}`} className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-[var(--brand)]/10">
                  <Phone className="w-3.5 h-3.5 brand-text" />
                  <span className={`text-[8px] font-semibold ${darkSubText}`}>Appeler</span>
                </a>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-[#25D366]/10">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span className={`text-[8px] font-semibold ${darkSubText}`}>WhatsApp</span>
                </a>
              </>
            )}
            {emailVisible && (
              <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-[var(--brand)]/10">
                <Mail className="w-3.5 h-3.5 brand-text" />
                <span className={`text-[8px] font-semibold ${darkSubText}`}>Email</span>
              </a>
            )}
            {profile.url && (
              <a href={profile.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-[var(--brand)]/10">
                <Globe className="w-3.5 h-3.5 brand-text" />
                <span className={`text-[8px] font-semibold ${darkSubText}`}>Site web</span>
              </a>
            )}
          </div>
        )}

        <div className="shrink-0">
          <p className={`text-[9px] font-bold uppercase tracking-wide mb-1 ${darkSubText}`}>Ce que je fais</p>
          <div className="grid grid-cols-3 gap-1.5">
            {profile.services.slice(0, 6).map((s) => {
              const Icon = ICON_MAP[s.icon];
              return (
                <div key={s.short} className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg ${dark ? 'bg-[#1e2148]' : 'bg-gray-50'}`}>
                  <Icon className="w-3.5 h-3.5 brand-text" />
                  <span className={`text-[7px] font-semibold text-center leading-tight px-0.5 ${darkText}`}>{s.short}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="save-btn w-full brand-gradient text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-[10px] tracking-wide mt-auto shrink-0"
        >
          {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Contact enregistré !</> : <><Download className="w-3.5 h-3.5" /> Enregistrer le contact</>}
        </button>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-2 shrink-0">
            {socialLinks.map(([key, href]) => {
              const SocialIcon = SOCIAL_ICONS[key];
              return (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={`w-6 h-6 rounded-full flex items-center justify-center group ${darkSocial}`}>
                  <SocialIcon className="w-3 h-3 text-gray-500 group-hover:text-white" />
                </a>
              );
            })}
          </div>
        )}

        <p className={`text-[9px] text-center shrink-0 flex items-center justify-center gap-1 ${darkSubText}`}>
          <MapPin className="w-2.5 h-2.5" /> {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default CompactTemplate;
