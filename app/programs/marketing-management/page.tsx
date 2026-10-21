import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import Accordion from "@/components/Accordion";
import Testimonials from "@/components/Testimonials";
import ComparisonTable from "@/components/ComparisonTable";
import PricingCard from "@/components/PricingCard";
import FinalCta from "@/components/FinalCta";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import CurriculumExplorer from "@/components/CurriculumExplorer";
import { type BatchMode, discountPct, formatINR } from "@/lib/site-config";
import {
  getBatches,
  getCurriculum,
  getFaq,
  getFounder,
  getProgram,
  getSettings,
  getTestimonials,
} from "@/lib/cms";

export const metadata: Metadata = {
  title: "Marketing Management — 50 live hours, 3 months",
  description:
    "Live Marketing Management program in Pune and online. Small batches, weekly real briefs, certificate, internship for the top 20%.",
};

const subnav = [
  { href: "#overview", label: "Overview" },
  { href: "#curriculum", label: "Curriculum" },
  { href: "#instructor", label: "Instructor" },
  { href: "#batches", label: "Batches" },
  { href: "#faqs", label: "FAQs" },
];

export default async function ProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode: BatchMode = mode === "offline" ? "offline" : "online";
  const [settings, batches, program, modules, testimonials, faq, founder] =
    await Promise.all([
      getSettings(),
      getBatches(),
      getProgram(),
      getCurriculum(),
      getTestimonials(),
      getFaq("program"),
      getFounder(),
    ]);

  return (
    <>
      {/* STICKY SUB-NAV */}
      <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-site flex gap-6 overflow-x-auto py-3 text-sm whitespace-nowrap">
          {subnav.map((s) => (
            <a key={s.href} href={s.href} className="text-muted hover:text-brand">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* FOLD 01: PROGRAM HERO + PRICING CARD */}
      <Section id="overview">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xs text-muted">
              <Link href="/" className="hover:text-brand">Home</Link> /{" "}
              <Link href="/programs" className="hover:text-brand">Programs</Link> / Marketing
              Management
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">{program.title}</h1>
            <p className="text-base">{program.promise}</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip">50 hours</span>
              <span className="chip">3 months</span>
              <span className="chip">Live</span>
              <span className="chip">Certificate</span>
              <span className="chip">Internship for the top 20%</span>
            </div>
            <p className="text-sm text-muted">
              Next batch: {batches.online.startDate} (online) · {batches.offline.startDate}{" "}
              (offline)
            </p>
          </div>
          <div className="w-full shrink-0 lg:w-90">
            <PricingCard
              initialMode={initialMode}
              batches={batches}
              whatsappLink={settings.whatsappLink}
            />
          </div>
        </div>
      </Section>

      {/* FOLD 02: WHO THIS IS FOR */}
      <Section tone="mist">
        <div className="flex flex-col gap-5">
          <h2 className="section-title">Who this is for</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {program.personas.map((p) => (
              <div key={p.title} className="card flex flex-col gap-2">
                <h3 className="text-base font-bold">{p.title}</h3>
                <p className="text-xs text-muted">{p.subtitle}</p>
                <p className="text-sm">
                  <span className="font-semibold">You&apos;ll leave with:</span>{" "}
                  {p.leavesWith}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">
            Working professional? The Saturday and Sunday offline batch was built
            for you.
          </p>
        </div>
      </Section>

      {/* FOLD 03: WHAT YOU'LL LEARN */}
      <Section>
        <div className="flex flex-col gap-5">
          <h2 className="section-title">What you&apos;ll learn</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {program.outcomes.map((o) => (
              <div key={o} className="card flex flex-col gap-2 p-4">
                <div className="h-7 w-7 rounded-md bg-brand/10" aria-hidden />
                <p className="text-sm leading-snug">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOLD 04: CURRICULUM */}
      <Section tone="mist" id="curriculum">
        <div className="flex flex-col gap-5">
          <CurriculumExplorer
            modules={modules}
            overline={program.curriculumOverline}
            heading={program.curriculumHeading}
            intro={program.curriculumIntro}
          />
          <Link href="/brochure" className="text-sm font-semibold text-brand hover:underline">
            → Download the full syllabus
          </Link>
        </div>
      </Section>

      {/* FOLD 05: HOW THE 3 MONTHS RUN */}
      <Section>
        <div className="flex flex-col gap-5">
          <h2 className="section-title">How the 3 months run</h2>
          <div className="flex flex-col gap-4">
            {[
              ["Weeks 1 to 12", "Live classes on your mode's schedule"],
              ["Weekly", "A real brief, reviewed"],
              ["Every 2 weeks", "1:1 mentoring check-in"],
              ["Weeks 10 to 12", "Capstone campaign"],
              ["After", "Internship for the top 20%"],
            ].map(([when, what]) => (
              <div key={when} className="flex items-baseline gap-4">
                <p className="w-32 shrink-0 text-sm font-bold text-brand">{when}</p>
                <p className="border-l border-line pl-4 text-sm">{what}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOLD 06: THE INTERNSHIP RULE */}
      <Section tone="mist">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="section-title">The internship rule</h2>
          <p className="text-sm leading-relaxed">{program.internshipRule}</p>
          <p className="text-xs text-muted italic">
            Phrased as &ldquo;earn&rdquo;, never as a guarantee for everyone — on
            purpose.
          </p>
        </div>
      </Section>

      {/* FOLD 07: YOUR INSTRUCTOR */}
      <Section id="instructor">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <div className="flex h-40 w-44 shrink-0 items-center justify-center rounded-lg bg-mist text-xs text-muted">
            Photo: Anjan
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-xl font-bold">Your instructor</h2>
            <p className="max-w-xl text-sm leading-relaxed">{founder.homeBlurb}</p>
            <Link href="/about" className="text-sm font-semibold text-brand hover:underline">
              → About Anjan
            </Link>
          </div>
          <VideoPlaceholder label="Founder video" className="w-full shrink-0 lg:w-72" />
        </div>
      </Section>

      {/* FOLD 08: BATCHES */}
      <Section tone="mist" id="batches">
        <div className="flex flex-col gap-6">
          <h2 className="section-title">Batches</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["online", "offline"] as const).map((m) => {
              const b = batches[m];
              return (
                <div key={m} className="card flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{b.label}</h3>
                    <div className="text-right">
                      <span className="text-xs text-muted line-through">
                        {formatINR(b.listPrice)}
                      </span>{" "}
                      <span className="text-lg font-bold text-brand">
                        {formatINR(b.offerPrice)}
                      </span>
                      <p className="text-xs text-muted">{discountPct(b)}% off</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    {b.schedule} · starts {b.startDate} · {b.seats} seats
                  </p>
                  <p className="text-xs text-muted">{b.location}</p>
                  <p className="text-xs text-muted">Includes: {b.includes.join(", ")}</p>
                  <Link href={`/enrol?mode=${m}`} className="btn-primary mt-auto">
                    Enrol {b.label}
                  </Link>
                </div>
              );
            })}
          </div>
          <ComparisonTable />
        </div>
      </Section>

      {/* FOLD 09: CERTIFICATE */}
      <Section>
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="flex h-44 w-full shrink-0 items-center justify-center rounded-lg border border-line bg-mist text-xs text-muted md:w-72">
            Certificate mock-up
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="section-title">Your certificate</h2>
            <p className="max-w-md text-sm leading-relaxed">
              {program.certificateText}
            </p>
          </div>
        </div>
      </Section>

      {/* FOLD 10: TESTIMONIALS */}
      <Section tone="mist">
        <Testimonials heading="What earlier mentees say" items={testimonials} />
      </Section>

      {/* FOLD 11: PROGRAM FAQS */}
      <Section id="faqs">
        <div className="flex flex-col gap-5">
          <h2 className="section-title">Program FAQs</h2>
          <div className="max-w-2xl">
            <Accordion items={faq} variant="cards" />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
