import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { discountPct, formatINR } from "@/lib/site-config";
import { getBatches, getFounder, getSettings } from "@/lib/cms";

export const generateMetadata = () =>
  buildMetadata({
    path: "/waitlist",
    title: "Join the waitlist",
    description:
      "Pre-launch waitlist for Fundamental Institute — training first, community, founder programs and the fund to follow.",
  });

/**
 * Pre-launch capture page. Per the wireframe: no nav — logo + WhatsApp only.
 * The root layout still renders the full chrome; this page's own hero is
 * self-sufficient, so it reads correctly either way. (Live 28 Sept – 9 Oct;
 * becomes Home at launch.)
 */
export default async function WaitlistPage() {
  const [batches, founder, settings] = await Promise.all([
    getBatches(),
    getFounder(),
    getSettings(),
  ]);
  const on = batches.online;
  const off = batches.offline;

  return (
    <>
      {/* FOLD 01: HERO + WAITLIST FORM */}
      <Section>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-5">
            <Image src="/logo.svg" alt="Fundamental Institute" width={200} height={40} />
            <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
              Not a course. <span className="text-brand">A career correction.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed">
              Training first: a live Marketing Management program taught from
              the hiring side. The community is open now; founder programs and
              the Perseverance Fund follow.
            </p>
            <p className="text-sm font-semibold">
              First batches: Offline {off.startDate} · Online {on.startDate}
            </p>
          </div>

          <div className="card w-full shrink-0 lg:w-95">
            <h2 className="mb-3 text-lg font-bold">Join the waitlist</h2>
            <LeadForm
              leadType="waitlist"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                {
                  name: "audience",
                  label: "I am a",
                  type: "select",
                  options: [
                    "Graduate",
                    "Working professional",
                    "Career switcher",
                    "Founder",
                    "Other",
                  ],
                  required: true,
                },
              ]}
              submitLabel="Join the waitlist"
            />
            {/* Founders selected here become the Phase 3 founder waitlist */}
          </div>
        </div>
      </Section>

      {/* FOLD 02: PROGRAM SUMMARY + FOUNDER VIDEO */}
      <Section tone="mist">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-3">
            <h2 className="section-title">Marketing Management</h2>
            <p className="text-sm">50 hours · 3 months · Online or Offline</p>
            <p className="text-sm text-muted">
              Online: {on.schedule} · starts {on.startDate}
              <br />
              Offline: {off.schedule} · starts {off.startDate}
            </p>
            <p className="text-sm">
              From <span className="text-muted line-through">{formatINR(on.listPrice)}</span>{" "}
              <span className="text-xl font-bold text-brand">{formatINR(on.offerPrice)}</span>{" "}
              <span className="text-xs text-muted">({discountPct(on)}% off)</span>
            </p>
          </div>
          <VideoPlaceholder label="Founder video" className="w-full lg:w-96" />
        </div>
      </Section>

      {/* FOLD 03: FOUNDER + SOCIAL */}
      <Section>
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-mist text-xs text-muted">
            Anjan
          </div>
          <div>
            <p className="text-lg font-bold">{founder.name}</p>
            <p className="text-sm text-muted">{founder.shortBio}</p>
            <a
              href={settings.whatsappLink}
              className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
            >
              WhatsApp us →
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
