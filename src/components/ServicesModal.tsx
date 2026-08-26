import { X } from 'lucide-react';
import { ICON_MAP } from '@/lib/icons';
import type { Profile } from '@/types/profile';
import type { BusinessCardLogic } from '@/lib/useBusinessCardLogic';

interface ServicesModalProps {
  profile: Profile;
  logic: BusinessCardLogic;
}

function ServicesModal({ profile, logic }: ServicesModalProps) {
  const { servicesOpen, setServicesOpen, darkCard, darkText, darkSubText, darkModalBorder, darkModalClose } = logic;

  if (!servicesOpen) return null;

  return (
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
  );
}

export default ServicesModal;
