import type { Metadata } from "next";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Accordion from "@/components/Accordion";
import { getFaq, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Talk to a counsellor, free",
  description:
    "A free 30-minute call about fit, mode, fees and EMI, and your next steps. We confirm on WhatsApp and send a calendar invite.",
};

const steps = [
  { t: "WhatsApp confirmation", d: "We confirm your slot" },
  { t: "Calendar invite", d: "Google Calendar, with the call link" },
  { t: "30-minute call", d: "Fit, mode, fees and EMI, next steps" },
];

export default async function CounsellingPage() {
  const [settings, faq] = await Promise.all([getSettings(), getFaq("counselling")]);
  return (
    <>
      {/* FOLD 01: INTRO + INTAKE FORM */}
      <Section>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Talk to a counsellor, free</h1>
          <p className="max-w-2xl text-base">
            Thirty minutes on whether the program fits you, which mode suits
            your week, and exactly what the fees and EMI look like. No pressure,
            no scripts. We reply within {settings.replyPromise}.
          </p>

          <div className="mt-4 flex flex-col gap-10 lg:flex-row">
            <div className="card w-full lg:max-w-lg">
              <h2 className="mb-3 text-lg font-bold">Request a call</h2>
              <LeadForm
                leadType="counselling"
                fields={[
                  { name: "name", label: "Name", required: true },
                  { name: "phone", label: "Phone", type: "tel", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  {
                    name: "situation",
                    label: "Current situation",
                    type: "select",
                    options: ["Graduate", "Working", "Switching careers", "Parent"],
                    required: true,
                  },
                  { name: "question", label: "Your main question" },
                  {
                    name: "preferred_day",
                    label: "Preferred day",
                    type: "select",
                    options: ["This week", "Next week"],
                    required: true,
                  },
                  {
                    name: "time_slot",
                    label: "Preferred time slot",
                    type: "select",
                    options: ["10 AM – 12 PM", "12 – 3 PM", "3 – 6 PM", "6 – 8 PM"],
                    required: true,
                  },
                ]}
                submitLabel="Request my call"
                note="We confirm on WhatsApp and send a Google Calendar invite."
              />
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <h2 className="text-lg font-bold">What happens next</h2>
              {steps.map((s, i) => (
                <div key={s.t} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.t}</p>
                    <p className="text-xs text-muted">{s.d}</p>
                  </div>
                </div>
              ))}
              <div className="flex h-32 items-center justify-center rounded-lg bg-mist text-xs text-muted">
                Photo: your counsellor
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FOLD 02: FAQ */}
      <Section tone="mist">
        <div className="max-w-2xl">
          <Accordion items={faq} variant="cards" />
        </div>
      </Section>
    </>
  );
}
