"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildLeadMessage, whatsappUrl } from "@/lib/whatsapp";

export interface LeadField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface LeadFormProps {
  leadType: string; // counselling | enrol | brochure | community | waitlist | enquiry | notify | newsletter | notify-program | founder-waitlist
  fields: LeadField[];
  submitLabel: string;
  note?: string;
  /** Inline success message instead of redirecting to /thank-you */
  inlineSuccess?: string;
  /** Extra data merged into the payload (e.g. preselected batch mode) */
  extra?: Record<string, string>;
  /** Open WhatsApp with a prefilled message AFTER the record is saved */
  openWhatsApp?: boolean;
  /** "dark" renders labels/button for a brand-green card background */
  variant?: "light" | "dark";
  className?: string;
}

/** Letters, spaces and basic name punctuation only. */
function sanitizeName(v: string) {
  return v.replace(/[^A-Za-z .'’-]/g, "");
}

/** Digits only, max 10 (Indian mobile number without country code). */
function sanitizePhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 10);
}

const isNameField = (f: LeadField) => f.name === "name";
const isPhoneField = (f: LeadField) => f.type === "tel";

export default function LeadForm({
  leadType,
  fields,
  submitLabel,
  note,
  inlineSuccess,
  extra,
  openWhatsApp,
  variant = "light",
  className,
}: LeadFormProps) {
  const dark = variant === "dark";
  const labelCls = dark
    ? "block text-xs font-medium text-white/80"
    : "field-label";

  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const data: Record<string, string> = { ...extra };
    form.forEach((v, k) => (data[k] = String(v)));
    // Store phone numbers with the default India country code.
    for (const f of fields) {
      if (isPhoneField(f) && data[f.name]) data[f.name] = `+91${data[f.name]}`;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: leadType, data }),
      });
      let resBody: { reference?: string; whatsapp_message?: string } = {};
      if (!res.ok) {
        let message = "";
        try {
          const j = await res.json();
          message = j?.error ?? "";
          // Surface the server's diagnostic detail so failures are debuggable
          // from the page itself (no personal data in it).
          if (j?.detail) message += ` [${j.detail}${j.supabase_host ? ` · ${j.supabase_host}` : ""}]`;
        } catch {}
        throw new Error(message || "Request failed");
      }
      try {
        resBody = await res.json();
      } catch {}

      // WhatsApp opens ONLY after the database save above succeeded. The
      // thank-you page shows a visible "Open WhatsApp" fallback (fi_wa_url)
      // in case the popup is blocked — the saved record is never lost.
      // Prefer the server-resolved (Sanity-edited) message; fall back to the
      // local defaults so WhatsApp links work even if the CMS was unreachable.
      const msg =
        resBody.whatsapp_message ?? buildLeadMessage(leadType, data, resBody.reference);
      if (msg) {
        const url = whatsappUrl(msg);
        try {
          sessionStorage.setItem("fi_wa_url", url);
        } catch {}
        if (openWhatsApp) {
          try {
            window.open(url, "_blank", "noopener,noreferrer");
          } catch {}
        }
      } else {
        try {
          sessionStorage.removeItem("fi_wa_url");
        } catch {}
      }

      if (inlineSuccess) {
        setDone(true);
      } else {
        // Keep personal data out of the URL; the thank-you page reads this.
        try {
          sessionStorage.setItem("fi_lead_name", data.name ?? "");
        } catch {}
        router.push(`/thank-you?type=${leadType}`);
      }
    } catch (err) {
      const msg = err instanceof Error && err.message !== "Request failed" ? err.message : "";
      setError(
        msg || "Something went wrong. Please try again or ping us on WhatsApp.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (done && inlineSuccess) {
    return (
      <div className={className}>
        <p className="rounded-md bg-mist px-4 py-3 text-sm font-medium text-brand">
          {inlineSuccess}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-3 ${className ?? ""}`}>
      {/* Honeypot: hidden from people, tempting to bots. Server drops leads where it's filled. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {fields.map((f) => (
        <label key={f.name} className={labelCls}>
          {f.label}
          {f.type === "select" ? (
            <select name={f.name} required={f.required} className="field-input" defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={4}
              className="field-input h-auto py-2"
            />
          ) : isPhoneField(f) ? (
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-line bg-mist px-3 text-sm text-brand-ink">
                +91
              </span>
              <input
                name={f.name}
                type="tel"
                required={f.required}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter a 10-digit mobile number"
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.value = sanitizePhone(el.value);
                }}
                className="field-input mt-0 rounded-l-none"
              />
            </div>
          ) : isNameField(f) ? (
            <input
              name={f.name}
              type="text"
              required={f.required}
              placeholder={f.placeholder ?? f.label}
              pattern="[A-Za-z .'’-]+"
              title="Letters only — numbers are not allowed in a name"
              onInput={(e) => {
                const el = e.currentTarget;
                el.value = sanitizeName(el.value);
              }}
              className="field-input"
            />
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder ?? f.label}
              className="field-input"
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        disabled={busy}
        className={
          dark
            ? "inline-flex cursor-pointer items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-bold text-brand transition-colors hover:bg-light disabled:opacity-60"
            : "btn-primary disabled:opacity-60"
        }
      >
        {busy && (
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {busy ? "Sending…" : submitLabel}
      </button>
      {error && (
        <p className={dark ? "text-xs text-red-200" : "text-xs text-red-600"}>{error}</p>
      )}
      {note && (
        <p className={dark ? "text-xs text-white/70 italic" : "text-xs text-muted italic"}>
          {note}
        </p>
      )}
    </form>
  );
}
