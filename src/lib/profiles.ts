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
  phone_public: boolean;
  email: string;
  email_public: boolean;
  url: string | null;
  address: string;
  address_public: boolean;
  city: string;
  country_line: string;
  status: ProfileStatus;
  template_id: string;
  theme_primary: string;
  theme_secondary: string;
  services: ProfileService[];
  social: ProfileSocialLinks;
  qr_code_url: string | null;
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
    phonePublic: row.phone_public ?? true,
    email: row.email,
    emailPublic: row.email_public ?? true,
    url: row.url ?? undefined,
    address: row.address,
    addressPublic: row.address_public ?? true,
    city: row.city,
    countryLine: row.country_line,
    status: row.status,
    templateId: row.template_id,
    themePrimary: row.theme_primary,
    themeSecondary: row.theme_secondary,
    services: row.services,
    social: row.social,
    qrCodeUrl: row.qr_code_url ?? undefined,
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
    phone_public: profile.phonePublic,
    email: profile.email,
    email_public: profile.emailPublic,
    url: profile.url ?? null,
    address: profile.address,
    address_public: profile.addressPublic,
    city: profile.city,
    country_line: profile.countryLine,
    status: profile.status,
    template_id: profile.templateId,
    theme_primary: profile.themePrimary,
    theme_secondary: profile.themeSecondary,
    services: profile.services,
    social: profile.social,
    qr_code_url: profile.qrCodeUrl ?? null,
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

  // Update-by-id when the row already exists, insert otherwise. (Upsert-by-user_id doesn't
  // work reliably here: user_id can be null for an unclaimed profile an admin is editing,
  // and NULL never conflicts with NULL under a unique constraint.)
  if (profile.id) {
    const { data, error } = await supabase.from('profiles').update(row).eq('id', profile.id).select().single();
    if (error) throw error;
    return fromRow(data as ProfileRow);
  }

  const { data, error } = await supabase.from('profiles').insert(row).select().single();
  if (error) throw error;
  return fromRow(data as ProfileRow);
}

export interface ProfileSummary {
  id: string;
  userId: string | null;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  status: ProfileStatus;
}

export async function getAllProfileSummaries(): Promise<ProfileSummary[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, slug, first_name, last_name, email, status')
    .order('first_name', { ascending: true });

  if (error) throw error;
  return (data as Array<Pick<ProfileRow, 'id' | 'user_id' | 'slug' | 'first_name' | 'last_name' | 'email' | 'status'>>).map(
    (row) => ({
      id: row.id,
      userId: row.user_id,
      slug: row.slug,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      status: row.status,
    })
  );
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProfileRow) : null;
}

export async function uploadPhoto(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${userId}/photo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}
