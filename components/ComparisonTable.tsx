import Link from "next/link";
import { discountPct, formatINR } from "@/lib/site-config";
import { getBatches } from "@/lib/cms";

export default async function ComparisonTable() {
  const { online: on, offline: off } = await getBatches();
  const rows: [string, string, string][] = [
    ["Schedule", on.schedule, off.schedule],
    ["Batch start", on.startDate, off.startDate],
    ["Seats", `${on.seats}`, `${off.seats}`],
    ["Where", on.location, off.location],
    [
      "Includes",
      "Same curriculum, mentoring, certificate, internship eligibility",
      "All of online, plus in-person mock interviews",
    ],
    [
      "Price",
      `${formatINR(on.offerPrice)} (${discountPct(on)}% off ${formatINR(on.listPrice)})`,
      `${formatINR(off.offerPrice)} (${discountPct(off)}% off ${formatINR(off.listPrice)})`,
    ],
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-130 border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-1/5 p-3" />
            <th className="p-3 text-left font-display text-base">Online</th>
            <th className="p-3 text-left font-display text-base">Offline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, a, b]) => (
            <tr key={label}>
              <td className="border-t border-line p-3 text-muted">{label}</td>
              <td className="border-t border-line p-3">{a}</td>
              <td className="border-t border-line p-3">{b}</td>
            </tr>
          ))}
          <tr>
            <td className="p-3" />
            <td className="p-3">
              <Link href="/enrol?mode=online" className="btn-primary">
                Enrol Online
              </Link>
            </td>
            <td className="p-3">
              <Link href="/enrol?mode=offline" className="btn-primary">
                Enrol Offline
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
