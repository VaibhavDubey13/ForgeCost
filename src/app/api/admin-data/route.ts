import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [{ data: profiles, error: pe }, { data: feedback, error: fe }] = await Promise.all([
      adminSupabase.from("profiles").select("*").order("created_at", { ascending: false }),
      adminSupabase.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);

    if (pe) throw pe;
    if (fe) throw fe;

    return NextResponse.json({ profiles, feedback });
  } catch (err) {
    console.error("Admin data error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}