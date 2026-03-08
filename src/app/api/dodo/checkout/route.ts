// src/app/api/dodo/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { createClient } from "@supabase/supabase-js";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode",
});

// Server-side Supabase client with service role for writing profiles
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, userName } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing userId or userEmail" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forge-cost.vercel.app/app";

    // Create checkout session with Dodo
    const { plan } = await req.json(); // already have userId, userEmail, userName
const productId = plan === "annual"
  ? process.env.NEXT_PUBLIC_DODO_ANNUAL_PRODUCT_ID!
  : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID!;

const session = await dodo.checkoutSessions.create({
  product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: userEmail,
        name: userName ?? userEmail,
      },
      return_url: `${siteUrl}/app?payment=success`,
      metadata: { userId },
    });

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (err) {
    console.error("Dodo checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}