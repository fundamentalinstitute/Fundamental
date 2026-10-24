"use client";

import { useEffect, useState } from "react";

/**
 * "Open WhatsApp" button on the thank-you page. Prefers the prefilled URL
 * stored by LeadForm after a successful save (fi_wa_url) — the visible
 * fallback when the post-submit popup was blocked — and otherwise uses the
 * site's default WhatsApp link.
 */
export default function WhatsAppCta({
  label,
  fallbackHref,
  primary,
}: {
  label: string;
  fallbackHref: string;
  primary?: boolean;
}) {
  const [href, setHref] = useState(fallbackHref);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("fi_wa_url");
      if (stored) setHref(stored);
    } catch {}
  }, []);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={primary ? "btn-primary" : "btn-secondary"}
    >
      {label}
    </a>
  );
}
