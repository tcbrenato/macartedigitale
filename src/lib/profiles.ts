import { supabase } from '@/lib/supabase';
import type { Profile, ProfileService, ProfileSocialLinks, ProfileStatus } from '@/types/profile';

interface ProfileRow {
  id: string;
  user_id: string | null;
  slug: string;
  first_name: string;
  last_name: string;
  organization: string;
  title: string;
  tagline: string;
  photo_url: string;
  phone: string;
  phone_raw: string;
  whatsapp: string;
  email: string;
  url: string | null;
  address: string;
  city: string;
  country_line: string;
  status: ProfileStatus;
  template_id: string;
  theme_primary: string;
  theme_secondary: string;
  services: ProfileService[];
  social: ProfileSocialLinks;
}

function fromRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    organization: row.organization,
    title: row.title,
    tagline: row.tagline,
    photo: row.photo_url,
    phone: row.phone,
    phoneRaw: row.phone_raw,
    whatsapp: row.whatsapp,
    email: row.email,
    url: row.url ?? undefined,
    address: row.address,
    city: row.city,
    countryLine: row.country_line,
    status: row.status,
    templateId: row.template_id,
    themePrimary: row.theme_primary,
    themeSecondary: row.theme_secondary,
    services: row.services,
    social: row.social,
  };
}

function toRow(profile: Omit<Profile, 'id'>) {
  return {
    user_id: profile.userId,
    slug: profile.slug,
    first_name: profile.firstName,
    last_name: profile.lastName,
    organization: profile.organization,
    title: profile.title,
    tagline: profile.tagline,
    photo_url: profile.photo,
    phone: profile.phone,
    phone_raw: profile.phoneRaw,
    whatsapp: profile.whatsapp,
    email: profile.email,
    url: profile.url ?? null,
    address: profile.address,
    city: profile.city,
    country_line: profile.countryLine,
    status: profile.status,
    template_id: profile.templateId,
    theme_primary: profile.themePrimary,
    theme_secondary: profile.themeSecondary,
    services: profile.services,
    social: profile.social,
  };
}

export async function getPublishedProfileBySlug(slug: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProfileRow) : null;
}

export async function getMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProfileRow) : null;
}

export async function saveProfile(profile: (Omit<Profile, 'id'> & { id?: string })): Promise<Profile> {
  const row = toRow(profile);
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile.id ? { id: profile.id, ...row } : row, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as ProfileRow);
}

export async function uploadPhoto(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${userId}/photo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}
