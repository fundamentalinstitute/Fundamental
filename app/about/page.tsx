import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Pillars from "@/components/Pillars";
import FinalCta from "@/components/FinalCta";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About — the person behind Fundamental",
  description:
    "Anjan Prasad built Fundamental to close two gaps: the employability gap and the founder-literacy gap.",
};

const journey = [
  {
    when: "2010–2012",
    title: "The Digital Marketing Years",
    what: "Hands-on experience in search, social and display marketing, driving measurable business results across global markets.",
  },
  {
    when: "2012–2018",
    title: "From Strategy to Leadership",
    what: "Worked across leading agencies and global brands, building expertise in digital strategy, consulting, campaign execution and team leadership.",
  },
  {
    when: "2015–2021",
    title: "Bringing Industry into the Classroom",
    what: "Visiting faculty at IMT Ghaziabad, BML Munjal University and IIFT, teaching digital marketing and strategy to future professionals.",
  },
  {
    when: "2018–2025",
    title: "Building Businesses",
    what: "Founded Noboru World and went on to build and advise businesses across marketing, technology and consumer brands.",
  },
  {
    when: "2026",
    title: "Fundamental",
    what: "Bringing industry experience into practical, practitioner-led learning to help graduates build skills they can apply in the real world.",
  },
];

const values = [
  { t: "Practitioners over professors", d: "Everyone who teaches here still does the work" },
  { t: "Accessibility first", d: "Priced and scheduled so working people can actually attend" },
  { t: "Economic impact as the metric", d: "We count careers corrected, not certificates printed" },
];

export default function AboutPage() {
  return (
    <>
      {/* FOLD 01: THE PERSON BEHIND FUNDAMENTAL */}
      <Section>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="w-full shrink-0 overflow-hidden rounded-2xl shadow-lg lg:w-96">
            <Image
              src="/founder/anjan-about.jpg"
              alt="Anjan Prasad, founder of Fundamental Institute"
              width={1341}
              height={2010}
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <p className="overline-label">The person behind Fundamental</p>
            <h1 className="text-4xl font-bold">
              Anjan <span className="text-brand">Prasad</span>
            </h1>
            <div className="max-w-xl space-y-3 text-sm leading-relaxed sm:text-base">
              <p>
                For over a decade, I&apos;ve been on the other side of the
                hiring table — interviewing candidates, advising businesses and
                building as a founder.
              </p>
              <p>
                One interview stayed with me. A bright MBA graduate could
                explain every marketing framework, but struggled when I asked
                her to plan a month of marketing for a café.
              </p>
              <p>
                It wasn&apos;t a question of intelligence or effort. It was the
                gap between knowing the theory and knowing how to apply it.
              </p>
              <p>
                I realised that capable graduates don&apos;t just need more
                information. They need the opportunity to practise, make
                decisions, learn from feedback and build skills they can take
                into a real job.
              </p>
              <p>
                That&apos;s why I built Fundamental: practitioner-led learning
                where the focus isn&apos;t just on what you know, but on what
                you can actually do.
              </p>
              <p>
                Over the years, I&apos;ve also taught as visiting faculty at IMT
                Ghaziabad, BML Munjal University and IIFT — and the same
                pattern showed up in every classroom. Students learn fastest
                when they work on something real, and someone from the industry
                reviews it honestly.
              </p>
              <p>
                So that&apos;s how we run things here. Small batches. Live
                sessions. A real brief every week, with feedback you can act
                on. And one simple promise: we&apos;ll always tell you the
                truth about your work — because the industry will, too.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FOLD 02: THE PROBLEMS WE'RE HERE TO SOLVE */}
      <Section tone="mist">
        <div className="flex flex-col gap-6">
          <h2 className="section-title">
            The problems we&apos;re here to{" "}
            <span className="text-brand">solve</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <h3 className="mb-2 text-lg font-bold">
                The gap between education and employment
              </h3>
              <p className="mb-2 text-sm font-semibold">
                A degree tells the world what you studied. Not what you can do.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Graduates spend years learning concepts, but often get too few
                opportunities to apply them to real-world problems. When
                employers ask for experience, knowing the theory isn&apos;t
                always enough. Fundamental bridges that gap through practical,
                practitioner-led learning.
              </p>
            </div>
            <div className="card">
              <h3 className="mb-2 text-lg font-bold">
                The gap between learning and doing
              </h3>
              <p className="mb-2 text-sm font-semibold">
                You don&apos;t build skills by just listening. You build them by
                doing the work.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Real competence comes from trying, making mistakes, getting
                feedback and trying again. Yet too much learning ends when the
                lesson does. At Fundamental, learners work on practical
                assignments, receive individual feedback and build the
                confidence to apply their skills beyond the classroom.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FOLD 03: ANJAN'S JOURNEY */}
      <Section>
        <div className="flex flex-col gap-8">
          <div>
            <p className="overline-label mb-2">The journey</p>
            <h2 className="section-title">
              Anjan&apos;s <span className="text-brand">journey</span>
            </h2>
          </div>
          <div className="flex flex-col">
            {journey.map((j, i) => (
              <div key={j.when} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-brand bg-white" />
                  {i < journey.length - 1 && <div className="w-px flex-1 bg-line" />}
                </div>
                <div className={i < journey.length - 1 ? "pb-8" : ""}>
                  <p className="text-sm font-extrabold tracking-wide text-brand">{j.when}</p>
                  <p className="mt-0.5 text-base font-bold">{j.title}</p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{j.what}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOLD 04: FOUR PILLARS AND VALUES */}
      <Section tone="mist">
        <div className="flex flex-col gap-10">
          <Pillars heading="One institute, four pillars" />
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">What we believe</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {values.map((v) => (
                <div key={v.t}>
                  <p className="text-sm font-bold">{v.t}</p>
                  <p className="text-xs text-muted">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FOLD 05: THE STUDIO */}
      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid flex-1 grid-cols-2 gap-3">
            <div className="flex h-40 items-center justify-center rounded-lg bg-mist text-xs text-muted">
              Studio photo
            </div>
            <div className="flex h-40 items-center justify-center rounded-lg bg-mist text-xs text-muted">
              Studio photo
            </div>
          </div>
          <div className="card md:w-80">
            <h2 className="mb-2 text-lg font-bold">Hinjewadi studio</h2>
            <p className="text-sm text-muted">
              {siteConfig.address}
              <br />
              {siteConfig.hours} · Weekend classes
            </p>
            <a
              href="https://maps.google.com/?q=Hinjewadi,Pune"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
            >
              Open in Maps →
            </a>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
