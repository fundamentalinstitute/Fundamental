"use client";

import { useEffect, useState } from "react";

/** "Got it." → "Got it, Name." using the name stashed by LeadForm (never in the URL). */
export default function PersonalHeading({ base }: { base: string }) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const n = sessionStorage.getItem("fi_lead_name");
      if (n) setName(n);
    } catch {}
  }, []);

  return (
    <h1 className="text-3xl font-bold">
      {name ? `${base.replace(/\.$/, "")}, ${name}.` : base}
    </h1>
  );
}
