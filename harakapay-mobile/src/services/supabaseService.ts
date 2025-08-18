// Supabase business logic
import { supabase } from '../config/supabase';

export const fetchFromSupabase = async (table: string) => {
  return supabase.from(table).select('*');
};
