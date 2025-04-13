
import { createClient } from '@supabase/supabase-js';

// Default to empty strings if environment variables are not defined
// This prevents runtime errors but the client won't work until proper values are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client with added error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a check to warn developers if the configuration is missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anonymous Key is missing. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}
