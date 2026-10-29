/**
 * Supabase Client Initializer & Configuration Check
 * 
 * Central client initialized with public anon key and typed against the database schema.
 * Never use or expose the service-role key in this file or any client code.
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/types/database";

/**
 * Returns true if real Supabase credentials are configured in the environment.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = env.supabaseUrl;
  const key = env.supabaseAnonKey;
  return Boolean(
    url &&
    key &&
    url.trim() !== "" &&
    key.trim() !== "" &&
    url.startsWith("http") &&
    !url.includes("your-project.supabase.co") &&
    !key.includes("your-anon-key")
  );
};

// Safe fallback placeholder for build/initialization when credentials are not yet supplied
const fallbackUrl = "https://placeholder-campus360.supabase.co";
const fallbackKey = "placeholder-anon-key";

export const supabase = createClient<Database>(
  isSupabaseConfigured() ? (env.supabaseUrl as string) : fallbackUrl,
  isSupabaseConfigured() ? (env.supabaseAnonKey as string) : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "campus360.supabase.auth.token",
    },
  }
);

export default supabase;
