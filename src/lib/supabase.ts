import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const missingVariables = [
  !supabaseUrl && "VITE_SUPABASE_URL",
  !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
].filter(Boolean);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `[Supabase configuration] Missing environment variable(s): ${missingVariables.join(
      ", ",
    )}. Add them to .env and restart the development server.`,
  );
}

if (import.meta.env.DEV) {
  console.info("[Supabase] Project URL:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
