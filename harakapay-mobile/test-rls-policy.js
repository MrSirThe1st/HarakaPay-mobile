// Test script to verify RLS policy is working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLSPolicy() {
  try {
    console.log('🔍 Testing RLS policy for parents table...');
    
    // Test 1: Check current RLS policies
    console.log('\n1. Checking RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'parents');
    
    if (policyError) {
      console.log('⚠️ Could not check policies:', policyError.message);
    } else {
      console.log('📋 Current policies:', policies);
    }
    
    // Test 2: Try to insert without authentication (should fail)
    console.log('\n2. Testing insert without auth (should fail)...');
    const { data: insertData, error: insertError } = await supabase
      .from('parents')
      .insert({
        user_id: 'test-user-id',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
        email: 'test@example.com'
      });
    
    if (insertError) {
      console.log('✅ Insert blocked as expected:', insertError.message);
    } else {
      console.log('❌ Insert should have been blocked but succeeded');
    }
    
    // Test 3: Check if we can select from parents table
    console.log('\n3. Testing select from parents table...');
    const { data: selectData, error: selectError } = await supabase
      .from('parents')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Select error:', selectError.message);
    } else {
      console.log('✅ Select works, found', selectData?.length || 0, 'records');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testRLSPolicy();

