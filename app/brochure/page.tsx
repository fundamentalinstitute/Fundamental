import type { Metadata } from "next";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Get the full syllabus",
  description:
    "The 50-hour curriculum by module, batch schedules and fees, the internship rule and certificate — on WhatsApp within a minute.",
};

export default function BrochurePage() {
  return (
    <Section>
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-4xl font-bold">Get the full syllabus</h1>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>50-hour curriculum by module</li>
            <li>Batch schedules and fees</li>
            <li>Internship rule and certificate</li>
          </ul>
          <div className="flex h-56 w-44 items-center justify-center rounded-lg border border-line bg-mist text-xs text-muted">
            Brochure cover
          </div>
        </div>

        <div className="card w-full md:max-w-md">
          <LeadForm
            leadType="brochure"
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              { name: "email", label: "Email (optional)", type: "email" },
            ]}
            submitLabel="Send me the brochure"
            note="Arrives on WhatsApp within a minute."
          />
        </div>
      </div>
    </Section>
  );
}
