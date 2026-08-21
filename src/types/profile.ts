import type { IconName } from '@/lib/icons';

export interface ProfileService {
  icon: IconName;
  short: string;
  desc: string;
}

export interface ProfileSocialLinks {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface ProfileTheme {
  brand: string;
  brandLight: string;
  brandDark: string;
}

export interface Profile {
  /** Used in the URL: /:slug */
  slug: string;

  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  tagline: string;

  photo: string;
  banner: string;

  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  /** Personal or company website. Omit to hide the "Site web" button. */
  url?: string;

  address: string;
  city: string;
  countryLine: string;

  services: ProfileService[];
  social: ProfileSocialLinks;
  theme: ProfileTheme;
}
