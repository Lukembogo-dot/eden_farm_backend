import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL in .env');
}

if (!anonKey || !serviceRoleKey) {
  throw new Error('Missing Supabase keys in .env. Set SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY from your Supabase dashboard.');
}

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const supabaseAuth = createClient(supabaseUrl, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});