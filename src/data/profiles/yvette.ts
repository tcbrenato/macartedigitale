import type { Profile } from '@/types/profile';
import { initialsAvatar } from '@/lib/avatar';

export const yvette: Profile = {
  slug: 'yvette',

  firstName: 'Yvette',
  lastName: 'FANOU',
  organization: 'CRF PERFECTION',
  title: 'Directrice Commerciale & Marketing',
  tagline: 'Je pilote la stratégie commerciale et marketing pour développer notre portefeuille clients.',

  photo: initialsAvatar('YF', '#0E7490'),
  banner:
    'https://images.pexels.com/photos/13577780/pexels-photo-13577780.jpeg?auto=compress&cs=tinysrgb&w=900&h=300&fit=crop',

  phone: '+229 01 61 74 42 42',
  phoneRaw: '+2290161744242',
  whatsapp: '2290161744242',
  email: 'yvettefanou76@gmail.com',

  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  countryLine: 'Bénin · Disponible à distance',

  services: [
    { icon: 'BarChart3', short: 'Stratégie commerciale', desc: "Définition des objectifs de vente et pilotage de la performance commerciale." },
    { icon: 'Megaphone', short: 'Marketing & Communication', desc: "Conception des campagnes marketing et gestion de l'image de marque." },
    { icon: 'Users', short: 'Relation clientèle', desc: 'Développement et fidélisation du portefeuille clients.' },
    { icon: 'Briefcase', short: 'Développement des affaires', desc: 'Prospection, partenariats et opportunités de croissance.' },
    { icon: 'ClipboardList', short: 'Pilotage des ventes', desc: 'Suivi des dossiers commerciaux, devis et contrats clients.' },
    { icon: 'Workflow', short: 'Coordination des campagnes', desc: 'Planification et coordination des actions commerciales et marketing.' },
  ],

  social: {},

  theme: {
    brand: '#0E7490',
    brandLight: '#22A6C4',
    brandDark: '#0B5563',
  },
};
