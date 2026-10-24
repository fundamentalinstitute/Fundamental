/**
 * Default prefilled WhatsApp messages per form type. Used as Sanity initial
 * values and as the fallback whenever CMS content cannot be loaded, so
 * WhatsApp links always work. Editable in Sanity Studio → WhatsApp messages.
 *
 * Supported placeholders (replaced with the visitor's actual form values,
 * removed gracefully when a value is missing):
 *   {{name}} {{programName}} {{batchName}} {{reference}}
 *   {{schedule}} {{startDate}} {{location}} {{fee}}
 */

export type WhatsAppMessageKey =
  | "counselling"
  | "enrolOnline"
  | "enrolOffline"
  | "brochure"
  | "community"
  | "contact"
  | "waitlist"
  | "notify";

export const whatsappMessageDefaults: Record<WhatsAppMessageKey, string> = {
  counselling:
    "Hi, I've submitted a counselling enquiry through the Fundamentals Institute website. I'd appreciate more information about the counselling process and the next steps. Thank you.",
  enrolOnline:
    "Hi, I'm interested in enrolling at Fundamentals Institute. Could you please share more details about the available programs, upcoming batches, and the enrolment process? Thank you.",
  enrolOffline:
    "Hi, I'm interested in enrolling at Fundamentals Institute. Could you please share more details about the available programs, upcoming batches, and the enrolment process? Thank you.",
  brochure:
    "Hi, I'd like to learn more about the programs offered by Fundamentals Institute. Could you please share the relevant brochure and additional details? Thank you.",
  community:
    "Hi, I've registered my interest in the Fundamentals Institute community. I'd appreciate more information about the community and how I can participate. Thank you.",
  contact:
    "Hi, I've submitted an enquiry through the Fundamentals Institute website regarding my query. Could you please help me with the relevant information? Thank you.",
  waitlist:
    "Hi, I'm interested in this program and have registered for updates. Please let me know when the next batch opens for registration. Thank you.",
  notify:
    "Hi, I'm interested in this program and have registered for updates. Please let me know when the next batch opens for registration. Thank you.",
};

/** Maps a lead type (plus batch mode for enrolments) to its message key. */
export function whatsappMessageKey(
  leadType: string,
  mode?: string,
): WhatsAppMessageKey | null {
  switch (leadType) {
    case "counselling":
    case "callback":
      return "counselling";
    case "enrol":
      return mode === "offline" ? "enrolOffline" : "enrolOnline";
    case "brochure":
      return "brochure";
    case "community":
      return "community";
    case "enquiry":
      return "contact";
    case "waitlist":
    case "founder-waitlist":
      return "waitlist";
    case "notify":
    case "notify-program":
      return "notify";
    default:
      return null; // e.g. newsletter — never a WhatsApp flow
  }
}

/**
 * Replaces {{placeholder}} tokens with values; unknown or missing values are
 * removed, and leftover doubled spaces are tidied so the message stays clean.
 */
export function fillWhatsAppTemplate(
  template: string,
  values: Record<string, string | undefined>,
): string {
  return template
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => values[key]?.trim() ?? "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([.,!?])/g, "$1")
    .trim();
}
