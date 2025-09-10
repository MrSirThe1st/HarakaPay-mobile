// Permission validation utilities for mobile app
import { supabase } from '../config/supabase';

export async function validateParentAccess(userId: string): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('user_id', userId)
      .single();

    if (error) return false;
    
    return profile.role === 'parent' && profile.is_active;
  } catch {
    return false;
  }
}

export async function validateUserRole(userId: string, requiredRole: string): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('user_id', userId)
      .single();

    if (error) return false;
    
    return profile.role === requiredRole && profile.is_active;
  } catch {
    return false;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    
    return profile.role;
  } catch {
    return null;
  }
}

export async function isUserActive(userId: string): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('user_id', userId)
      .single();

    if (error) return false;
    
    return profile.is_active;
  } catch {
    return false;
  }
}
