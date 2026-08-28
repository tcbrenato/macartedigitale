import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

function CorporateTemplate({ profile, logic }: TemplateProps) {
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
    labels,
  } = logic;

  const rows = [
    phoneVisible && { icon: Phone, label: profile.phone, href: `tel:${profile.phoneRaw}` },
    phoneVisible && { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${profile.whatsapp}` },
    emailVisible && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile.url && { icon: Globe, label: profile.url.replace(/^https?:\/\//, ''), href: profile.url },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className={`overflow-hidden flex flex-col flex-1 min-h-0 border ${dark ? 'border-[#1e2148]' : 'border-gray-200'} ${darkCard}`}>
        <div className={`flex items-center gap-3 p-4 border-b-2 shrink-0`} style={{ borderColor: 'var(--brand)' }}>
          <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 animate-scale-in">
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className={`text-base font-bold leading-tight truncate ${darkText}`}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-[10px] font-semibold brand-text leading-snug mt-0.5">{profile.title}</p>
            <p className={`text-[10px] mt-0.5 truncate ${darkSubText}`}>{profile.organization}</p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`ml-auto w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${dark ? 'bg-[#1e2148]' : 'bg-gray-100'}`}
          >
            {dark ? <Sun className="w-3.5 h-3.5 text-gray-300" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
          </button>
        </div>

        <p className={`text-xs leading-relaxed px-4 pt-3 shrink-0 ${darkSubText}`}>{profile.tagline}</p>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 flex flex-col gap-0.5">
          {rows.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 py-2 border-b last:border-b-0 ${dark ? 'border-[#1e2148]' : 'border-gray-100'}`}
            >
              <Icon className="w-3.5 h-3.5 brand-text shrink-0" />
              <span className={`text-xs flex-1 truncate ${darkText}`}>{label}</span>
              <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 ${darkSubText}`} />
            </a>
          ))}
        </div>

        <div className="px-4 pb-4 pt-2 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setServicesOpen(true)}
            className={`w-full py-2.5 rounded-md text-xs font-bold border ${dark ? 'border-[#1e2148] text-white' : 'border-gray-300 text-gray-900'}`}
          >
            {labels.whatIDo}
          </button>
          <button
            onClick={handleSave}
            className="w-full text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 text-xs"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> {labels.contactSaved}</> : <><Download className="w-4 h-4" /> {labels.saveContact}</>}
          </button>
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-1">
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

      <div className="mt-2 text-center shrink-0">
        <p className={`text-[10px] font-medium tracking-widest uppercase flex items-center justify-center gap-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <MapPin className="w-3 h-3" /> {profile.city} — {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default CorporateTemplate;
