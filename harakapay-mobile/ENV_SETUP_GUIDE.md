# Environment Variables Setup Guide

## Step 1: Fill in your .env file

Open the `.env` file in the root directory and replace the placeholder values with your actual credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Payment API Configuration
PAYMENT_API_URL=https://your-payment-api-url.com
```

## Step 2: Get your Supabase credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** key → Use as `SUPABASE_ANON_KEY`
   - **service_role** key → Use as `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Test the setup

After filling in your credentials, run:

```bash
npx expo start --clear
```

The app should now load without environment variable errors.

## Troubleshooting

If you still get environment variable errors:

1. Make sure your `.env` file is in the root directory (same level as `package.json`)
2. Restart the Metro bundler with `--clear` flag
3. Check that there are no extra spaces or quotes around your values
4. Verify the variable names match exactly (case-sensitive)

## File Structure

```
harakapay-mobile/
├── .env                    ← Your environment variables go here
├── babel.config.js         ← Configured for react-native-dotenv
├── src/
│   └── config/
│       ├── env.ts          ← Loads variables from .env
│       └── supabase.ts     ← Uses variables to create Supabase client
```
