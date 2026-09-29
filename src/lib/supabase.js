import { createClient } from "@supabase/supabase-js";

// These are public browser credentials. Row Level Security remains the
// authorization boundary, while deployment variables can override them.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://pegywlozkjzrxhsthpgh.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZ3l3bG96a2p6cnhoc3RocGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NzE2NTgsImV4cCI6MjEwNTU0NzY1OH0.LW4kYmlLC1Mfod8OYqFvfJClwNVQMuMrFeGnuqV_V6A";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
