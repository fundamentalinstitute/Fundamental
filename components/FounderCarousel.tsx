"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const photos = [
  { src: "/founder/anjan-1.jpg", alt: "Anjan Prasad, founder of Fundamental Institute" },
  { src: "/founder/anjan-2.jpg", alt: "Anjan Prasad smiling" },
  { src: "/founder/anjan-3.jpg", alt: "Anjan Prasad at the studio" },
];

export default function FounderCarousel({ className }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % photos.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className ?? ""}`}>
      {photos.map((p, idx) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          sizes="(min-width: 1024px) 24rem, 100vw"
          className={`object-cover transition-opacity duration-700 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
          priority={idx === 0}
        />
      ))}

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => setI((i - 1 + photos.length) % photos.length)}
        className="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-brand-ink shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => setI((i + 1) % photos.length)}
        className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-brand-ink shadow hover:bg-white"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {photos.map((p, idx) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Photo ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2 w-2 cursor-pointer rounded-full ${
              idx === i ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
