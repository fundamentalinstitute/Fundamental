"use client";

import { useEffect, useRef, useState } from "react";
import VideoPlaceholder from "@/components/VideoPlaceholder";

/**
 * Founder video with scroll behavior:
 * - starts playing (muted) when its section scrolls into view
 * - when the visitor scrolls past, it minimizes to a floating player at the
 *   bottom-right and keeps playing; ✕ dismisses it
 * - if the video file is missing (pre-launch), falls back to the branded
 *   "coming soon" card. Drop the real file at public/founder/intro.mp4
 *   (or pass a different src) to activate it.
 */
export default function FounderVideo({
  src = "/founder/intro.mp4",
  label = "Why I built Fundamental",
  className,
}: {
  src?: string;
  label?: string;
  className?: string;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (failed || !slotRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    obs.observe(slotRef.current);
    return () => obs.disconnect();
  }, [failed]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || failed) return;
    if (inView) {
      setDismissed(false);
      // Muted is required for browsers to allow autoplay.
      v.muted = true;
      v.play()
        .then(() => setStarted(true))
        .catch(() => {});
    }
  }, [inView, failed]);

  if (failed) {
    return (
      <div ref={slotRef} className={className}>
        <VideoPlaceholder label={label} />
      </div>
    );
  }

  const minimized = started && !inView && !dismissed;

  return (
    <div ref={slotRef} className={`relative ${className ?? ""}`}>
      {/* Spacer keeps the layout steady while the player floats */}
      {minimized && <div className="aspect-video w-full rounded-xl bg-mist" />}
      <div
        className={
          minimized
            ? "fixed right-5 bottom-24 z-50 w-64 overflow-hidden rounded-xl shadow-2xl sm:w-80"
            : "overflow-hidden rounded-xl shadow-lg shadow-brand/20"
        }
      >
        <video
          ref={videoRef}
          src={src}
          muted
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          aria-label={label}
          className="aspect-video w-full bg-brand-ink object-cover"
        />
        {minimized && (
          <button
            type="button"
            aria-label="Close video"
            onClick={() => {
              setDismissed(true);
              videoRef.current?.pause();
            }}
            className="absolute top-1.5 right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-sm text-white hover:bg-black/80"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
