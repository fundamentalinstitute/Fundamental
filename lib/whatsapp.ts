import { siteConfig } from "@/lib/site-config";
import {
  fillWhatsAppTemplate,
  whatsappMessageDefaults,
  whatsappMessageKey,
  type WhatsAppMessageKey,
} from "@/lib/whatsapp-defaults";

/**
 * Builds WhatsApp deep links with prefilled messages. Client-safe.
 *
 * Message wording lives in Sanity (Studio → WhatsApp messages); the server
 * resolves it per submission and ships it back in the /api/leads response.
 * The defaults in lib/whatsapp-defaults.ts are the fallback when Sanity
 * content cannot be loaded.
 *
 * When NEXT_PUBLIC_WHATSAPP_NUMBER is set we use wa.me/<number>?text=…
 * (prefilled message). Otherwise we fall back to the official short link
 * (wa.link/b4aw8s), which opens the right chat but cannot carry a prefill.
 */

export function whatsappUrl(message?: string): string {
  const num = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (num && message) {
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  }
  if (num) return `https://wa.me/${num}`;
  return siteConfig.whatsappLink;
}

type Data = Record<string, string>;

/**
 * Prefilled message for a lead type, built from the submitted details.
 * `templates` are the Sanity-edited messages; omitted, the defaults apply.
 */
export function buildLeadMessage(
  leadType: string,
  data: Data,
  reference?: string,
  templates?: Partial<Record<WhatsAppMessageKey, string>>,
): string | null {
  const key = whatsappMessageKey(leadType, data.mode);
  if (!key) return null;
  const template = templates?.[key]?.trim() || whatsappMessageDefaults[key];
  return fillWhatsAppTemplate(template, {
    name: data.name,
    programName: data.program ?? data.interest,
    batchName: data.mode
      ? data.mode === "offline"
        ? "Offline"
        : "Online"
      : undefined,
    reference,
    schedule: data.schedule,
    startDate: data.start_date,
    location: data.location,
    fee: data.fee ? `₹${Number(data.fee).toLocaleString("en-IN")}` : undefined,
  });
}
