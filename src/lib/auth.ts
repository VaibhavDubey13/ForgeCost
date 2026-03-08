// src/lib/auth.ts
// Auth helper functions wrapping Supabase auth calls

import { supabase } from "./supabase";

/** Sign up with email + password */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

/** Sign in with email + password */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Get current session */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/** Get current user */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}