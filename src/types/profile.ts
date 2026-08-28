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

/**
 * 'public' and 'link_only' behave identically today (both reachable via direct link) —
 * they only diverge once a searchable directory exists to be listed in or excluded from.
 * 'connections_only' has real effect now: it takes the card off public reach entirely
 * until a connections system exists to grant exceptions.
 */
export type ProfileVisibility = 'public' | 'link_only' | 'connections_only';

/** Language of the card's own UI chrome (buttons, "What I do" modal title, etc.) —
 * independent from the dashboard's language, which is always French. */
export type ProfileLanguage = 'fr' | 'en';

export type TemplateId =
  | 'classic'
  | 'minimal'
  | 'dark'
  | 'banner'
  | 'split'
  | 'corporate'
  | 'creative'
  | 'compact'
  | 'elegant'
  | 'social';

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
  visibility: ProfileVisibility;
  language: ProfileLanguage;
  templateId: TemplateId;
  themePrimary: string;
  themeSecondary: string;

  services: ProfileService[];
  social: ProfileSocialLinks;

  /** Set once the QR code has been generated (on first publish). */
  qrCodeUrl?: string;
}
