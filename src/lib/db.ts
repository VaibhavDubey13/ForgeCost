// src/lib/db.ts
// Database helper functions for templates and quotes

import { supabase } from "./supabase";
import type { Material } from "./trades";

// ── Templates ────────────────────────────────────────────────────────────────

export async function saveTemplate({
  name,
  trade,
  materials,
  markupPct,
}: {
  name: string;
  trade: string;
  materials: Material[];
  markupPct: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("templates")
    .insert({
      user_id: user.id,
      name,
      trade,
      materials: materials as unknown[],
      markup_pct: markupPct,
    })
    .select()
    .single();

  return { data, error };
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", id);

  return { error };
}

export async function updateTemplate(
  id: string,
  updates: { name?: string; materials?: Material[]; markup_pct?: number }
) {
  const { data, error } = await supabase
    .from("templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// ── Quotes ───────────────────────────────────────────────────────────────────

export async function saveQuote({
  jobName,
  trade,
  companyName,
  notes,
  materials,
  markupPct,
  subtotal,
  grandTotal,
}: {
  jobName: string;
  trade: string;
  companyName?: string;
  notes?: string;
  materials: Material[];
  markupPct: number;
  subtotal: number;
  grandTotal: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      user_id: user.id,
      job_name: jobName,
      trade,
      company_name: companyName ?? null,
      notes: notes ?? null,
      materials: materials as unknown[],
      markup_pct: markupPct,
      subtotal,
      grand_total: grandTotal,
    })
    .select()
    .single();

  return { data, error };
}

export async function getQuotes() {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return { data, error };
}

export async function deleteQuote(id: string) {
  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", id);

  return { error };
}