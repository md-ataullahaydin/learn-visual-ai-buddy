
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback empty values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are missing
let supabase;

// Only create a real Supabase client if both URL and key are provided
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that logs warnings instead of throwing errors
  console.warn(
    'Supabase credentials are missing. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
  
  // Mock client with methods that return empty responses
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    functions: {
      invoke: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    },
  };
}

export { supabase };
