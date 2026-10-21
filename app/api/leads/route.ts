import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Lead capture endpoint. Mirrors the Sapiens security model: the browser never
 * talks to Supabase directly — writes go through this server route using the
 * (hidden) service role key, and RLS locks the anon key out of writes.
 *
 * Without Supabase env vars the route still succeeds (logs only), so the site
 * works in local development before the backend is provisioned.
 */

const LEAD_TYPES = new Set([
  "counselling",
  "callback",
  "enrol",
  "brochure",
  "community",
  "waitlist",
  "founder-waitlist",
  "enquiry",
  "notify",
  "notify-program",
  "newsletter",
  "lead-magnet",
]);

export async function POST(req: NextRequest) {
  let body: { type?: string; data?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type ?? "";
  const data = body.data ?? {};

  if (!LEAD_TYPES.has(type)) {
    return NextResponse.json({ error: "Unknown lead type" }, { status: 400 });
  }

  /* ── Spam protection & server-side validation ── */

  // Honeypot: bots fill the hidden field; pretend success and drop the lead.
  if (typeof data.company_website === "string" && data.company_website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  delete data.company_website;

  // Size cap: reject oversized payloads outright.
  if (JSON.stringify(data).length > 8_000) {
    return NextResponse.json({ error: "Submission too large" }, { status: 400 });
  }
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== "string" || v.length > 1_000) {
      return NextResponse.json(
        { error: `Invalid value for "${k}"` },
        { status: 400 },
      );
    }
  }

  if (!data.email && !data.phone && !data.whatsapp) {
    return NextResponse.json(
      { error: "An email or phone number is required" },
      { status: 400 },
    );
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 },
    );
  }
  const phone = data.phone ?? data.whatsapp;
  if (phone && !/^\+?\d{10,13}$/.test(phone.replace(/[\s-]/g, ""))) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit mobile number" },
      { status: 400 },
    );
  }
  if (data.name && !/^[A-Za-z .'’-]{1,100}$/.test(data.name)) {
    return NextResponse.json(
      { error: "Please enter a valid name (letters only)" },
      { status: 400 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    const supabase = createClient(url, serviceKey);
    const { error } = await supabase.from("leads").insert({
      type,
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? data.whatsapp ?? null,
      payload: data,
    });
    if (error) {
      console.error("[leads] Supabase insert failed:", error.message);
      return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
    }
  } else {
    // Local dev fallback — no backend configured yet.
    console.log(`[leads] ${type}:`, JSON.stringify(data));
  }

  // TODO: Resend transactional email / WhatsApp notification goes here.
  return NextResponse.json({ ok: true });
}
