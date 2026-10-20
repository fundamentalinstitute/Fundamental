import Link from "next/link";

export default function Pillars({ heading }: { heading: string }) {
  const words = heading.split(" ");
  const last = words.pop();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="section-title">
        {words.join(" ")} <span className="text-brand">{last}</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex flex-col items-start gap-3">
          <h3 className="text-base font-bold">Training</h3>
          <span className="chip-solid">Live now</span>
          <p className="text-sm">Marketing Management</p>
          <Link href="/programs/marketing-management" className="btn-primary mt-auto px-4 py-2 text-xs">
            View program
          </Link>
        </div>
        <div className="card flex flex-col items-start gap-3">
          <h3 className="text-base font-bold">Community</h3>
          <span className="chip-solid">Join free</span>
          <p className="text-sm">Founders Club, city chapters, quarterly meetups</p>
          <Link href="/community" className="btn-secondary mt-auto px-4 py-2 text-xs">
            Join the community
          </Link>
        </div>
        <div className="card flex flex-col items-start gap-3 bg-mist">
          <h3 className="text-base font-bold">Founder programs</h3>
          <span className="chip">Coming soon</span>
          <p className="text-sm text-muted">Funding Ready, Startup Cohort, Super7</p>
          <Link href="/waitlist?audience=founder" className="btn-secondary mt-auto px-4 py-2 text-xs">
            Join the founder waitlist
          </Link>
        </div>
        <div className="card flex flex-col items-start gap-3 bg-mist">
          <h3 className="text-base font-bold">Funding</h3>
          <span className="chip">Coming soon</span>
          <p className="text-sm text-muted">Perseverance Fund</p>
          {/* No CTA; never implied live */}
        </div>
      </div>
    </div>
  );
}
