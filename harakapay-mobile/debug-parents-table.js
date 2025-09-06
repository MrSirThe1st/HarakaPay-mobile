// Debug script to test parents table access
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugParentsTable() {
  try {
    console.log('🔍 Testing parents table access...');
    
    // Test 1: Check if table exists by trying to select from it
    console.log('\n1. Testing SELECT access...');
    const { data: selectData, error: selectError } = await supabase
      .from('parents')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ SELECT error:', selectError);
      console.log('💡 This suggests the table might not exist or you don\'t have SELECT permissions');
    } else {
      console.log('✅ SELECT works, found', selectData?.length || 0, 'records');
    }
    
    // Test 2: Check table structure
    console.log('\n2. Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'parents')
      .eq('table_schema', 'public');
    
    if (tableError) {
      console.log('⚠️ Could not get table structure:', tableError.message);
    } else {
      console.log('📋 Table columns:', tableInfo);
    }
    
    // Test 3: Try to insert a test record
    console.log('\n3. Testing INSERT access...');
    const testData = {
      user_id: 'test-user-id-' + Date.now(),
      first_name: 'Test',
      last_name: 'User',
      phone: '1234567890', // phone is NOT NULL
      email: 'test@example.com' // email is NOT NULL
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('parents')
      .insert(testData)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ INSERT error:', insertError);
      console.log('💡 This suggests you don\'t have INSERT permissions or there are RLS policies blocking it');
    } else {
      console.log('✅ INSERT works, created record:', insertData);
      
      // Clean up test record
      await supabase
        .from('parents')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Cleaned up test record');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugParentsTable();
