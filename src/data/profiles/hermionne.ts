import type { Profile } from '@/types/profile';

export const hermionne: Profile = {
  slug: 'hermionne',

  firstName: 'Hermionne',
  lastName: 'ADECHI',
  organization: 'La Roche Bénin',
  title: 'Business Development Manager',
  tagline: "Je développe des partenariats stratégiques et accélère la croissance commerciale de l'entreprise.",

  photo: '/hermionne.png',

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
    brand: '#EA580C',
    brandLight: '#F97316',
    brandDark: '#9A3412',
  },
};
