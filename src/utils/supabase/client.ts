import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

export const createClient = () =>
  createSupabaseClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
