// src/lib/subscription.ts
// Tier limits and subscription helpers

import { supabase } from "./supabase";

export type SubscriptionStatus = "free" | "pro" | "cancelled";

export const LIMITS = {
  free: {
    quotes: 5,        // total quotes allowed
    templates: 3,     // max saved templates
    history: 5,       // max quote history shown
  },
  pro: {
    quotes: Infinity,
    templates: Infinity,
    history: Infinity,
  },
};

export interface UserProfile {
  id: string;
  email: string;
  subscription_status: SubscriptionStatus;
  quotes_used: number;
  dodo_customer_id: string | null;
  dodo_subscription_id: string | null;
  subscription_period_end: string | null;
}

/** Fetch the current user's profile from Supabase */
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

/** Check if user is on Pro plan */
export function isPro(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return profile.subscription_status === "pro";
}

/** Check if free user has hit quote limit */
export function hasHitQuoteLimit(profile: UserProfile | null): boolean {
  if (!profile) return false;
  if (isPro(profile)) return false;
  return profile.quotes_used >= LIMITS.free.quotes;
}

/** Check if free user has hit template limit */
export function hasHitTemplateLimit(
  profile: UserProfile | null,
  currentCount: number
): boolean {
  if (!profile) return false;
  if (isPro(profile)) return false;
  return currentCount >= LIMITS.free.templates;
}

/** Increment quotes_used for the current user */
export async function incrementQuotesUsed(userId: string): Promise<void> {
  await supabase.rpc("increment_quotes_used", { user_id: userId });
}