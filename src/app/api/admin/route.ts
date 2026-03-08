import { NextResponse } from "next/server";

// ADMIN_PASSWORD is a server-only env var (no NEXT_PUBLIC_ prefix)
// It never gets bundled into the browser JS
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Admin password not configured." }, { status: 500 });
  }

  if (password !== ADMIN_PASSWORD) {
    // Artificial delay to slow down brute force
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}