import { Phone, MessageCircle, Mail, Globe, Download, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { SOCIAL_ICONS } from '@/lib/useBusinessCardLogic';
import type { TemplateProps } from './types';

/** Always dark, regardless of the shared light/dark toggle — dark IS this template's identity. */
function DarkTemplate({ profile, logic }: TemplateProps) {
  const { saved, setServicesOpen, phoneVisible, emailVisible, handleSave, contactCount, contactGridClass, socialLinks, labels } = logic;

  return (
    <div className="w-full max-w-[400px] h-full max-h-[820px] flex flex-col animate-fade-in-up">
      <div className="rounded-3xl overflow-hidden flex flex-col flex-1 min-h-0 bg-[#0a0a10] border border-[var(--brand)]/30 shadow-[0_0_40px_-10px_var(--brand)]">
        <div className="flex flex-col items-center pt-6 pb-3 px-4 shrink-0">
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden animate-scale-in"
            style={{ boxShadow: '0 0 0 2px var(--brand), 0 0 24px -4px var(--brand)' }}
          >
            <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-extrabold text-white mt-3">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--brand-light)' }}>
            {profile.title}
          </p>
          <p className="text-[10px] leading-relaxed mt-2 max-w-[280px] text-center text-gray-400">{profile.tagline}</p>
        </div>

        {contactCount > 0 && (
          <div className="px-4 pt-2 pb-1 shrink-0">
            <div className={`grid ${contactGridClass} gap-2`}>
              {phoneVisible && (
                <>
                  <a
                    href={`tel:${profile.phoneRaw}`}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#14141e] border border-[var(--brand)]/30"
                  >
                    <Phone className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
                    <span className="text-[9px] font-semibold text-gray-400">{labels.call}</span>
                  </a>
                  <a
                    href={`https://wa.me/${profile.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#14141e] border border-[#25D366]/40"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span className="text-[9px] font-semibold text-gray-400">WhatsApp</span>
                  </a>
                </>
              )}
              {emailVisible && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#14141e] border border-[var(--brand)]/30"
                >
                  <Mail className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
                  <span className="text-[9px] font-semibold text-gray-400">Email</span>
                </a>
              )}
              {profile.url && (
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#14141e] border border-[var(--brand)]/30"
                >
                  <Globe className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
                  <span className="text-[9px] font-semibold text-gray-400">{labels.website}</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="px-4 pt-2 pb-4 shrink-0 space-y-2 flex-1 flex flex-col justify-end">
          <button
            onClick={() => setServicesOpen(true)}
            className="w-full text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wide"
            style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-light))', boxShadow: '0 0 20px -4px var(--brand)' }}
          >
            <Sparkles className="w-4 h-4" /> {labels.whatIDo}
          </button>
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-wide bg-[#14141e] border border-[var(--brand)]/40 text-white"
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> {labels.contactSaved}</> : <><Download className="w-4 h-4" /> {labels.saveContact}</>}
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
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#14141e] border border-[var(--brand)]/30 hover:border-[var(--brand)]"
                  >
                    <SocialIcon className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-center shrink-0">
        <p className="text-[11px] font-medium tracking-wide uppercase text-gray-500 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" /> {profile.city} · {profile.countryLine}
        </p>
      </div>
    </div>
  );
}

export default DarkTemplate;
