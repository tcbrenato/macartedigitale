import type { Profile } from '@/types/profile';

export const kenethe: Profile = {
  slug: 'kenethe',

  firstName: 'Kenethe Merveille',
  lastName: 'KODJA',
  organization: 'Officine Pharmaceutique',
  title: 'Technicienne de Vente en Pharmacie & Communication Digitale',
  tagline: "J'allie conseil client en pharmacie et stratégie digitale pour dynamiser l'image et les ventes de l'officine.",

  photo: '/merveille.png',

  phone: '+229 01 45 21 33 21',
  phoneRaw: '+2290145213321',
  whatsapp: '2290145213321',
  email: 'kenethemerveillekodja@gmail.com',

  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  countryLine: 'Bénin · Disponible à distance',

  services: [
    { icon: 'Stethoscope', short: 'Accueil & conseil client', desc: 'Accueil et conseil client sur produits (para)pharmaceutiques, vente et encaissement.' },
    { icon: 'ClipboardList', short: 'Stocks & conformité', desc: 'Gestion des stocks et rayons, application des règles réglementaires (traçabilité, hygiène).' },
    { icon: 'Palette', short: 'Création de visuels', desc: 'Conception de visuels pour réseaux sociaux, promotions et packaging produits.' },
    { icon: 'Megaphone', short: 'Community management', desc: "Gestion des réseaux sociaux de l'officine et rédaction de contenus (posts, newsletters santé/beauté)." },
    { icon: 'BarChart3', short: 'Campagnes promotionnelles', desc: "Campagnes de promotion (nouveautés, offres saisonnières) et suivi des indicateurs d'engagement et de ventes." },
    { icon: 'Users', short: 'Fidélisation digitale', desc: 'Fidélisation client via digital : SMS et programmes de fidélité en ligne.' },
  ],

  social: {
    linkedin: 'https://www.linkedin.com/in/kenethemerveillekodja/',
  },

  theme: {
    brand: '#6E1423',
    brandLight: '#9C1F35',
    brandDark: '#4A0E18',
  },
};
