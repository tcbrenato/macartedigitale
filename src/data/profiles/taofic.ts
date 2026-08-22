import type { Profile } from '@/types/profile';

export const taofic: Profile = {
  slug: 'taofic',

  firstName: 'Taofic',
  lastName: 'BOUKARI',
  organization: 'CRF PERFECTION',
  title: 'Assistant de Direction & Consultant Junior en Ingénierie de la Formation et Communication Institutionnelle',
  tagline:
    "Enseignant de français — j'accompagne le Directeur Général dans la gestion administrative, la coordination et la communication du Cabinet.",

  photo: '/taofic.png',
  banner:
    'https://images.pexels.com/photos/13577780/pexels-photo-13577780.jpeg?auto=compress&cs=tinysrgb&w=900&h=300&fit=crop',

  phone: '+229 01 91 09 84 68',
  phoneRaw: '+2290191098468',
  whatsapp: '2290191098468',
  email: 'boukaritaofic@gmail.com',

  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  countryLine: 'Bénin · Disponible à distance',

  services: [
    { icon: 'Briefcase', short: 'Appui à la Direction', desc: 'Assistance au Directeur Général, préparation des dossiers, courriers, notes et documents de travail.' },
    { icon: 'Workflow', short: 'Coordination & Suivi', desc: "Suivi des activités, des échéances, des correspondances et des actions liées aux projets du Cabinet." },
    { icon: 'Megaphone', short: 'Communication institutionnelle', desc: 'Rédaction de courriers, comptes rendus, notes institutionnelles et appui aux relations avec les partenaires.' },
    { icon: 'Users', short: 'Événementiel & Protocole', desc: "Appui à l'organisation des événements, préparation des déroulés, coordination et animation des activités." },
    { icon: 'PenTool', short: 'Rédaction professionnelle', desc: 'Conception et rédaction de rapports, comptes rendus, documents administratifs et supports de communication.' },
    { icon: 'ClipboardList', short: 'Appui-conseil & Projets', desc: "Participation aux missions de consultation, à la préparation des projets et aux activités d'ingénierie de formation et de communication." },
  ],

  social: {
    linkedin: 'https://www.linkedin.com/in/boukari-taofic-0559352ba',
  },

  theme: {
    brand: '#B45309',
    brandLight: '#D97706',
    brandDark: '#78350F',
  },
};
