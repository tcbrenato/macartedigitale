import type { ComponentType } from 'react';
import type { TemplateId } from '@/types/profile';
import type { TemplateProps } from './types';
import ClassicTemplate from './ClassicTemplate';
import MinimalTemplate from './MinimalTemplate';
import DarkTemplate from './DarkTemplate';
import BannerTemplate from './BannerTemplate';
import SplitTemplate from './SplitTemplate';
import CorporateTemplate from './CorporateTemplate';
import CreativeTemplate from './CreativeTemplate';
import CompactTemplate from './CompactTemplate';
import ElegantTemplate from './ElegantTemplate';
import SocialTemplate from './SocialTemplate';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  desc: string;
  component: ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic', name: 'Classique', desc: 'Photo plein cadre, épuré', component: ClassicTemplate },
  { id: 'minimal', name: 'Minimaliste', desc: 'Sobre, beaucoup de blanc', component: MinimalTemplate },
  { id: 'dark', name: 'Sombre', desc: 'Toujours en mode nuit', component: DarkTemplate },
  { id: 'banner', name: 'Bannière', desc: 'Bandeau + avatar rond', component: BannerTemplate },
  { id: 'split', name: 'Diagonal', desc: 'Bloc de couleur en haut', component: SplitTemplate },
  { id: 'corporate', name: 'Corporate', desc: 'Formel, style CV', component: CorporateTemplate },
  { id: 'creative', name: 'Créatif', desc: 'Formes organiques, coloré', component: CreativeTemplate },
  { id: 'compact', name: 'Compact', desc: 'Tout tient sans défiler', component: CompactTemplate },
  { id: 'elegant', name: 'Élégant', desc: 'Typographie soignée, premium', component: ElegantTemplate },
  { id: 'social', name: 'Réseaux sociaux', desc: 'Réseaux mis en avant', component: SocialTemplate },
];

export const TEMPLATE_MAP: Record<TemplateId, ComponentType<TemplateProps>> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t.component])
) as Record<TemplateId, ComponentType<TemplateProps>>;
