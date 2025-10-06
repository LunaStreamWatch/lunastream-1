// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment and have the required env vars
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

const mockClient = {
  auth: {
    signUp: () => Promise.reject(new Error('Supabase not configured')),
    signIn: () => Promise.reject(new Error('Supabase not configured')),
    signOut: () => Promise.reject(new Error('Supabase not configured')),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.reject(new Error('Supabase not configured')),
    insert: () => Promise.reject(new Error('Supabase not configured')),
    update: () => Promise.reject(new Error('Supabase not configured')),
    delete: () => Promise.reject(new Error('Supabase not configured'))
  })
};

export const supabase = (!supabaseUrl || !supabaseAnonKey)
  ? mockClient
  : createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Some features may not work.');
}