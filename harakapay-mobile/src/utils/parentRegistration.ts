// Parent registration utility for mobile app
import { supabase } from '../config/supabase';
import { ProfileInsert, ParentInsert } from '../config/supabase';

export async function registerParent(parentData: {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address?: string;
}) {
  try {
    // First, create the profile record with parent role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: parentData.user_id,
        first_name: parentData.first_name,
        last_name: parentData.last_name,
        phone: parentData.phone,
        email: parentData.email,
        address: parentData.address,
        role: 'parent',
        is_active: true
      } as ProfileInsert)
      .select()
      .single();

    if (profileError) throw profileError;

    // Then create the parent record for mobile-specific data
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .insert({
        user_id: parentData.user_id,
        first_name: parentData.first_name,
        last_name: parentData.last_name,
        phone: parentData.phone,
        email: parentData.email,
        address: parentData.address,
        is_active: true
      } as ParentInsert)
      .select()
      .single();

    if (parentError) throw parentError;

    return { profile, parent };
  } catch (error) {
    console.error('Parent registration error:', error);
    throw error;
  }
}

// Get parent profile from profiles table
export async function getParentProfile(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'parent')
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    throw error;
  }
}

// Update parent profile
export async function updateParentProfile(userId: string, updates: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatar_url?: string;
}) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .eq('role', 'parent')
      .select()
      .single();

    if (error) throw error;

    // Also update the parents table for consistency
    const { error: parentError } = await supabase
      .from('parents')
      .update(updates)
      .eq('user_id', userId);

    if (parentError) {
      console.warn('Failed to update parents table:', parentError);
    }

    return profile;
  } catch (error) {
    console.error('Error updating parent profile:', error);
    throw error;
  }
}
