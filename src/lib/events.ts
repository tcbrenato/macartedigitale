import { supabase } from '@/lib/supabase';
import { getProfilesByUserIds } from '@/lib/profiles';
import type { Profile } from '@/types/profile';

export interface EventSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface EventRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

function fromRow(row: EventRow): EventSummary {
  return { id: row.id, name: row.name, slug: row.slug, createdAt: row.created_at };
}

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Events the given user belongs to — this is what gates access to Annuaire/Connexions. */
export async function getMyEvents(userId: string): Promise<EventSummary[]> {
  const { data, error } = await supabase
    .from('event_members')
    .select('event:events(id, name, slug, created_at)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data as unknown as { event: EventRow | null }[])
    .map((row) => row.event)
    .filter((e): e is EventRow => e !== null)
    .map(fromRow);
}

async function getEventMemberIds(eventId: string): Promise<string[]> {
  const { data, error } = await supabase.from('event_members').select('user_id').eq('event_id', eventId);
  if (error) throw error;
  return (data as { user_id: string }[]).map((r) => r.user_id);
}

/** Directory listing scoped to a single event: every other published member. */
export async function searchEventDirectory(eventId: string, query: string, excludeUserId: string): Promise<Profile[]> {
  const memberIds = (await getEventMemberIds(eventId)).filter((id) => id !== excludeUserId);
  if (memberIds.length === 0) return [];
  const profiles = (await getProfilesByUserIds(memberIds)).filter((p) => p.status === 'published');

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return profiles;
  return profiles.filter((p) =>
    [p.firstName, p.lastName, p.organization, p.title, p.city, p.slug]
      .filter((field): field is string => Boolean(field))
      .some((field) => field.toLowerCase().includes(trimmed))
  );
}

// ===== Admin management =====

export async function getAllEvents(): Promise<EventSummary[]> {
  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as EventRow[]).map(fromRow);
}

export async function getEvent(id: string): Promise<EventSummary | null> {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as EventRow) : null;
}

export async function createEvent(name: string): Promise<EventSummary> {
  const { data, error } = await supabase
    .from('events')
    .insert({ name, slug: slugify(name) })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as EventRow);
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

export async function getEventMembers(eventId: string): Promise<Profile[]> {
  const memberIds = await getEventMemberIds(eventId);
  if (memberIds.length === 0) return [];
  return getProfilesByUserIds(memberIds);
}

export async function addEventMember(eventId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('event_members').insert({ event_id: eventId, user_id: userId });
  if (error) throw error;
}

export async function removeEventMember(eventId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('event_members').delete().eq('event_id', eventId).eq('user_id', userId);
  if (error) throw error;
}
