// Debug script to check specific user profile
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserProfile() {
  const userId = '077ca0fb-d9e2-4a16-bd90-de8df6236f63';
  
  try {
    console.log('🔍 Debugging user profile for:', userId);
    
    // Check if user exists in auth.users
    console.log('\n1. Checking auth user...');
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
    } else {
      console.log('✅ Auth user:', {
        id: authUser.user?.id,
        email: authUser.user?.email,
        metadata: authUser.user?.user_metadata
      });
    }
    
    // Check parent profile
    console.log('\n2. Checking parent profile...');
    const { data: parentProfile, error: parentError } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (parentError) {
      console.error('❌ Parent profile error:', parentError);
    } else {
      console.log('✅ Parent profile found:', parentProfile);
    }
    
    // Try to create parent profile if missing
    if (parentError && parentError.code === 'PGRST116') {
      console.log('\n3. Creating missing parent profile...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('parents')
        .insert({
          user_id: userId,
          first_name: 'Unknown',
          last_name: 'User',
          phone: '',
          email: authUser.user?.email || '',
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Failed to create parent profile:', createError);
      } else {
        console.log('✅ Parent profile created:', newProfile);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugUserProfile();

