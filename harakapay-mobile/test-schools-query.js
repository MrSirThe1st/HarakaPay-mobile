// Test script to verify schools query works
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchoolsQuery() {
  try {
    console.log('🔍 Testing schools query...');
    
    // Test 1: Query schools without authentication
    console.log('\n1. Testing schools query without auth...');
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, address, contact_phone, status')
      .eq('status', 'approved')
      .order('name');
    
    if (schoolsError) {
      console.error('❌ Schools query error:', schoolsError);
    } else {
      console.log('✅ Schools query successful:', schoolsData?.length || 0, 'schools found');
      if (schoolsData && schoolsData.length > 0) {
        console.log('📋 Sample school:', schoolsData[0]);
      }
    }
    
    // Test 2: Check RLS policies on schools table
    console.log('\n2. Checking RLS policies on schools table...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'schools');
    
    if (policyError) {
      console.log('⚠️ Could not check policies:', policyError.message);
    } else {
      console.log('📋 Schools table policies:', policies?.length || 0);
      policies?.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.roles})`);
      });
    }
    
    // Test 3: Check if schools table has RLS enabled
    console.log('\n3. Checking if RLS is enabled on schools table...');
    const { data: rlsInfo, error: rlsError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('tablename', 'schools')
      .eq('schemaname', 'public');
    
    if (rlsError) {
      console.log('⚠️ Could not check RLS status:', rlsError.message);
    } else {
      console.log('📋 Schools table info:', rlsInfo);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testSchoolsQuery();

