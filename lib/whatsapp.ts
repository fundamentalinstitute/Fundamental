import { siteConfig } from "@/lib/site-config";

/**
 * Builds WhatsApp deep links with prefilled messages. Client-safe.
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

export const communityJoinMessage = `Hi Fundamentals Institute Team!

I'd love to join the Fundamentals Institute community and learn more about the Founders Club, city chapters, and quarterly meetups.

Please share the details on how I can join.

Thank you!`;

type Data = Record<string, string>;

/** Prefilled message per lead type, built from the actual submitted details. */
export function buildLeadMessage(
  leadType: string,
  data: Data,
  reference?: string,
): string | null {
  const name = data.name ? ` My name is ${data.name}.` : "";
  switch (leadType) {
    case "counselling":
    case "callback": {
      const interest = data.interest ? ` I'm interested in ${data.interest}.` : "";
      const slot =
        data.preferred_day && data.time_slot
          ? ` Preferred time: ${data.preferred_day}, ${data.time_slot}.`
          : "";
      return `Hi Fundamentals Institute Team! I just requested free counselling on your website.${name}${interest}${slot} Please confirm my counselling call. Thank you!`;
    }
    case "enrol": {
      const program = data.program ?? "Marketing Management";
      const batch = data.mode === "offline" ? "Offline" : "Online";
      const details = [
        data.schedule && `Schedule: ${data.schedule}`,
        data.start_date && `Start date: ${data.start_date}`,
        data.location && `Location: ${data.location}`,
        data.fee && `Fee: ₹${Number(data.fee).toLocaleString("en-IN")}`,
        reference && `Application ref: ${reference}`,
      ]
        .filter(Boolean)
        .join(" · ");
      return `Hi Fundamentals Institute Team! I just applied for the ${program} program (${batch} batch) on your website.${name} ${details}. Please share the next steps and payment link. Thank you!`;
    }
    case "brochure":
      return `Hi Fundamentals Institute Team! I just requested the program brochure on your website.${name} Please send it over. Thank you!`;
    case "community":
      return communityJoinMessage;
    default:
      return null;
  }
}
