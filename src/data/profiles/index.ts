import type { Profile } from '@/types/profile';
import { renato } from './renato';
import { yvette } from './yvette';
import { taofic } from './taofic';

export const profiles: Profile[] = [renato, yvette, taofic];

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug);
}
