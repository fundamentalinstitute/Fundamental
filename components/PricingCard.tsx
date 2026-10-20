"use client";

import { useState } from "react";
import Link from "next/link";
import {
  batches,
  type BatchMode,
  discountPct,
  emiFrom,
  formatINR,
  siteConfig,
} from "@/lib/site-config";

export default function PricingCard({ initialMode = "online" }: { initialMode?: BatchMode }) {
  const [mode, setMode] = useState<BatchMode>(initialMode);
  const b = batches[mode];

  return (
    <div className="card sticky top-24 flex flex-col gap-4">
      <div className="grid grid-cols-2 rounded-md border border-line p-1 text-sm font-semibold">
        {(["online", "offline"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`cursor-pointer rounded px-3 py-2 transition-colors ${
              mode === m ? "bg-brand text-white" : "text-brand-ink hover:bg-mist"
            }`}
          >
            {batches[m].label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm text-muted line-through">{formatINR(b.listPrice)}</p>
        <p className="font-display text-3xl font-bold text-brand">
          {formatINR(b.offerPrice)}{" "}
          <span className="font-sans text-sm font-medium text-muted">
            ({discountPct(b)}% off)
          </span>
        </p>
        <p className="text-xs text-muted">or EMI from {formatINR(emiFrom)}/month</p>
      </div>

      <p className="text-xs text-muted">
        {b.schedule} · Starts {b.startDate} · {b.seats} seats, {b.seatsLeft} left
      </p>

      <Link href={`/enrol?mode=${mode}`} className="btn-primary">
        Enrol now
      </Link>
      <a href={siteConfig.whatsappLink} className="btn-secondary">
        Talk on WhatsApp
      </a>
    </div>
  );
}
