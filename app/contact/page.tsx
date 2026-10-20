import type { Metadata } from "next";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Fundamental Institute. We reply within 2 working hours.",
};

export default function ContactPage() {
  return (
    <Section>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Get in touch</h1>
        <p className="text-sm text-muted">We reply within {siteConfig.replyPromise}.</p>
      </div>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Form (first on mobile per wireframe) */}
        <div className="card w-full lg:max-w-lg">
          <h2 className="mb-3 text-lg font-bold">Enquiry</h2>
          <LeadForm
            leadType="enquiry"
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              {
                name: "interest",
                label: "Interested in",
                type: "select",
                options: [
                  "Marketing Management",
                  "Community",
                  "Founder programs",
                  "Something else",
                ],
                required: true,
              },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]}
            submitLabel="Send enquiry"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="card">
            <p className="text-sm font-bold">WhatsApp</p>
            <p className="text-sm text-muted">{siteConfig.whatsappNumber}</p>
            <a href={siteConfig.whatsappLink} className="btn-primary mt-3 px-4 py-2 text-xs">
              Chat now
            </a>
          </div>
          <div className="card">
            <p className="text-sm font-bold">Email</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-brand hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>
          <div className="card">
            <p className="text-sm font-bold">Hinjewadi studio</p>
            <p className="text-sm text-muted">
              {siteConfig.address} · {siteConfig.hours}
            </p>
          </div>
          <iframe
            title="Fundamental studio on Google Maps"
            src="https://www.google.com/maps?q=Hinjewadi%2C%20Pune&output=embed"
            className="h-56 w-full rounded-lg border border-line"
            loading="lazy"
          />
        </div>
      </div>
    </Section>
  );
}
