import Link from "next/link";
import { getBatches } from "@/lib/cms";

export default async function FinalCta() {
  const b = (await getBatches()).offline;
  return (
    <section className="bg-sand">
      <div className="container-site flex flex-col gap-4 py-12">
        <h2 className="section-title">
          Batch starts {b.startDate}. {b.seatsLeft} seats left.
        </h2>
        <p className="text-sm text-brand-ink/80 sm:text-base">
          Book a free call and find out if this is the right program for you.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/enrol" className="btn-primary">
            Enrol now
          </Link>
          <Link href="/counselling" className="btn-secondary">
            Talk to a counsellor
          </Link>
        </div>
      </div>
    </section>
  );
}
