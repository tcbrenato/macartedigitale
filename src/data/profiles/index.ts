import type { Profile } from '@/types/profile';
import { renato } from './renato';
import { yvette } from './yvette';
import { taofic } from './taofic';
import { hermionne } from './hermionne';
import { jerryda } from './jerryda';

export const profiles: Profile[] = [renato, yvette, taofic, hermionne, jerryda];

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug);
}
