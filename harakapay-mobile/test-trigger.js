// Test script to verify database trigger is working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTrigger() {
  try {
    console.log('🔍 Testing database trigger...');
    
    // Check if trigger exists
    console.log('\n1. Checking if trigger exists...');
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('*')
      .eq('trigger_name', 'on_auth_user_created')
      .eq('event_object_table', 'users');
    
    if (triggerError) {
      console.log('⚠️ Could not check triggers:', triggerError.message);
    } else {
      console.log('📋 Triggers found:', triggers?.length || 0);
      if (triggers && triggers.length > 0) {
        console.log('✅ Trigger exists:', triggers[0]);
      } else {
        console.log('❌ Trigger not found!');
      }
    }
    
    // Check if function exists
    console.log('\n2. Checking if function exists...');
    const { data: functions, error: functionError } = await supabase
      .from('information_schema.routines')
      .select('*')
      .eq('routine_name', 'handle_new_user')
      .eq('routine_schema', 'public');
    
    if (functionError) {
      console.log('⚠️ Could not check functions:', functionError.message);
    } else {
      console.log('📋 Functions found:', functions?.length || 0);
      if (functions && functions.length > 0) {
        console.log('✅ Function exists:', functions[0]);
      } else {
        console.log('❌ Function not found!');
      }
    }
    
    // Test a simple signup to see if trigger works
    console.log('\n3. Testing trigger with a test signup...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          phone: '1234567890'
        }
      }
    });
    
    if (signupError) {
      console.log('❌ Signup failed:', signupError.message);
    } else {
      console.log('✅ Signup successful, user ID:', signupData.user?.id);
      
      // Wait a moment for trigger to fire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if parent profile was created
      const { data: parentProfile, error: parentError } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', signupData.user.id)
        .single();
      
      if (parentError) {
        console.log('❌ Parent profile not created:', parentError.message);
      } else {
        console.log('✅ Parent profile created by trigger:', parentProfile);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testTrigger();

