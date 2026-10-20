"use client";

import { useState } from "react";

export interface AccordionItem {
  q: string;
  a: string;
  /** Optional emoji/icon shown in a tinted box (cards variant) */
  icon?: string;
  /** Optional pill label on the right, e.g. "Module 1 · 10 hrs" (cards variant) */
  pill?: string;
}

export default function Accordion({
  items,
  firstOpen = true,
  variant = "plain",
}: {
  items: AccordionItem[];
  firstOpen?: boolean;
  variant?: "plain" | "cards";
}) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null);

  if (variant === "cards") {
    return (
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div
            key={item.q}
            className="rounded-xl border border-line bg-white px-5 py-4 shadow-xs transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full cursor-pointer items-center gap-3 text-left text-sm font-semibold"
              aria-expanded={open === i}
            >
              {item.icon && (
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist text-base"
                >
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.q}</span>
              {item.pill && (
                <span className="hidden shrink-0 rounded-full border border-brand px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-brand sm:inline-block">
                  {item.pill}
                </span>
              )}
              <span className="shrink-0 text-muted">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="pt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border-b border-line">
      {items.map((item, i) => (
        <div key={item.q} className="border-t border-line py-3">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold"
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <span className="text-muted">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="pt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
