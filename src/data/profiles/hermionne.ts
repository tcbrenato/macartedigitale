import type { Profile } from '@/types/profile';
import { initialsAvatar } from '@/lib/avatar';

export const hermionne: Profile = {
  slug: 'hermionne',

  firstName: 'Hermionne',
  lastName: 'ADECHI',
  organization: 'La Roche Bénin',
  title: 'Business Development Manager',
  tagline: "Je développe des partenariats stratégiques et accélère la croissance commerciale de l'entreprise.",

  photo: initialsAvatar('HA', '#6D28D9'),
  banner:
    'https://images.pexels.com/photos/13577780/pexels-photo-13577780.jpeg?auto=compress&cs=tinysrgb&w=900&h=300&fit=crop',

  phone: '+229 01 96 21 71 12',
  phoneRaw: '+2290196217112',
  whatsapp: '2290196217112',
  email: 'adechih@gmail.com',

  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  countryLine: 'Bénin · Disponible à distance',

  services: [
    { icon: 'Briefcase', short: 'Prospection commerciale', desc: 'Identification de nouveaux marchés et opportunités, développement d\'un pipeline de prospects qualifiés.' },
    { icon: 'BarChart3', short: 'Stratégie & analyse de marché', desc: 'Analyse concurrentielle, définition des stratégies de croissance et business plans pour nouvelles initiatives.' },
    { icon: 'ClipboardList', short: 'Négociation & closing', desc: 'Préparation des offres commerciales, négociation des contrats et conclusion des accords stratégiques.' },
    { icon: 'Users', short: 'Partenariats & relations clients', desc: 'Relations durables avec les clients clés et suivi post-vente pour fidéliser et générer de nouvelles opportunités.' },
    { icon: 'Workflow', short: 'Pilotage de projets', desc: 'Coordination des équipes internes, suivi des KPIs commerciaux et reporting à la direction.' },
    { icon: 'Lightbulb', short: 'Veille & innovation', desc: 'Surveillance du marché, de la réglementation et proposition de nouvelles offres adaptées aux besoins émergents.' },
  ],

  social: {},

  theme: {
    brand: '#6D28D9',
    brandLight: '#8B5CF6',
    brandDark: '#4C1D95',
  },
};
