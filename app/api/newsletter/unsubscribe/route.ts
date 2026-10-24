import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** Marks a newsletter subscriber as unsubscribed (standard one-click style). */
export async function POST(req: NextRequest) {
  let email = "";
  try {
    email = String((await req.json())?.email ?? "").trim();
  } catch {}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.rpc("newsletter_unsubscribe", { p_email: email });
  if (error) {
    console.error("[newsletter] unsubscribe failed:", error.message);
    return NextResponse.json({ error: "Could not process the request. Please try again." }, { status: 500 });
  }
  // Same response whether or not the email existed — avoids subscriber enumeration.
  return NextResponse.json({ ok: true });
}
