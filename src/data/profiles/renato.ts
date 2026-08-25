import type { Profile } from '@/types/profile';

export const renato: Profile = {
  slug: 'renato',

  firstName: 'Rénato',
  lastName: 'TCHOBO',
  organization: 'RÉNATQ',
  title: 'Consultant en Transformation Digitale & Développeur Full-Stack',
  tagline: 'Je crée des plateformes web et des logiciels de travail simples à utiliser.',

  photo: '/renatotcb.png',

  phone: '+229 01 92 37 77 77',
  phoneRaw: '+2290192377777',
  whatsapp: '2290192377777',
  email: 'renatotchobo0@gmail.com',
  url: 'https://www.renatotchobo.com',

  address: 'Cotonou, Bénin',
  city: 'Cotonou',
  countryLine: 'Bénin · Disponible à distance',

  services: [
    { icon: 'Code2', short: 'Web & Mobile', desc: 'Sites, apps, billetterie, vote en ligne' },
    { icon: 'ClipboardList', short: 'Outils de gestion', desc: 'Proforma, facturation, suivi de dossiers' },
    { icon: 'Megaphone', short: 'Marketing digital', desc: 'Réseaux sociaux, contenus, campagnes' },
    { icon: 'Palette', short: 'Identité visuelle', desc: 'Logos, chartes, supports graphiques' },
    { icon: 'Workflow', short: 'Pilotage projets', desc: 'Coordination technique et éditoriale' },
    { icon: 'BarChart3', short: 'Data & formation', desc: 'Tableaux de bord, modules de formation' },
  ],

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL',
    linkedin: 'https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL',
    instagram: 'https://www.instagram.com/renato_tchobo?igsh=MXFqMGs1eTB6Zm5vdQ%3D%3D&utm_source=qr',
  },

  theme: {
    brand: '#0100AD',
    brandLight: '#2d2cb8',
    brandDark: '#00007a',
  },
};
