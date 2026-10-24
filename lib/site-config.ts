/**
 * Central site config.
 * Every number, date and seat count the wireframes mark "(from config)" lives
 * here. In production this moves to Supabase (settings table) or Sanity so
 * the team can edit it without a deploy.
 */

export const siteConfig = {
  name: "Fundamental",
  domain: "fundamental.institute",
  email: "hello@fundamental.institute",
  // Digits-only number (with country code) used to prefill WhatsApp messages
  // via wa.me. Set NEXT_PUBLIC_WHATSAPP_NUMBER to the number behind wa.link/b4aw8s.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  // Official short link — used as-is when no number is configured.
  whatsappLink: process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "https://wa.link/b4aw8s",
  address: "Hinjewadi Studio, Phase 1, Hinjewadi, Pune 411057", // TODO: confirm
  hours: "Mon–Sat, 9 AM to 6 PM", // TODO: confirm
  replyPromise: "2 working hours",

  // Social links will come from the CMS later; nothing renders them for now.
};

export type BatchMode = "online" | "offline";

export interface Batch {
  mode: BatchMode;
  label: string;
  schedule: string;
  startDate: string;
  seats: number;
  seatsLeft: number;
  listPrice: number;
  offerPrice: number;
  location: string;
  includes: string[];
}

export const batches: Record<BatchMode, Batch> = {
  online: {
    mode: "online",
    label: "Online",
    schedule: "Mon, Wed, Fri, 8:30 to 10 PM",
    startDate: "7 Dec 2026",
    seats: 30,
    seatsLeft: 25,
    listPrice: 79999,
    offerPrice: 49999,
    location: "Live online",
    includes: [
      "Same 50-hour live curriculum",
      "Mentoring",
      "Certificate",
      "Internship eligibility",
    ],
  },
  offline: {
    mode: "offline",
    label: "Offline",
    schedule: "Sat and Sun, 2 to 4 PM",
    startDate: "5 Dec 2026",
    seats: 15,
    seatsLeft: 13,
    listPrice: 89999,
    offerPrice: 59999,
    location: "Hinjewadi, Pune",
    includes: [
      "Same 50-hour live curriculum",
      "Mentoring",
      "Certificate",
      "Internship eligibility",
      "In-person mock interviews",
    ],
  },
};

export const emiFrom = 4999;

export const applicationDeadline = "1 Dec 2026";

export function discountPct(b: Batch) {
  const pct = Math.round((1 - b.offerPrice / b.listPrice) * 1000) / 10;
  return Number.isInteger(pct) ? pct.toFixed(0) : pct.toFixed(1);
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/** Proof stats — the wireframe says: hide this fold until the numbers are verified. */
export const proofStats: { value: string; caption: string }[] = [
  // { value: "120+", caption: "learners mentored into marketing roles" },
  // { value: "92%", caption: "of batch 1 finished every live session" },
];

export const announcement = `Offline batch starts ${batches.offline.startDate}, Online batch starts ${batches.online.startDate}. ${batches.offline.seatsLeft} and ${batches.online.seatsLeft} seats left.`;
