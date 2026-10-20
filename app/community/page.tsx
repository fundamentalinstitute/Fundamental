import type { Metadata } from "next";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Accordion from "@/components/Accordion";
import { communityFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Founders Club",
  description:
    "A free community of founders, working professionals and graduates. City chapters, quarterly meetups, one WhatsApp group that's actually useful.",
};

const chapters = [
  {
    city: "Pune",
    status: "Live" as const,
    head: "Chapter head: Anjan Prasad",
    next: "Next meetup: first meetup soon",
  },
  { city: "Mumbai", status: "Coming" as const, head: "Chapter head: TBA", next: "" },
  { city: "Bengaluru", status: "Coming" as const, head: "Chapter head: TBA", next: "" },
];

const perks = [
  { t: "Meet founders and hiring managers", d: "The room you can't get into on LinkedIn" },
  { t: "Quarterly events in your city", d: "Small, curated, no mic-hogging panels" },
  { t: "First access to founder programs and the fund", d: "Members hear everything first" },
];

export default function CommunityPage() {
  return (
    <>
      {/* FOLD 01: WHAT THE FOUNDERS CLUB IS */}
      <Section>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-4xl font-bold">The Founders Club</h1>
            <p className="max-w-xl text-base leading-relaxed">
              Free to join, and it stays free. City chapters, quarterly meetups
              and a WhatsApp group where real questions get real answers — for
              founders, working professionals and graduates.
            </p>
            <a href="#join" className="btn-primary w-fit">
              Join your chapter
            </a>
          </div>
          <div className="flex h-52 w-full items-center justify-center rounded-lg bg-mist text-xs text-muted lg:w-96">
            Community photo / meetup
          </div>
        </div>
      </Section>

      {/* FOLD 02: CHAPTERS */}
      <Section tone="mist">
        <div className="flex flex-col gap-5">
          <h2 className="section-title">Chapters</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {chapters.map((c) => (
              <div key={c.city} className="card flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">{c.city}</h3>
                  <span className={c.status === "Live" ? "chip-solid" : "chip"}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-muted">{c.head}</p>
                {c.next && <p className="text-xs">{c.next}</p>}
                {c.status === "Live" ? (
                  <a href="#join" className="btn-primary mt-auto px-4 py-2 text-xs">
                    Join this chapter
                  </a>
                ) : (
                  <LeadForm
                    leadType="notify"
                    extra={{ chapter: c.city }}
                    fields={[{ name: "email", label: "Email", type: "email", required: true }]}
                    submitLabel="Notify me for this city"
                    inlineSuccess="Noted — you'll hear when this chapter opens."
                    className="mt-auto"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Member counts shown only once real */}
        </div>
      </Section>

      {/* FOLD 03: JOIN FORM */}
      <Section id="join">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1">
            <h2 className="section-title mb-3">Join the Founders Club</h2>
            <p className="max-w-md text-sm text-muted">
              On submit: WhatsApp group invite, welcome email, and your chapter
              head gets a heads-up.
            </p>
          </div>
          <div className="card w-full lg:max-w-md">
            <LeadForm
              leadType="community"
              fields={[
                { name: "name", label: "Name", required: true },
                {
                  name: "city",
                  label: "City",
                  type: "select",
                  options: ["Pune", "Mumbai", "Bengaluru", "Other"],
                  required: true,
                },
                {
                  name: "role",
                  label: "I am a",
                  type: "select",
                  options: ["Founder", "Professional", "Graduate"],
                  required: true,
                },
                { name: "whatsapp", label: "WhatsApp number", type: "tel", required: true },
              ]}
              submitLabel="Join the Founders Club"
            />
          </div>
        </div>
      </Section>

      {/* FOLD 04: WHAT MEMBERS GET + MEETUPS */}
      <Section tone="mist">
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-3">
            {perks.map((p) => (
              <div key={p.t} className="card">
                <p className="text-sm font-bold">{p.t}</p>
                <p className="mt-1 text-xs text-muted">{p.d}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold">Upcoming meetups</h2>
            <p className="text-sm text-muted">First meetups announced after launch.</p>
          </div>
        </div>
      </Section>

      {/* FOLD 05: FAQ */}
      <Section>
        <div className="max-w-2xl">
          <Accordion items={communityFaq} />
        </div>
      </Section>
    </>
  );
}
