// Environment configuration for HarakaPay Mobile
// Make sure your .env file contains the same values as your web portal

import Constants from 'expo-constants';
const extra = Constants.expoConfig?.extra || {};

// Supabase Configuration
export const SUPABASE_URL = extra.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY || '';
export const SUPABASE_SERVICE_ROLE_KEY = extra.SUPABASE_SERVICE_ROLE_KEY || '';

// Payment API Configuration
export const PAYMENT_API_URL = extra.PAYMENT_API_URL || '';

// Web API Configuration (for profile creation)
export const WEB_API_URL = extra.WEB_API_URL || 'https://www.harakapayment.com';

// Validation
const validateEnvironment = () => {
  const requiredVars = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    
    console.warn(`
🚨 Environment Configuration Warning 🚨

Missing environment variables: ${missingVars.join(', ')}

Create a .env file in your project root with:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PAYMENT_API_URL=your_payment_api_url (optional)

Make sure these values match your web portal's environment variables.
    `);
    
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate on import
validateEnvironment();

// Export configuration object
export const config = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  },
  payment: {
    apiUrl: PAYMENT_API_URL,
  },
  web: {
    apiUrl: WEB_API_URL,
  },
} as const;

export default config;