import { supabase } from '@/lib/supabase';
import { getProfilesByUserIds } from '@/lib/profiles';
import type { Profile } from '@/types/profile';

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface ConnectionWithProfile {
  connection: Connection;
  otherProfile: Profile | null;
}

interface ConnectionRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: ConnectionStatus;
  created_at: string;
}

function fromRow(row: ConnectionRow): Connection {
  return {
    id: row.id,
    requesterId: row.requester_id,
    addresseeId: row.addressee_id,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function findConnectionBetween(userA: string, userB: string): Promise<Connection | null> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`and(requester_id.eq.${userA},addressee_id.eq.${userB}),and(requester_id.eq.${userB},addressee_id.eq.${userA})`)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as ConnectionRow) : null;
}

export async function getConnectionStatusWith(me: string, other: string): Promise<Connection | null> {
  return findConnectionBetween(me, other);
}

export async function sendConnectionRequest(me: string, other: string): Promise<Connection> {
  const existing = await findConnectionBetween(me, other);

  if (!existing) {
    const { data, error } = await supabase
      .from('connections')
      .insert({ requester_id: me, addressee_id: other, status: 'pending' })
      .select()
      .single();
    if (error) throw error;
    return fromRow(data as ConnectionRow);
  }

  if (existing.status === 'accepted') return existing;

  if (existing.status === 'pending' && existing.requesterId === other) {
    // They'd already requested us — mutual interest, accept immediately.
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data as ConnectionRow);
  }

  if (existing.status === 'pending' && existing.requesterId === me) return existing;

  // Previously declined — send a fresh request.
  const { data, error } = await supabase
    .from('connections')
    .update({ status: 'pending', requester_id: me, addressee_id: other })
    .eq('id', existing.id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as ConnectionRow);
}

export async function respondToRequest(connectionId: string, accept: boolean): Promise<void> {
  const { error } = await supabase
    .from('connections')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', connectionId);
  if (error) throw error;
}

export async function removeConnection(connectionId: string): Promise<void> {
  const { error } = await supabase.from('connections').delete().eq('id', connectionId);
  if (error) throw error;
}

async function withOtherProfiles(rows: Connection[], me: string): Promise<ConnectionWithProfile[]> {
  const otherIds = rows.map((r) => (r.requesterId === me ? r.addresseeId : r.requesterId));
  const profiles = await getProfilesByUserIds(otherIds);
  const byUserId = new Map(profiles.map((p) => [p.userId, p]));
  return rows.map((r) => ({
    connection: r,
    otherProfile: byUserId.get(r.requesterId === me ? r.addresseeId : r.requesterId) ?? null,
  }));
}

export async function getMyConnections(me: string): Promise<ConnectionWithProfile[]> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${me},addressee_id.eq.${me}`);
  if (error) throw error;
  return withOtherProfiles((data as ConnectionRow[]).map(fromRow), me);
}

export async function getPendingIncoming(me: string): Promise<ConnectionWithProfile[]> {
  const { data, error } = await supabase.from('connections').select('*').eq('status', 'pending').eq('addressee_id', me);
  if (error) throw error;
  return withOtherProfiles((data as ConnectionRow[]).map(fromRow), me);
}

export async function getPendingOutgoing(me: string): Promise<ConnectionWithProfile[]> {
  const { data, error } = await supabase.from('connections').select('*').eq('status', 'pending').eq('requester_id', me);
  if (error) throw error;
  return withOtherProfiles((data as ConnectionRow[]).map(fromRow), me);
}

export async function getPendingIncomingCount(me: string): Promise<number> {
  const { count, error } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .eq('addressee_id', me);
  if (error) throw error;
  return count ?? 0;
}

export async function getAllMyConnections(me: string): Promise<Connection[]> {
  const { data, error } = await supabase.from('connections').select('*').or(`requester_id.eq.${me},addressee_id.eq.${me}`);
  if (error) throw error;
  return (data as ConnectionRow[]).map(fromRow);
}
