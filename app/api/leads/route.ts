import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Lead capture endpoint. The browser never talks to Supabase directly —
 * every form posts here, gets validated server-side, and is written to its
 * specialised table plus the central `leads` log.
 *
 * Keys: prefers SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Falls back to the
 * publishable key, which works because the migration grants INSERT-only
 * policies and SECURITY DEFINER functions — never read access.
 *
 * Without any Supabase env vars the route fails loudly (503) so a success
 * message is never shown without a saved record.
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

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Human-readable application reference, e.g. FI-M3K9D2-4X7Q */
function makeReference() {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[b % 31])
    .join("");
  return `FI-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

/* very small in-memory rate limit: 10 submissions / minute / IP */
const hits = new Map<string, { n: number; t: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 10;
}

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

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  /* ── Spam protection & server-side validation ── */

  // Honeypot: bots fill the hidden field; pretend success and drop the lead.
  if (typeof data.company_website === "string" && data.company_website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  delete data.company_website;

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

  const supabase = getClient();
  if (!supabase) {
    console.error("[leads] Supabase is not configured — submission rejected.");
    return NextResponse.json(
      { error: "Our server is not ready to save submissions yet. Please WhatsApp us instead." },
      { status: 503 },
    );
  }

  const source = data.source_page ?? req.headers.get("referer") ?? null;
  const name = data.name ?? null;
  const email = data.email ?? null;
  const phoneVal = data.phone ?? data.whatsapp ?? null;

  let reference: string | undefined;
  let subStatus: string | undefined;

  try {
    switch (type) {
      /* ── counselling / callback → counselling_enquiries ── */
      case "counselling":
      case "callback": {
        const { error } = await supabase.from("counselling_enquiries").insert({
          name,
          phone: phoneVal,
          email,
          interest: data.interest ?? null,
          preferred_batch: data.mode ?? null,
          situation: data.situation ?? null,
          question: data.question ?? null,
          preferred_day: data.preferred_day ?? null,
          time_slot: data.time_slot ?? null,
          source_page: source,
        });
        if (error) throw error;
        break;
      }

      /* ── enrol → program_applications ── */
      case "enrol": {
        reference = makeReference();
        const { error } = await supabase.from("program_applications").insert({
          reference,
          name,
          phone: phoneVal,
          email,
          program: data.program ?? "Marketing Management",
          batch_mode: data.mode === "offline" ? "offline" : "online",
          schedule: data.schedule ?? null,
          start_date: data.start_date ?? null,
          fee: data.fee ? Number(data.fee) || null : null,
          location: data.location ?? null,
          city: data.city ?? null,
          applicant_status: data.status ?? null,
          notes: data.notes ?? null,
          source_page: source,
          whatsapp_status: "not_initiated",
        });
        if (error) throw error;
        break;
      }

      /* ── waitlists → founder_waitlist ── */
      case "waitlist":
      case "founder-waitlist": {
        const { error } = await supabase.from("founder_waitlist").insert({
          name,
          email,
          phone: phoneVal,
          audience: data.audience ?? null,
          opportunity:
            data.opportunity ??
            (type === "founder-waitlist" ? "founder-programs" : "program-waitlist"),
          source_page: source,
        });
        if (error) throw error;
        break;
      }

      /* ── notify / notify-program → notification_subscriptions ── */
      case "notify":
      case "notify-program": {
        const program =
          data.program ??
          (data.chapter ? `chapter-${data.chapter}` : "next-batch");
        const { data: res, error } = await supabase.rpc("notification_subscribe", {
          p_email: email,
          p_program: program,
          p_name: name,
          p_phone: phoneVal,
          p_channel: "email",
          p_source: source,
        });
        if (error) throw error;
        subStatus = res as string;
        break;
      }

      /* ── newsletter → newsletter_subscribers ── */
      case "newsletter": {
        const { data: res, error } = await supabase.rpc("newsletter_subscribe", {
          p_email: email,
          p_name: name,
          p_source: source,
        });
        if (error) throw error;
        subStatus = res as string;
        break;
      }

      /* ── contact enquiry → contact_submissions ── */
      case "enquiry": {
        const { error } = await supabase.from("contact_submissions").insert({
          name,
          email,
          phone: phoneVal,
          subject: data.interest ?? data.subject ?? null,
          message: data.message ?? "",
          source_page: source,
        });
        if (error) throw error;
        break;
      }

      /* ── everything else (brochure, community, lead-magnet) → leads log only ── */
      default:
        break;
    }

    // Central log for every type (community/brochure live only here).
    const { error: logError } = await supabase.from("leads").insert({
      type,
      name,
      email,
      phone: phoneVal,
      payload: { ...data, ...(reference ? { reference } : {}) },
    });
    // The specialised write is the source of truth; only fail the request on
    // the log error for types that have no specialised table.
    if (logError && ["brochure", "community", "lead-magnet"].includes(type)) {
      throw logError;
    }
  } catch (err) {
    console.error(
      `[leads] Supabase write failed for "${type}":`,
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    ...(reference ? { reference } : {}),
    ...(subStatus ? { status: subStatus } : {}),
  });
}
