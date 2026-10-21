import Image from "next/image";
import PageSeoJsonLd from "@/components/PageSeoJsonLd";
import { buildMetadata } from "@/lib/seo";
import Section from "@/components/Section";
import Pillars from "@/components/Pillars";
import FinalCta from "@/components/FinalCta";
import { getAboutPage, getFounder, getSettings } from "@/lib/cms";

export const generateMetadata = () =>
  buildMetadata({
    path: "/about",
    title: "About — the person behind Fundamental",
    description:
      "Anjan Prasad built Fundamental to close two gaps: the employability gap and the founder-literacy gap.",
  });

export default async function AboutPage() {
  const [founder, about, settings] = await Promise.all([
    getFounder(),
    getAboutPage(),
    getSettings(),
  ]);
  const journey = founder.journey;
  const photo = founder.aboutPhoto;
  return (
    <>
      <PageSeoJsonLd path="/about" />
      {/* FOLD 01: THE PERSON BEHIND FUNDAMENTAL */}
      <Section>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="w-full shrink-0 overflow-hidden rounded-2xl shadow-lg lg:w-96">
            {photo && (
              <Image
                src={photo.url}
                alt={`${founder.name}, founder of Fundamental Institute`}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 24rem, 100vw"
                className="h-auto w-full"
                priority
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <p className="overline-label">The person behind Fundamental</p>
            <h1 className="text-4xl font-bold">
              {founder.name.split(" ")[0]}{" "}
              <span className="text-brand">
                {founder.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <div className="max-w-xl space-y-3 text-sm leading-relaxed sm:text-base">
              {founder.aboutParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
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
            {about.problems.map((p) => (
              <div key={p.title} className="card">
                <h3 className="mb-2 text-lg font-bold">{p.title}</h3>
                <p className="mb-2 text-sm font-semibold">{p.lead}</p>
                <p className="text-sm leading-relaxed text-muted">{p.description}</p>
              </div>
            ))}
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
              <div key={j.period} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-brand bg-white" />
                  {i < journey.length - 1 && <div className="w-px flex-1 bg-line" />}
                </div>
                <div className={i < journey.length - 1 ? "pb-8" : ""}>
                  <p className="text-sm font-extrabold tracking-wide text-brand">{j.period}</p>
                  <p className="mt-0.5 text-base font-bold">{j.title}</p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                    {j.description}
                  </p>
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
              {about.values.map((v) => (
                <div key={v.title}>
                  <p className="text-sm font-bold">{v.title}</p>
                  <p className="text-xs text-muted">{v.description}</p>
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
            {about.studioPhotos.length > 0
              ? about.studioPhotos.slice(0, 2).map((p) => (
                  <div key={p.url} className="relative h-40 overflow-hidden rounded-lg">
                    <Image
                      src={p.url}
                      alt={p.alt ?? "Fundamental studio"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              : [1, 2].map((n) => (
                  <div
                    key={n}
                    className="flex h-40 items-center justify-center rounded-lg bg-mist text-xs text-muted"
                  >
                    Studio photo
                  </div>
                ))}
          </div>
          <div className="card md:w-80">
            <h2 className="mb-2 text-lg font-bold">Hinjewadi studio</h2>
            <p className="text-sm text-muted">
              {settings.address}
              <br />
              {settings.hours} · Weekend classes
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
