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

export type ProfileStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  userId: string | null;

  /** Used in the URL: /:slug */
  slug: string;

  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  tagline: string;

  photo: string;

  phone: string;
  phoneRaw: string;
  whatsapp: string;
  /** Shows/hides the "Appeler" and "WhatsApp" buttons on the public card. */
  phonePublic: boolean;
  email: string;
  /** Shows/hides the "Email" button on the public card. */
  emailPublic: boolean;
  /** Personal or company website. Omit to hide the "Site web" button. */
  url?: string;

  address: string;
  /** Whether the address is included in the downloaded vCard. */
  addressPublic: boolean;
  city: string;
  countryLine: string;

  status: ProfileStatus;
  /** Card design/layout. Only 'classic' exists today; more coming later. */
  templateId: string;
  themePrimary: string;
  themeSecondary: string;

  services: ProfileService[];
  social: ProfileSocialLinks;

  /** Set once the QR code has been generated (on first publish). */
  qrCodeUrl?: string;
}
