"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      if (!res.ok) throw new Error(await res.text());
      if (inlineSuccess) {
        setDone(true);
      } else {
        // Keep personal data out of the URL; the thank-you page reads this.
        try {
          sessionStorage.setItem("fi_lead_name", data.name ?? "");
        } catch {}
        router.push(`/thank-you?type=${leadType}`);
      }
    } catch {
      setError("Something went wrong. Please try again or ping us on WhatsApp.");
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
