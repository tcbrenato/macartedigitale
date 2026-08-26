import { useBusinessCardLogic } from '@/lib/useBusinessCardLogic';
import { TEMPLATE_MAP } from '@/templates';
import ServicesModal from './ServicesModal';
import type { Profile } from '@/types/profile';

interface BusinessCardProps {
  profile: Profile;
  /** True when rendered inside the dashboard's live-preview panel, not as the public page. */
  preview?: boolean;
  /** True when the viewer is an accepted connection of the profile owner — unlocks private fields. */
  isConnection?: boolean;
}

function BusinessCard({ profile, preview = false, isConnection = false }: BusinessCardProps) {
  const logic = useBusinessCardLogic({ profile, preview, isConnection });
  const Template = TEMPLATE_MAP[profile.templateId] ?? TEMPLATE_MAP.classic;

  return (
    <div className="h-full w-full flex items-center justify-center p-3 sm:p-4 overflow-hidden" style={logic.themeStyle}>
      <Template profile={profile} logic={logic} />
      <ServicesModal profile={profile} logic={logic} />
    </div>
  );
}

export default BusinessCard;
