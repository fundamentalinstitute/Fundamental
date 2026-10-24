"use client";

import { useState } from "react";
import {
  type Batch,
  batches as defaultBatches,
  type BatchMode,
  discountPct,
  formatINR,
} from "@/lib/site-config";
import LeadForm from "@/components/LeadForm";

export default function EnrolForm({
  initialMode,
  batches = defaultBatches,
}: {
  initialMode: BatchMode;
  batches?: Record<BatchMode, Batch>;
}) {
  const [mode, setMode] = useState<BatchMode>(initialMode);
  const b = batches[mode];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-3 text-lg font-bold">Choose your batch</h2>
        <div className="grid w-full max-w-xs grid-cols-2 rounded-md border border-line p-1 text-sm font-semibold">
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
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md border border-line p-4">
        <div>
          <p className="text-sm font-bold">{b.label} batch</p>
          <p className="text-xs text-muted">
            {b.schedule} · starts {b.startDate} · {b.seats} seats, {b.seatsLeft} left
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted line-through">{formatINR(b.listPrice)}</p>
          <p className="text-xl font-bold text-brand">{formatINR(b.offerPrice)}</p>
          <p className="text-xs text-muted">{discountPct(b)}% off</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Your details</h2>
        <LeadForm
          leadType="enrol"
          openWhatsApp
          extra={{
            mode,
            program: "Marketing Management",
            schedule: b.schedule,
            start_date: b.startDate,
            fee: String(b.offerPrice),
            location: b.location,
          }}
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "phone", label: "Phone", type: "tel", required: true },
            { name: "city", label: "City", required: true },
            {
              name: "status",
              label: "Current status",
              type: "select",
              options: [
                "Student / final year",
                "Graduate, looking",
                "Working professional",
                "Switching careers",
              ],
              required: true,
            },
            { name: "notes", label: "Anything we should know (optional)", type: "textarea" },
          ]}
          submitLabel="Submit"
          note="By submitting you agree to our terms."
        />
      </div>
    </div>
  );
}
