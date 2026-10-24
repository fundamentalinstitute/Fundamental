import { buildMetadata } from "@/lib/seo";
import Section from "@/components/Section";
import UnsubscribeForm from "@/components/UnsubscribeForm";

export const generateMetadata = () =>
  buildMetadata({
    path: "/unsubscribe",
    title: "Unsubscribe",
    description: "Stop receiving emails from Fundamental Institute.",
    noIndex: true,
  });

export default function UnsubscribePage() {
  return (
    <Section className="min-h-[50vh]">
      <div className="mx-auto flex max-w-md flex-col gap-4 py-10">
        <h1 className="text-3xl font-bold">Unsubscribe</h1>
        <p className="text-sm text-muted">
          Enter the email address you subscribed with and we&apos;ll stop
          sending newsletters to it.
        </p>
        <UnsubscribeForm />
      </div>
    </Section>
  );
}
