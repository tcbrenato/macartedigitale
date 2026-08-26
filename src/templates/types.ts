import type { Profile } from '@/types/profile';
import type { BusinessCardLogic } from '@/lib/useBusinessCardLogic';

export interface TemplateProps {
  profile: Profile;
  logic: BusinessCardLogic;
}
