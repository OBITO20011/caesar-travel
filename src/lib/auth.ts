import { supabase } from "./supabase";

export async function isLoggedIn() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return !!session;
}