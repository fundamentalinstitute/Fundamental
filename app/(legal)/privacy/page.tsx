import type { Metadata } from "next";
import Section from "@/components/Section";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-bold">Privacy policy</h1>
        <p className="text-sm text-muted">
          {/* TODO: replace with reviewed legal copy before launch */}
          We collect only what the forms ask for — name, contact details and
          your question — to respond to you about our programs. We do not sell
          your data. Full policy to be published before launch.
        </p>
      </div>
    </Section>
  );
}
