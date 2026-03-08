// src/app/api/dodo/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET!;

    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    const headers = {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
    };

    let event: {
      type: string;
      data: Record<string, unknown>;
    };

    try {
      event = wh.verify(rawBody, headers) as typeof event;
    } catch {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = event.data as Record<string, unknown>;
    const metadata = (data.metadata ?? {}) as Record<string, string>;
    const userId = metadata.userId;

    console.log("Dodo webhook event:", event.type, { userId });

    switch (event.type) {
      // ── Subscription activated / payment succeeded ─────────────────────
      case "subscription.active":
      case "payment.succeeded": {
        if (!userId) break;

        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "pro",
            dodo_subscription_id: (data.subscription_id as string) ?? null,
            dodo_customer_id: (data.customer_id as string) ?? null,
            subscription_period_end: (data.next_billing_date as string) ?? null,
          })
          .eq("id", userId);

        console.log("✅ User upgraded to Pro:", userId);
        break;
      }

      // ── Subscription cancelled ──────────────────────────────────────────
      case "subscription.cancelled":
      case "subscription.failed": {
        if (!userId) break;

        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "free",
            dodo_subscription_id: null,
            subscription_period_end: null,
          })
          .eq("id", userId);

        console.log("❌ User downgraded to Free:", userId);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}