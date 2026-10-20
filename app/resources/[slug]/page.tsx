import type { Metadata } from "next";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import { leadMagnet } from "@/lib/content";

export const metadata: Metadata = {
  title: leadMagnet.title,
  description: "A free, practical PDF — sent to your inbox.",
};

/**
 * Lead magnet template (/resources/[slug]). One magnet for now; becomes a
 * Sanity-driven collection later.
 */
export default function LeadMagnetPage() {
  return (
    <Section>
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-4xl font-bold">{leadMagnet.title}</h1>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {leadMagnet.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="flex h-56 w-44 items-center justify-center rounded-lg border border-line bg-mist text-xs text-muted">
            PDF cover
          </div>
        </div>
        <div className="card w-full md:max-w-md">
          <LeadForm
            leadType="lead-magnet"
            extra={{ resource: leadMagnet.slug }}
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "email", label: "Email", type: "email", required: true },
            ]}
            submitLabel="Send me the PDF"
            inlineSuccess="On its way — check your inbox for the PDF and a welcome email."
          />
        </div>
      </div>
    </Section>
  );
}
