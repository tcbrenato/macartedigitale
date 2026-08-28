import { useState, useEffect, type CSSProperties } from 'react';
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';
import { darken } from '@/lib/color';
import type { Profile } from '@/types/profile';

export const SOCIAL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
} as const;

/** The card's own UI chrome (button labels, modal title) — independent from the
 * dashboard, which stays French regardless. Keyed by `profile.language`. */
const LABELS = {
  fr: {
    call: 'Appeler',
    website: 'Site web',
    contactDirect: 'Contact direct',
    whatIDo: 'Ce que je fais concrètement',
    whatIDoShort: 'Ce que je fais',
    saveContact: 'Enregistrer le contact',
    contactSaved: 'Contact enregistré !',
    followMe: 'Suivez-moi',
  },
  en: {
    call: 'Call',
    website: 'Website',
    contactDirect: 'Contact',
    whatIDo: 'What I do',
    whatIDoShort: 'What I do',
    saveContact: 'Save contact',
    contactSaved: 'Contact saved!',
    followMe: 'Follow me',
  },
} as const;

export interface BusinessCardLogicOptions {
  profile: Profile;
  preview?: boolean;
  isConnection?: boolean;
}

/**
 * Everything a card template needs *except* its own markup: theming, dark
 * mode, the services modal, field visibility, and the vCard download. Every
 * template consumes this same hook so behavior stays identical while layout
 * varies freely.
 */
export function useBusinessCardLogic({ profile, preview = false, isConnection = false }: BusinessCardLogicOptions) {
  const [saved, setSaved] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (preview) return;
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark, preview]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [servicesOpen]);

  useEffect(() => {
    if (preview) return;
    document.title = `${profile.firstName} ${profile.lastName} | Carte de visite digitale`;
  }, [profile.firstName, profile.lastName, preview]);

  const phoneVisible = profile.phonePublic || isConnection;
  const emailVisible = profile.emailPublic || isConnection;
  const addressVisible = profile.addressPublic || isConnection;

  const handleSave = () => {
    downloadVCard({
      firstName: profile.firstName,
      lastName: profile.lastName,
      organization: profile.organization,
      title: profile.title,
      phone: phoneVisible ? profile.phone : undefined,
      email: emailVisible ? profile.email : undefined,
      url: profile.url,
      address: addressVisible ? profile.address : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const contactCount = (phoneVisible ? 2 : 0) + (emailVisible ? 1 : 0) + (profile.url ? 1 : 0);
  const contactGridClass =
    contactCount >= 4 ? 'grid-cols-4' : contactCount === 3 ? 'grid-cols-3' : contactCount === 2 ? 'grid-cols-2' : 'grid-cols-1';

  const themeStyle = {
    '--brand': profile.themePrimary,
    '--brand-light': profile.themeSecondary,
    '--brand-dark': darken(profile.themePrimary, 0.15),
  } as CSSProperties;

  const darkCard = dark ? 'bg-[#0f1128] border border-[#1e2148]' : 'bg-white';
  const darkText = dark ? 'text-white' : 'text-gray-900';
  const darkSubText = dark ? 'text-gray-400' : 'text-gray-500';
  const darkLabel = dark ? 'text-gray-300' : 'text-gray-900';
  const darkSocial = dark ? 'bg-[#1e2148] hover:bg-[var(--brand)]' : 'bg-gray-100 hover:bg-[var(--brand)]';
  const darkModalBorder = dark ? 'border-[#1e2148]' : 'border-gray-100';
  const darkModalClose = dark ? 'bg-[#1e2148] hover:bg-[#2a2d5c]' : 'bg-gray-100 hover:bg-gray-200';

  const socialLinks = Object.entries(profile.social).filter(([, href]) => Boolean(href)) as [
    keyof typeof SOCIAL_ICONS,
    string,
  ][];

  const labels = LABELS[profile.language];

  return {
    saved,
    labels,
    servicesOpen,
    setServicesOpen,
    dark,
    setDark,
    phoneVisible,
    emailVisible,
    addressVisible,
    handleSave,
    contactCount,
    contactGridClass,
    themeStyle,
    darkCard,
    darkText,
    darkSubText,
    darkLabel,
    darkSocial,
    darkModalBorder,
    darkModalClose,
    socialLinks,
  };
}

export type BusinessCardLogic = ReturnType<typeof useBusinessCardLogic>;
