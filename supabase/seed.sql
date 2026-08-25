-- One-time seed: migrates the 6 existing static cards into the profiles table.
-- Run after 0001_init.sql, in the Supabase SQL Editor.
-- user_id stays NULL: each person auto-claims their card the moment they sign up
-- with the email listed below (see claim_profile_on_signup() trigger).

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'renato', $q$Rénato$q$, $q$TCHOBO$q$, $q$RÉNATQ$q$,
  $q$Consultant en Transformation Digitale & Développeur Full-Stack$q$,
  $q$Je crée des plateformes web et des logiciels de travail simples à utiliser.$q$,
  '/renatotcb.png',
  '+229 01 92 37 77 77', '+2290192377777', '2290192377777', 'renatotchobo0@gmail.com',
  'https://www.renatotchobo.com', $q$Cotonou, Bénin$q$, 'Cotonou', $q$Bénin · Disponible à distance$q$,
  'published', '#0100AD', '#2d2cb8',
  $q$[
    {"icon":"Code2","short":"Web & Mobile","desc":"Sites, apps, billetterie, vote en ligne"},
    {"icon":"ClipboardList","short":"Outils de gestion","desc":"Proforma, facturation, suivi de dossiers"},
    {"icon":"Megaphone","short":"Marketing digital","desc":"Réseaux sociaux, contenus, campagnes"},
    {"icon":"Palette","short":"Identité visuelle","desc":"Logos, chartes, supports graphiques"},
    {"icon":"Workflow","short":"Pilotage projets","desc":"Coordination technique et éditoriale"},
    {"icon":"BarChart3","short":"Data & formation","desc":"Tableaux de bord, modules de formation"}
  ]$q$::jsonb,
  $q${
    "facebook":"https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL",
    "linkedin":"https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL",
    "instagram":"https://www.instagram.com/renato_tchobo?igsh=MXFqMGs1eTB6Zm5vdQ%3D%3D&utm_source=qr"
  }$q$::jsonb
)
on conflict (slug) do nothing;

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'yvette', $q$Yvette$q$, $q$FANOU$q$, $q$CRF PERFECTION$q$,
  $q$Directrice Commerciale & Marketing$q$,
  $q$Je pilote la stratégie commerciale et marketing pour développer notre portefeuille clients.$q$,
  '/yvette.png',
  '+229 01 61 74 42 42', '+2290161744242', '2290161744242', 'yvettefanou76@gmail.com',
  null, $q$Cotonou, Bénin$q$, 'Cotonou', $q$Bénin · Disponible à distance$q$,
  'published', '#0E7490', '#22A6C4',
  $q$[
    {"icon":"BarChart3","short":"Stratégie commerciale","desc":"Définition des objectifs de vente et pilotage de la performance commerciale."},
    {"icon":"Megaphone","short":"Marketing & Communication","desc":"Conception des campagnes marketing et gestion de l'image de marque."},
    {"icon":"Users","short":"Relation clientèle","desc":"Développement et fidélisation du portefeuille clients."},
    {"icon":"Briefcase","short":"Développement des affaires","desc":"Prospection, partenariats et opportunités de croissance."},
    {"icon":"ClipboardList","short":"Pilotage des ventes","desc":"Suivi des dossiers commerciaux, devis et contrats clients."},
    {"icon":"Workflow","short":"Coordination des campagnes","desc":"Planification et coordination des actions commerciales et marketing."}
  ]$q$::jsonb,
  '{}'::jsonb
)
on conflict (slug) do nothing;

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'taofic', $q$Taofic$q$, $q$BOUKARI$q$, $q$CRF PERFECTION$q$,
  $q$Assistant de Direction & Consultant Junior en Ingénierie de la Formation et Communication Institutionnelle$q$,
  $q$Enseignant de français — j'accompagne le Directeur Général dans la gestion administrative, la coordination et la communication du Cabinet.$q$,
  '/taofic.png',
  '+229 01 91 09 84 68', '+2290191098468', '2290191098468', 'boukaritaofic@gmail.com',
  null, $q$Cotonou, Bénin$q$, 'Cotonou', $q$Bénin · Disponible à distance$q$,
  'published', '#B45309', '#D97706',
  $q$[
    {"icon":"Briefcase","short":"Appui à la Direction","desc":"Assistance au Directeur Général, préparation des dossiers, courriers, notes et documents de travail."},
    {"icon":"Workflow","short":"Coordination & Suivi","desc":"Suivi des activités, des échéances, des correspondances et des actions liées aux projets du Cabinet."},
    {"icon":"Megaphone","short":"Communication institutionnelle","desc":"Rédaction de courriers, comptes rendus, notes institutionnelles et appui aux relations avec les partenaires."},
    {"icon":"Users","short":"Événementiel & Protocole","desc":"Appui à l'organisation des événements, préparation des déroulés, coordination et animation des activités."},
    {"icon":"PenTool","short":"Rédaction professionnelle","desc":"Conception et rédaction de rapports, comptes rendus, documents administratifs et supports de communication."},
    {"icon":"ClipboardList","short":"Appui-conseil & Projets","desc":"Participation aux missions de consultation, à la préparation des projets et aux activités d'ingénierie de formation et de communication."}
  ]$q$::jsonb,
  $q${"linkedin":"https://www.linkedin.com/in/boukari-taofic-0559352ba"}$q$::jsonb
)
on conflict (slug) do nothing;

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'hermionne', $q$Hermionne$q$, $q$ADECHI$q$, $q$La Roche Bénin$q$,
  $q$Business Development Manager$q$,
  $q$Je développe des partenariats stratégiques et accélère la croissance commerciale de l'entreprise.$q$,
  '/hermionne.png',
  '+229 01 96 21 71 12', '+2290196217112', '2290196217112', 'adechih@gmail.com',
  null, $q$Cotonou, Bénin$q$, 'Cotonou', $q$Bénin · Disponible à distance$q$,
  'published', '#EA580C', '#F97316',
  $q$[
    {"icon":"Briefcase","short":"Prospection commerciale","desc":"Identification de nouveaux marchés et opportunités, développement d'un pipeline de prospects qualifiés."},
    {"icon":"BarChart3","short":"Stratégie & analyse de marché","desc":"Analyse concurrentielle, définition des stratégies de croissance et business plans pour nouvelles initiatives."},
    {"icon":"ClipboardList","short":"Négociation & closing","desc":"Préparation des offres commerciales, négociation des contrats et conclusion des accords stratégiques."},
    {"icon":"Users","short":"Partenariats & relations clients","desc":"Relations durables avec les clients clés et suivi post-vente pour fidéliser et générer de nouvelles opportunités."},
    {"icon":"Workflow","short":"Pilotage de projets","desc":"Coordination des équipes internes, suivi des KPIs commerciaux et reporting à la direction."},
    {"icon":"Lightbulb","short":"Veille & innovation","desc":"Surveillance du marché, de la réglementation et proposition de nouvelles offres adaptées aux besoins émergents."}
  ]$q$::jsonb,
  '{}'::jsonb
)
on conflict (slug) do nothing;

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'jerryda', $q$Jerryda$q$, $q$KOUASSI VILLELA$q$, $q$Chronopost (via Teleperformance)$q$,
  $q$Gestionnaire de Comptes Internationaux & Analyste de Données Digitales$q$,
  $q$Je pilote des comptes clients internationaux et transforme la donnée web en décisions business.$q$,
  '/jerryda.png',
  '+228 93 92 46 19', '+22893924619', '22893924619', 'jerrydakouassi@gmail.com',
  null, $q$Lomé, Togo$q$, 'Lomé', $q$Togo · Disponible à distance$q$,
  'published', '#BE123C', '#E11D48',
  $q$[
    {"icon":"Users","short":"Relation client internationale","desc":"Interlocuteur privilégié pour un portefeuille de clients internationaux, suivi régulier et compréhension des besoins selon les zones et cultures d'affaires."},
    {"icon":"Workflow","short":"Coordination interculturelle","desc":"Communication adaptée aux fuseaux horaires et cultures, coordination des livrables et respect des délais, budgets et SLA."},
    {"icon":"Briefcase","short":"Développement de comptes","desc":"Upsell/cross-sell, renouvellement et négociation des contrats, suivi via CRM (Salesforce, HubSpot) et reporting à la direction."},
    {"icon":"Code2","short":"Collecte & tracking data","desc":"Mise en place d'outils de tracking (Google Analytics, GTM, Matomo) et structuration des données web, apps et campagnes."},
    {"icon":"BarChart3","short":"Analyse & reporting data","desc":"Suivi des KPIs (trafic, conversion, CAC, ROAS), création de tableaux de bord (Looker Studio, Power BI) et insights actionnables."},
    {"icon":"Lightbulb","short":"Optimisation data-driven","desc":"Tests A/B, recommandations basées sur la donnée, veille outils (GA4, IA) et conformité RGPD."}
  ]$q$::jsonb,
  $q${"linkedin":"https://www.linkedin.com/in/jerrydakouassi/"}$q$::jsonb
)
on conflict (slug) do nothing;

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, theme_primary, theme_secondary, services, social
) values (
  'kenethe', $q$Kenethe Merveille$q$, $q$KODJA$q$, $q$Officine Pharmaceutique$q$,
  $q$Technicienne de Vente en Pharmacie & Communication Digitale$q$,
  $q$J'allie conseil client en pharmacie et stratégie digitale pour dynamiser l'image et les ventes de l'officine.$q$,
  '/merveille.png',
  '+229 01 45 21 33 21', '+2290145213321', '2290145213321', 'kenethemerveillekodja@gmail.com',
  null, $q$Cotonou, Bénin$q$, 'Cotonou', $q$Bénin · Disponible à distance$q$,
  'published', '#6E1423', '#9C1F35',
  $q$[
    {"icon":"Stethoscope","short":"Accueil & conseil client","desc":"Accueil et conseil client sur produits (para)pharmaceutiques, vente et encaissement."},
    {"icon":"ClipboardList","short":"Stocks & conformité","desc":"Gestion des stocks et rayons, application des règles réglementaires (traçabilité, hygiène)."},
    {"icon":"Palette","short":"Création de visuels","desc":"Conception de visuels pour réseaux sociaux, promotions et packaging produits."},
    {"icon":"Megaphone","short":"Community management","desc":"Gestion des réseaux sociaux de l'officine et rédaction de contenus (posts, newsletters santé/beauté)."},
    {"icon":"BarChart3","short":"Campagnes promotionnelles","desc":"Campagnes de promotion (nouveautés, offres saisonnières) et suivi des indicateurs d'engagement et de ventes."},
    {"icon":"Users","short":"Fidélisation digitale","desc":"Fidélisation client via digital : SMS et programmes de fidélité en ligne."}
  ]$q$::jsonb,
  $q${"linkedin":"https://www.linkedin.com/in/kenethemerveillekodja/"}$q$::jsonb
)
on conflict (slug) do nothing;
