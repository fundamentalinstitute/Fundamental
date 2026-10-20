import type { Metadata } from "next";
import Section from "@/components/Section";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundPolicyPage() {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-bold">Refund policy</h1>
        <p className="text-sm text-muted">
          {/* TODO: replace with reviewed legal copy before launch */}
          Full refund within the first week of the batch, no questions asked.
          Prorated after that. Detailed policy to be published before launch.
        </p>
      </div>
    </Section>
  );
}
