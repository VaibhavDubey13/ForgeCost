// src/app/api/dodo/verify/route.ts
// Verifies a subscription is actually active before showing success UI

import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { createClient } from "@supabase/supabase-js";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    // Get user profile to find subscription ID
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("dodo_subscription_id, subscription_status")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ verified: false });
    }

    // Already marked as pro in DB (webhook already fired)
    if (profile.subscription_status === "pro") {
      return NextResponse.json({ verified: true });
    }

    // Webhook hasn't fired yet — check Dodo directly
    if (profile.dodo_subscription_id) {
      const sub = await dodo.subscriptions.retrieve(
        profile.dodo_subscription_id
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((sub as any).status === "active") {
        // Update DB manually since webhook may be delayed
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "pro" })
          .eq("id", userId);
        return NextResponse.json({ verified: true });
      }
    }

    return NextResponse.json({ verified: false });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ verified: false });
  }
}