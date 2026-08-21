import type { Profile } from '@/types/profile';
import { renato } from './renato';
import { yvette } from './yvette';
import { taofic } from './taofic';
import { hermionne } from './hermionne';
import { jerryda } from './jerryda';
import { kenethe } from './kenethe';

export const profiles: Profile[] = [renato, yvette, taofic, hermionne, jerryda, kenethe];

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug);
}
