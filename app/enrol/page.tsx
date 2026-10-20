import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import EnrolForm from "@/components/EnrolForm";
import { type BatchMode, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Enrol",
  description: "Pick your batch and request your seat. A counsellor calls you back with the payment link.",
  robots: { index: false }, // never in nav; reached from Enrol buttons
};

const steps = [
  { t: "A counsellor calls", d: `Within ${siteConfig.replyPromise}` },
  { t: "You get a payment link", d: "EMI available" },
  { t: "Seat confirmed on payment", d: "Onboarding arrives on WhatsApp" },
];

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode: BatchMode = mode === "offline" ? "offline" : "online";

  return (
    <Section>
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="w-full lg:max-w-xl">
          <EnrolForm initialMode={initialMode} />
        </div>

        <aside className="flex flex-1 flex-col gap-5">
          <h2 className="text-lg font-bold">What happens next</h2>
          {steps.map((s, i) => (
            <div key={s.t} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-bold">{s.t}</p>
                <p className="text-xs text-muted">{s.d}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted">
            Your seat is held while we process your request ·{" "}
            <Link href="/refund-policy" className="underline hover:text-brand">
              Refund policy
            </Link>
          </p>
          <a href={siteConfig.whatsappLink} className="btn-secondary w-fit">
            Questions? WhatsApp us
          </a>
          {/* Phase 2: this page is replaced by the checkout flow; URL redirects */}
        </aside>
      </div>
    </Section>
  );
}
