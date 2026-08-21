import {
  Code2,
  ClipboardList,
  Megaphone,
  Palette,
  Workflow,
  BarChart3,
  Camera,
  Users,
  Mic,
  PenTool,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Scale,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP = {
  Code2,
  ClipboardList,
  Megaphone,
  Palette,
  Workflow,
  BarChart3,
  Camera,
  Users,
  Mic,
  PenTool,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Scale,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;
