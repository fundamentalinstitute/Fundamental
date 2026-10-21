"use client";

import { useState } from "react";

interface Module {
  title: string;
  hours: number;
  detail: string;
  topics: string[];
}

/**
 * Tabbed curriculum: module list on the left, detail panel with overview and
 * topic checklist on the right. Content comes from Sanity (curriculumModule).
 */
export default function CurriculumExplorer({
  modules,
  overline,
  heading,
  intro,
}: {
  modules: Module[];
  overline: string;
  heading: string;
  intro: string;
}) {
  const [active, setActive] = useState(0);
  const m = modules[active];
  const totalHours = modules.reduce((sum, mod) => sum + mod.hours, 0);
  const headingWords = heading.split(" ");
  const headingLast = headingWords.pop();

  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="overline-label mb-2">{overline}</p>
          <h2 className="section-title">
            {headingWords.join(" ")} <span className="text-brand">{headingLast}</span>
          </h2>
        </div>
        <div className="flex max-w-xl flex-col gap-3">
          <p className="text-sm leading-relaxed sm:text-base">{intro}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-brand" aria-hidden>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
              </svg>
              {modules.length} Modules
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-brand" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              {totalHours} Hours of Live Learning
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + detail */}
      <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:items-start">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modules.map((mod, i) => (
            <button
              key={mod.title}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={
                i === active
                  ? "flex cursor-pointer items-center justify-between gap-2 rounded-md border-l-4 border-brand bg-brand px-4 py-4 text-left text-sm font-bold text-white shadow-lg shadow-brand/20"
                  : "flex cursor-pointer items-center justify-between gap-2 rounded-md border border-l-4 border-line border-l-brand bg-white px-4 py-4 text-left text-sm font-semibold transition-shadow hover:shadow-md"
              }
            >
              <span>{mod.title}</span>
              {i === active && (
                <span aria-hidden className="shrink-0 text-light">
                  →
                </span>
              )}
            </button>
          ))}
        </div>

        {m && (
          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-2xl font-bold">{m.title}</h3>
              <span className="rounded-full border border-brand px-3 py-0.5 text-xs font-bold text-brand">
                {m.hours} hrs
              </span>
            </div>
            <p className="mt-2 mb-3 text-sm font-bold text-brand">
              Module Info &amp; Overview
            </p>
            <p className="text-sm leading-relaxed sm:text-base">{m.detail}</p>
            {m.topics.length > 0 && (
              <ul className="mt-5 grid gap-x-6 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
                {m.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden>
                      <path d="m4.5 12.5 5 5 10-11" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
