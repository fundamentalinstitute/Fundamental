import type { Metadata } from "next";
import Section from "@/components/Section";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-bold">Terms</h1>
        <p className="text-sm text-muted">
          {/* TODO: replace with reviewed legal copy before launch */}
          Terms of enrolment and use of this website. Full terms to be
          published before launch.
        </p>
      </div>
    </Section>
  );
}
