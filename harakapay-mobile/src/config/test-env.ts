// Test file to verify environment variables are loaded correctly
import { SUPABASE_URL, SUPABASE_ANON_KEY, validateEnvironment } from './env';

console.log('=== Environment Variables Test ===');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set (length: ' + SUPABASE_ANON_KEY.length + ')' : 'Not set');

try {
  validateEnvironment();
  console.log('✅ Environment validation passed');
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
