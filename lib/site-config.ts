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
  whatsappNumber: "+919999999999", // TODO: real number
  whatsappLink: "https://wa.me/919999999999", // TODO: real number
  address: "Hinjewadi Studio, Phase 1, Hinjewadi, Pune 411057", // TODO: confirm
  hours: "Mon–Sat, 9 AM to 6 PM", // TODO: confirm
  replyPromise: "2 working hours",

  socials: {
    instagram: "https://instagram.com/fundamental.institute",
    x: "https://x.com/fundamentalhq",
    youtube: "https://youtube.com/@fundamental-institute",
    linkedin: "https://linkedin.com/company/fundamental-institute",
  },
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
    startDate: "16 Nov 2026",
    seats: 30,
    seatsLeft: 14,
    listPrice: 79999,
    offerPrice: 49999,
    location: "Live online · recordings available",
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
    startDate: "14 Nov 2026",
    seats: 15,
    seatsLeft: 6,
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

export const applicationDeadline = "10 Nov 2026";

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
