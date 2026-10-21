import Link from "next/link";
import Section from "@/components/Section";

export default function NotFound() {
  return (
    <Section className="min-h-[55vh]">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-12 text-center">
        <p className="font-display text-7xl font-bold text-brand">404</p>
        <h1 className="text-2xl font-bold">
          This page took a <span className="text-brand">wrong turn</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/programs/marketing-management" className="btn-secondary">
            View the program
          </Link>
          <Link href="/counselling" className="btn-secondary">
            Talk to a counsellor
          </Link>
        </div>
      </div>
    </Section>
  );
}
