import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, ChevronRight, Sun, Moon } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function MinimalTemplate({ profile, logic }: TemplateProps) {
  const {
    saved,
    setServicesOpen,
    dark,
    setDark,
    phoneVisible,
    emailVisible,
    handleSave,
    darkCard,
    darkText,
    darkSubText,
    socialLinks,
  } = logic;

  const rows = [
    phoneVisible && { icon: Phone, label: 'Appeler', href: `tel:${profile.phoneRaw}` },
    phoneVisible && { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${profile.whatsapp}` },
    emailVisible && { icon: Mail, label: 'Email', href: `mailto:${profile.email}` },
    profile.url && { icon: Globe, label: 'Site web', href: profile.url },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0 border ${dark ? 'border-[#1e2148]' : 'border-gray-200'} ${darkCard}`}>
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => setDark(!dark)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}
          >
            {dark ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        <div className="text-center px-6 pb-4 shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-1 ring-gray-200 animate-scale-in">
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <h2 className={`text-xl font-light tracking-tight mt-4 ${darkText}`}>
            {profile.firstName} <span className="font-bold">{profile.lastName}</span>
          </h2>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase brand-text mt-1.5">{profile.title}</p>
          <p className={`text-xs leading-relaxed mt-3 max-w-[280px] mx-auto ${darkSubText}`}>{profile.tagline}</p>
        </div>

        <div className={`mx-6 border-t ${dark ? 'border-[#1e2148]' : 'border-gray-100'}`} />

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-3 flex flex-col gap-1">
          {rows.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 py-2.5 border-b last:border-b-0 ${dark ? 'border-[#1e2148]' : 'border-gray-50'}`}
            >
              <Icon className="w-4 h-4 brand-text shrink-0" />
              <span className={`text-sm flex-1 ${darkText}`}>{label}</span>
              <ChevronRight className={`w-4 h-4 ${darkSubText}`} />
            </a>
          ))}
          <button onClick={() => setServicesOpen(true)} className="flex items-center gap-3 py-2.5 text-left">
            <span className="w-4 h-4 rounded-full border brand-text shrink-0" style={{ borderColor: 'var(--brand)' }} />
            <span className={`text-sm flex-1 underline underline-offset-4 ${darkText}`}>Ce que je fais concrètement</span>
            <ChevronRight className={`w-4 h-4 ${darkSubText}`} />
          </button>
        </div>

        <div className="px-6 pb-5 pt-2 shrink-0 flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full border py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 brand-text"
            style={{ borderColor: 'var(--brand)' }}
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Contact enregistré !</> : <><Download className="w-4 h-4" /> Enregistrer le contact</>}
          </button>
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map(([key, href]) => {
                const SocialIcon = SOCIAL_ICONS[key];
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={darkSubText}>
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-center shrink-0">
        <p className={`text-[10px] tracking-[0.2em] uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <MapPin className="w-3 h-3 inline -mt-0.5 mr-1" />
          {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default MinimalTemplate;
