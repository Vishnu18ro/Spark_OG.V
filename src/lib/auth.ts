// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";

export async function signUp(username: string, password: string) {
  // Check if username already exists
  // @ts-ignore - Supabase types issue
  const { data: existingUser } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return { error: { message: "Username already exists. Please choose another." } };
  }

  // Create internal email mapping
  const email = `${username}@spark.local`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });

  return { data, error };
}

export async function login(username: string, password: string) {
  const email = `${username}@spark.local`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export function enableGuestMode() {
  sessionStorage.setItem("guest", "true");
  return true;
}

export function isGuestMode() {
  return sessionStorage.getItem("guest") === "true";
}

export function clearGuestMode() {
  sessionStorage.removeItem("guest");
}
