import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import PersonalHeading from "@/components/PersonalHeading";
import WhatsAppCta from "@/components/WhatsAppCta";
import { getSettings, type Settings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

/**
 * One template, content by type — a real URL so GA4 / Meta conversion events
 * can fire here. No auto-redirect. Personal names come from sessionStorage
 * (set by LeadForm), never from the URL.
 */
const buildContent = (siteConfig: Settings): Record<
  string,
  {
    heading: string;
    personal?: boolean;
    steps: string;
    ctas: { label: string; href: string; primary?: boolean }[];
  }
> => ({
  counselling: {
    heading: "Got it.",
    personal: true,
    steps: "WhatsApp confirmation → calendar invite → call",
    ctas: [{ label: "Chat on WhatsApp", href: siteConfig.whatsappLink, primary: true }],
  },
  callback: {
    heading: "Got it.",
    personal: true,
    steps: "WhatsApp confirmation → calendar invite → call",
    ctas: [{ label: "Chat on WhatsApp", href: siteConfig.whatsappLink, primary: true }],
  },
  enrol: {
    heading: "Your seat request is in.",
    steps: "Counsellor call → payment link → seat confirmed",
    ctas: [
      { label: "Chat on WhatsApp", href: siteConfig.whatsappLink, primary: true },
      { label: "Read the refund policy", href: "/refund-policy" },
    ],
  },
  brochure: {
    heading: "Your brochure is on its way.",
    steps: "Check WhatsApp and email",
    ctas: [{ label: "View program", href: "/programs/marketing-management", primary: true }],
  },
  community: {
    heading: "Welcome to the Founders Club.",
    steps: "WhatsApp group invite on its way",
    ctas: [
      { label: "Open WhatsApp", href: siteConfig.whatsappLink, primary: true },
      { label: "View program", href: "/programs/marketing-management" },
    ],
  },
  waitlist: {
    heading: "You're on the waitlist.",
    steps: "We'll message you the moment batches open",
    ctas: [{ label: "Chat on WhatsApp", href: siteConfig.whatsappLink, primary: true }],
  },
  "founder-waitlist": {
    heading: "You're on the founder waitlist.",
    steps: "First access when founder programs open",
    ctas: [{ label: "Join the community meanwhile", href: "/community", primary: true }],
  },
  enquiry: {
    heading: "Message received.",
    steps: `We reply within ${siteConfig.replyPromise}`,
    ctas: [{ label: "Chat on WhatsApp", href: siteConfig.whatsappLink, primary: true }],
  },
});

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const content = buildContent(await getSettings());
  const c = content[type ?? ""] ?? content.enquiry;

  return (
    <Section className="min-h-[50vh]">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white">
          ✓
        </div>
        {c.personal ? (
          <PersonalHeading base={c.heading} />
        ) : (
          <h1 className="text-3xl font-bold">{c.heading}</h1>
        )}
        <p className="text-sm text-muted">{c.steps}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {c.ctas.map((cta) =>
            cta.href.startsWith("http") ? (
              <WhatsAppCta
                key={cta.label}
                label={cta.label}
                fallbackHref={cta.href}
                primary={cta.primary}
              />
            ) : (
              <Link key={cta.label} href={cta.href} className={cta.primary ? "btn-primary" : "btn-secondary"}>
                {cta.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </Section>
  );
}
