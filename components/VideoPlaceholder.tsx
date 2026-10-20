/**
 * Branded stand-in until the real video is embedded. Swap the inner content
 * for a YouTube/Vimeo iframe when the video is ready.
 */
export default function VideoPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-lg shadow-brand/20 ${className ?? ""}`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform hover:scale-105">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6 text-brand" aria-hidden>
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </span>
        <p className="px-4 text-center text-sm font-semibold text-white">{label}</p>
        <p className="text-[11px] tracking-widest text-white/60 uppercase">Coming soon</p>
      </div>
    </div>
  );
}
