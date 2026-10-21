/**
 * Rotating icon set for the "What you'll learn" outcome cards.
 * Icons are assigned by card position (index), so CMS-edited outcome text
 * keeps working without any icon field.
 */
const ICONS: React.ReactNode[] = [
  // file-text — positioning doc
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
    <path d="M14 2v6h6M16 13H8M16 17H8" />
  </>,
  // megaphone — campaigns
  <>
    <path d="m3 11 18-5v12L3 13v-2Z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </>,
  // chart — analytics
  <>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </>,
  // pen — briefs and copy
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </>,
  // tag — pricing
  <>
    <path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8L12 2Z" />
    <circle cx="7" cy="7" r="1.2" />
  </>,
  // calendar — content calendar
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>,
  // presentation — hiring panel
  <>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </>,
  // rocket — ship end to end
  <>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
  </>,
];

export default function OutcomeIcon({ index }: { index: number }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-brand"
        aria-hidden
      >
        {ICONS[index % ICONS.length]}
      </svg>
    </span>
  );
}
