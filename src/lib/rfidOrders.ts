import { supabase } from '@/lib/supabase';

export type RfidOrderStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface RfidOrder {
  id: string;
  userId: string;
  profileId: string;
  quantity: number;
  notes: string;
  status: RfidOrderStatus;
  createdAt: string;
}

export interface RfidOrderWithProfile extends RfidOrder {
  profile: {
    firstName: string;
    lastName: string;
    slug: string;
    phone: string;
    email: string;
  } | null;
}

interface RfidOrderRow {
  id: string;
  user_id: string;
  profile_id: string;
  quantity: number;
  notes: string;
  status: RfidOrderStatus;
  created_at: string;
}

interface RfidOrderRowWithProfile extends RfidOrderRow {
  profile: {
    first_name: string;
    last_name: string;
    slug: string;
    phone: string;
    email: string;
  } | null;
}

function fromRow(row: RfidOrderRow): RfidOrder {
  return {
    id: row.id,
    userId: row.user_id,
    profileId: row.profile_id,
    quantity: row.quantity,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createRfidOrder(
  userId: string,
  profileId: string,
  quantity: number,
  notes: string
): Promise<RfidOrder> {
  const { data, error } = await supabase
    .from('rfid_orders')
    .insert({ user_id: userId, profile_id: profileId, quantity, notes })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as RfidOrderRow);
}

export async function getMyRfidOrders(userId: string): Promise<RfidOrder[]> {
  const { data, error } = await supabase
    .from('rfid_orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as RfidOrderRow[]).map(fromRow);
}

export async function getAllRfidOrders(): Promise<RfidOrderWithProfile[]> {
  const { data, error } = await supabase
    .from('rfid_orders')
    .select('*, profile:profiles(first_name,last_name,slug,phone,email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as RfidOrderRowWithProfile[]).map((row) => ({
    ...fromRow(row),
    profile: row.profile
      ? {
          firstName: row.profile.first_name,
          lastName: row.profile.last_name,
          slug: row.profile.slug,
          phone: row.profile.phone,
          email: row.profile.email,
        }
      : null,
  }));
}

export async function updateRfidOrderStatus(id: string, status: RfidOrderStatus): Promise<void> {
  const { error } = await supabase.from('rfid_orders').update({ status }).eq('id', id);
  if (error) throw error;
}
