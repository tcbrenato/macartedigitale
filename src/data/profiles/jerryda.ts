import type { Profile } from '@/types/profile';

export const jerryda: Profile = {
  slug: 'jerryda',

  firstName: 'Jerryda',
  lastName: 'KOUASSI VILLELA',
  organization: 'Chronopost (via Teleperformance)',
  title: 'Gestionnaire de Comptes Internationaux & Analyste de Données Digitales',
  tagline: 'Je pilote des comptes clients internationaux et transforme la donnée web en décisions business.',

  photo: '/jerryda.png',

  phone: '+228 93 92 46 19',
  phoneRaw: '+22893924619',
  whatsapp: '22893924619',
  email: 'jerrydakouassi@gmail.com',

  address: 'Lomé, Togo',
  city: 'Lomé',
  countryLine: 'Togo · Disponible à distance',

  services: [
    { icon: 'Users', short: 'Relation client internationale', desc: "Interlocuteur privilégié pour un portefeuille de clients internationaux, suivi régulier et compréhension des besoins selon les zones et cultures d'affaires." },
    { icon: 'Workflow', short: 'Coordination interculturelle', desc: 'Communication adaptée aux fuseaux horaires et cultures, coordination des livrables et respect des délais, budgets et SLA.' },
    { icon: 'Briefcase', short: 'Développement de comptes', desc: 'Upsell/cross-sell, renouvellement et négociation des contrats, suivi via CRM (Salesforce, HubSpot) et reporting à la direction.' },
    { icon: 'Code2', short: 'Collecte & tracking data', desc: 'Mise en place d\'outils de tracking (Google Analytics, GTM, Matomo) et structuration des données web, apps et campagnes.' },
    { icon: 'BarChart3', short: 'Analyse & reporting data', desc: 'Suivi des KPIs (trafic, conversion, CAC, ROAS), création de tableaux de bord (Looker Studio, Power BI) et insights actionnables.' },
    { icon: 'Lightbulb', short: 'Optimisation data-driven', desc: 'Tests A/B, recommandations basées sur la donnée, veille outils (GA4, IA) et conformité RGPD.' },
  ],

  social: {
    linkedin: 'https://www.linkedin.com/in/jerrydakouassi/',
  },

  theme: {
    brand: '#BE123C',
    brandLight: '#E11D48',
    brandDark: '#881337',
  },
};
