import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import Accordion from "@/components/Accordion";
import FinalCta from "@/components/FinalCta";
import LeadForm from "@/components/LeadForm";
import { formatINR } from "@/lib/site-config";
import { getBatches, getFaq, getProgram } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Programs with certificate",
  description:
    "Short, live programs that end with a job-ready portfolio, not just a PDF.",
};

const comingSoon = [
  { name: "Business Foundations", meta: "Coming soon · live" },
  { name: "Startup Marketing", meta: "Coming soon · live" },
];

export default async function ProgramsPage() {
  const [batches, program, faq] = await Promise.all([
    getBatches(),
    getProgram(),
    getFaq("home"),
  ]);
  return (
    <>
      {/* FOLD 01: HEADER */}
      <Section>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Programs with certificate</h1>
          <p className="max-w-xl text-base">
            Short, live programs that end with a job-ready portfolio, not just a
            PDF.
          </p>
        </div>
      </Section>

      {/* FOLD 02: CATEGORY TABS */}
      <Section>
        <div className="flex flex-wrap gap-2">
          <span className="chip-solid">Marketing (live)</span>
          <span className="chip">Business (coming)</span>
          <span className="chip">Startup (coming)</span>
        </div>
      </Section>

      {/* FOLD 03: PROGRAM CARDS */}
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card flex flex-col gap-3 border-2 border-brand">
            <div className="flex h-24 items-center justify-center rounded-md bg-mist text-xs text-muted">
              Program image
            </div>
            <h2 className="text-base font-bold">{program.title}</h2>
            <p className="text-xs text-muted">{program.cardPromise}</p>
            <p className="text-xs">
              50 hours · 3 months · Online or Offline · from{" "}
              {formatINR(batches.online.offerPrice)} · Certificate
            </p>
            <span className="chip-solid w-fit">Enrolling now</span>
            <Link
              href="/programs/marketing-management"
              className="btn-primary mt-auto px-4 py-2 text-xs"
            >
              View program
            </Link>
          </div>

          {comingSoon.map((p) => (
            <div key={p.name} className="card flex flex-col gap-3">
              <div className="flex h-24 items-center justify-center rounded-md bg-mist text-xs text-muted">
                Coming soon
              </div>
              <h2 className="text-base font-bold">{p.name}</h2>
              <p className="text-xs text-muted">{p.meta}</p>
              <LeadForm
                leadType="notify-program"
                extra={{ program: p.name }}
                fields={[{ name: "email", label: "Email", type: "email", required: true }]}
                submitLabel="Notify me"
                inlineSuccess="Noted — we'll email you when this opens."
                className="mt-auto"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* FOLD 04: WHY LEARN AT FUNDAMENTAL */}
      <Section tone="mist">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Small batches", d: "15 offline, 30 online" },
            { t: "Taught by a practitioner", d: "From the hiring side" },
            { t: "Internship built in", d: "Top 20% of each batch" },
          ].map((c) => (
            <div key={c.t} className="card">
              <div className="mb-3 h-8 w-8 rounded-md bg-brand/10" aria-hidden />
              <p className="text-sm font-bold">{c.t}</p>
              <p className="text-xs text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FOLD 05: FAQ */}
      <Section>
        <div className="max-w-2xl">
          <Accordion items={faq.slice(0, 4)} variant="cards" />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
