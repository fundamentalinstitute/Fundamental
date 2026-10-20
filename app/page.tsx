import { existsSync } from "fs";
import path from "path";
import Link from "next/link";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Accordion from "@/components/Accordion";
import ComparisonTable from "@/components/ComparisonTable";
import FounderCarousel from "@/components/FounderCarousel";
import FounderVideo from "@/components/FounderVideo";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import Pillars from "@/components/Pillars";
import FinalCta from "@/components/FinalCta";
import {
  applicationDeadline,
  batches,
  discountPct,
  emiFrom,
  formatINR,
  proofStats,
  siteConfig,
} from "@/lib/site-config";
import { homeFaq } from "@/lib/content";

export default function HomePage() {
  const on = batches.online;
  const off = batches.offline;
  // Founder video activates automatically once the file is dropped in place.
  const founderVideoReady = existsSync(
    path.join(process.cwd(), "public", "founder", "intro.mp4"),
  );

  return (
    <>
      {/* FOLD 01: HERO + CALLBACK FORM */}
      <Section>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-5">
            <span className="w-fit rounded-full border border-brand bg-mist px-4 py-1.5 text-xs font-bold tracking-wide text-brand">
              ◦ LIVE PROGRAM + CERTIFICATE
            </span>
            <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
              Not a course.
              <br />
              <span className="text-brand">A career correction.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed">
              For graduates, career switchers and working professionals who were
              taught the subject but never the job — 50 live hours that end in
              work you can show a hiring panel.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-brand" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                3 Months
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-brand" aria-hidden>
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                </svg>
                50 Live Hours
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-brand" aria-hidden>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Online &amp; Offline (Pune)
              </span>
            </div>
            <p className="text-sm font-bold text-amber-700">
              ⏳ Applications close {applicationDeadline} · Only {off.seatsLeft} offline
              seats left
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/enrol" className="btn-primary">
                Enrol now
              </Link>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-2xl bg-brand p-6 shadow-xl shadow-brand/25 lg:w-95">
            <h2 className="mb-3 text-lg font-bold text-white">Get free counselling</h2>
            <LeadForm
              variant="dark"
              leadType="counselling"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                {
                  name: "interest",
                  label: "Interested in",
                  type: "select",
                  options: [
                    "Marketing Management",
                    "Business Foundations (coming soon)",
                    "Startup Marketing (coming soon)",
                  ],
                  required: true,
                },
              ]}
              submitLabel="Talk to a counsellor"
              note={`We reply on WhatsApp within ${siteConfig.replyPromise}. Prefer to pick a time? Go to counselling.`}
            />
          </div>
        </div>
      </Section>

      {/* FOLD 02: MEET THE FOUNDER — trust first for a new brand */}
      <Section tone="mist">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <FounderCarousel className="h-64 w-full shrink-0 lg:h-72 lg:w-96" />
          <div className="flex flex-1 flex-col gap-3">
            <p className="overline-label">The founder</p>
            <h2 className="text-xl font-bold">
              Meet Anjan Prasad, <span className="text-brand">founder</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed">
              Ten-plus years on the hiring side of the table — as interviewer,
              consultant and founder. Anjan built Fundamental after watching
              hundreds of capable graduates lose offers for skills no one had
              ever shown them.
            </p>
            <Link href="/about" className="text-sm font-semibold text-brand hover:underline">
              → Read Anjan&apos;s story
            </Link>
          </div>
          {founderVideoReady ? (
            <FounderVideo
              label="Why I built Fundamental"
              className="w-full shrink-0 lg:w-80"
            />
          ) : (
            <VideoPlaceholder
              label="Why I built Fundamental"
              className="w-full shrink-0 lg:w-80"
            />
          )}
        </div>
      </Section>

      {/* COHORT DETAILS TABLE */}
      <Section>
        <div className="flex flex-col gap-5">
          <div>
            <p className="overline-label mb-2">Upcoming batches</p>
            <h2 className="section-title">
              Cohort <span className="text-brand">details</span>
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-xs">
            <table className="w-full min-w-150 border-collapse text-sm">
              <thead>
                <tr className="bg-brand text-left text-white">
                  <th className="px-4 py-3 font-semibold">Batch type</th>
                  <th className="px-4 py-3 font-semibold">Schedule</th>
                  <th className="px-4 py-3 font-semibold">Batch starts</th>
                  <th className="px-4 py-3 font-semibold">Capacity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {[on, off].map((b) => (
                  <tr key={b.mode} className="border-t border-line">
                    <td className="px-4 py-4">
                      <span className="font-bold">{b.label}</span>{" "}
                      <span className="text-muted">
                        {b.mode === "online" ? "(Mon, Wed, Fri)" : "(Sat, Sun) · Hinjewadi"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {b.mode === "online" ? "8:30 – 10 PM" : "2 – 4 PM"}
                    </td>
                    <td className="px-4 py-4">{b.startDate}</td>
                    <td className="px-4 py-4 font-bold text-amber-700">
                      Only {b.seatsLeft} left
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/enrol?mode=${b.mode}`}
                        className="btn-primary px-4 py-2 text-xs"
                      >
                        Apply now
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* FOLD 03: THE PROGRAM AT A GLANCE */}
      <Section tone="mist">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-4">
            <p className="overline-label">The program</p>
            <h2 className="text-3xl font-bold">
              Marketing <span className="text-brand">Management</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="chip">50 hours</span>
              <span className="chip">3 months</span>
              <span className="chip">Live</span>
              <span className="chip">Certificate</span>
              <span className="chip">Internship for the top 20%</span>
            </div>
            <p className="text-sm leading-relaxed sm:text-base">
              One live program that takes you from any background to job-ready
              marketer — taught from the hiring side of the table.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/programs/marketing-management" className="btn-primary">
                View full program
              </Link>
              <Link href="/brochure" className="btn-secondary">
                Download brochure
              </Link>
              <a href={siteConfig.whatsappLink} className="btn-outline">
                WhatsApp
              </a>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-105">
            <h3 className="text-lg font-bold">Choose your batch</h3>

            {/* Featured: Online */}
            <div className="relative mt-2 rounded-2xl bg-brand p-5 text-white shadow-lg shadow-brand/25">
              <span className="absolute -top-3 left-5 rounded-full border border-brand bg-white px-3 py-0.5 text-[10px] font-extrabold tracking-widest text-brand">
                MOST POPULAR
              </span>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold">Online</p>
                  <p className="mt-1 text-xs text-white/75">
                    {on.schedule} · Starts {on.startDate} · {on.seatsLeft} seats left
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60 line-through">{formatINR(on.listPrice)}</p>
                  <p className="text-xl font-bold">{formatINR(on.offerPrice)}</p>
                  <p className="text-xs text-white/60">{discountPct(on)}% off</p>
                </div>
              </div>
              <Link
                href="/enrol?mode=online"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-bold text-brand transition-colors hover:bg-light"
              >
                Enrol Online
              </Link>
            </div>

            {/* Offline */}
            <div className="rounded-2xl border-2 border-brand bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold">
                    Offline{" "}
                    <span className="text-[10px] font-extrabold tracking-widest text-brand">
                      · HINJEWADI, PUNE
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {off.schedule} · Starts {off.startDate} · {off.seatsLeft} seats left
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted line-through">{formatINR(off.listPrice)}</p>
                  <p className="text-xl font-bold text-brand">{formatINR(off.offerPrice)}</p>
                  <p className="text-xs text-muted">{discountPct(off)}% off</p>
                </div>
              </div>
              <Link href="/enrol?mode=offline" className="btn-primary mt-4 w-full">
                Enrol Offline
              </Link>
            </div>

            <p className="text-xs text-muted">EMI from {formatINR(emiFrom)}/month.</p>
          </div>
        </div>
      </Section>

      {/* FOLD 04: WHY FUNDAMENTAL EXISTS */}
      <Section>
        <div className="flex flex-col gap-5">
          <div>
            <p className="overline-label mb-2">The problem</p>
            <h2 className="section-title">
              Why Fundamental <span className="text-brand">exists</span>
            </h2>
          </div>
          <p className="text-base">
            You have a degree. But are you ready for the job?
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <h3 className="mb-2 text-base font-bold">What college prepared you for</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Passing exams and understanding concepts</li>
                <li>Learning from textbooks and theoretical examples</li>
                <li>Studying how things work, without always doing the work yourself</li>
                <li>Earning a degree that gets you to the starting line</li>
              </ul>
            </div>
            <div className="card bg-mist">
              <h3 className="mb-2 text-base font-bold">What the industry expects from you</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Skills you can apply to real-world problems</li>
                <li>Experience turning knowledge into actual work</li>
                <li>The ability to solve problems, make decisions and adapt</li>
                <li>Proof of what you can do, not just what you have studied</li>
              </ul>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {/* Stat 1 — unemployment */}
            <div className="relative overflow-hidden rounded-lg border border-line bg-gradient-to-br from-white via-white to-mist p-5 shadow-sm">
              <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                {/* briefcase-x icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-brand"
                  aria-hidden
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  <path d="m14.5 12.5 4 4m0-4-4 4" />
                </svg>
              </div>
              <p className="font-display text-3xl font-bold text-brand">39 in 100</p>
              <p className="mt-1 pr-14 text-sm leading-snug text-brand-ink">
                young graduates under age 25 are <strong>unemployed</strong>
              </p>
              <div className="mt-3 mb-2 h-0.5 w-8 bg-brand" />
              <a
                href="https://azimpremjiuniversity.edu.in/media/resources/SWI/SWI-2026/Executive-Summary_SWI2026-16-March.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-brand"
              >
                Source: Azim Premji University,{" "}
                <em>State of Working India 2026</em>
              </a>
            </div>

            {/* Stat 2 — underemployment */}
            <div className="relative overflow-hidden rounded-lg border border-line bg-gradient-to-br from-white via-white to-mist p-5 shadow-sm">
              <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                {/* graduation-cap-x icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-brand"
                  aria-hidden
                >
                  <path d="m2 9 10-4.5L22 9l-10 4.5L2 9Z" />
                  <path d="M6 11v4.5c0 1 2.7 2.5 6 2.5" />
                  <path d="m15.5 14.5 4 4m0-4-4 4" />
                </svg>
              </div>
              <p className="font-display text-3xl font-bold text-brand">46 in 100</p>
              <p className="mt-1 pr-14 text-sm leading-snug text-brand-ink">
                working graduates are in jobs that{" "}
                <strong>may not require a degree</strong>
              </p>
              <div className="mt-3 mb-2 h-0.5 w-8 bg-brand" />
              <a
                href="https://rsisinternational.org/journals/ijriss/articles/unemployment-after-higher-education-in-india-a-statistical-analysis/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-brand"
              >
                Source: RSIS International —{" "}
                <em>Unemployment after Higher Education in India</em>
              </a>
            </div>
          </div>
          <Link href="/programs/marketing-management" className="text-sm font-semibold text-brand hover:underline">
            → View full program
          </Link>
        </div>
      </Section>

      {/* FOLD 05: HOW THE 3 MONTHS RUN */}
      <Section tone="mist">
        <div className="flex flex-col gap-6">
          <div>
            <p className="overline-label mb-2">The method</p>
            <h2 className="section-title">
              How your 3 months at Fundamental{" "}
              <span className="text-brand">work</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: 1,
                t: "Learn from practitioners",
                d: "Live sessions led by people who have done the work. Small batches, personal attention.",
              },
              {
                n: 2,
                t: "Put your skills to work",
                d: "Solve practical assignments and work through real-world briefs. Get feedback on every submission.",
              },
              {
                n: 3,
                t: "Get personal guidance",
                d: "Regular one-on-one check-ins to review your progress, work through challenges and improve.",
              },
              {
                n: 4,
                t: "Earn an internship opportunity",
                d: "The top 20% of learners get the opportunity to intern for up to 4 months.",
              },
            ].map((s) => (
              <div key={s.n} className="flex flex-col gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </div>
                <p className="text-sm font-bold">{s.t}</p>
                <p className="text-xs text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOLD 06: PROOF NUMBERS — hidden until stats are verified (from config) */}
      {proofStats.length > 0 && (
        <Section tone="mist">
          <div className="grid gap-6 sm:grid-cols-2">
            {proofStats.map((s) => (
              <div key={s.value}>
                <p className="font-display text-4xl font-bold text-brand">{s.value}</p>
                <p className="text-sm text-muted">{s.caption}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FOLD 07: TESTIMONIALS — removed until batch 1 graduates (real quotes only) */}

      {/* FOLD 08: THE INSTITUTE, FOUR PILLARS */}
      <Section>
        <p className="overline-label mb-2">The institute</p>
        <Pillars heading="One institute, four pillars" />
      </Section>

      {/* FOLD 09: ONLINE VS OFFLINE */}
      <Section tone="mist">
        <div className="flex flex-col gap-5">
          <div>
            <p className="overline-label mb-2">Compare modes</p>
            <h2 className="section-title">
              Online vs <span className="text-brand">Offline</span>
            </h2>
          </div>
          <ComparisonTable />
        </div>
      </Section>

      {/* FOLD 10: FAQ */}
      <Section>
        <div className="flex flex-col gap-5">
          <div>
            <p className="overline-label mb-2">FAQ</p>
            <h2 className="section-title">
              Questions people ask <span className="text-brand">before they enrol</span>
            </h2>
          </div>
          <div className="max-w-2xl">
            <Accordion items={homeFaq} variant="cards" />
          </div>
          <a
            href={siteConfig.whatsappLink}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Have a different question? Ask on WhatsApp →
          </a>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
