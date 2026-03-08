import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types matching our database tables ──────────────────────────────────────

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type SavedTemplate = {
  id: string;
  user_id: string;
  name: string;
  trade: string;
  materials: unknown[];
  markup_pct: number;
  created_at: string;
  updated_at: string;
};

export type SavedQuote = {
  id: string;
  user_id: string;
  job_name: string;
  trade: string;
  company_name: string | null;
  notes: string | null;
  materials: unknown[];
  markup_pct: number;
  subtotal: number;
  grand_total: number;
  created_at: string;
};