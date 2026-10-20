"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { announcement } from "@/lib/site-config";

const nav = [
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="bg-brand-ink px-3 py-2 text-center text-xs text-white">
        {announcement}
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-site flex items-center justify-between py-3">
          <Link href="/" aria-label="Fundamental Institute home" className="shrink-0">
            <Image src="/logo.svg" alt="Fundamental Institute" width={170} height={34} priority />
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={
                  isActive(n.href)
                    ? "text-sm font-bold text-brand underline decoration-2 underline-offset-8"
                    : "text-sm text-brand-ink transition-colors hover:text-brand"
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/counselling" className="btn-primary hidden sm:inline-flex">
              Talk to a counsellor
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-line md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line bg-white md:hidden">
            <div className="container-site flex flex-col gap-1 py-3">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={
                    isActive(n.href)
                      ? "rounded-md bg-mist px-2 py-2 text-sm font-bold text-brand"
                      : "rounded-md px-2 py-2 text-sm hover:bg-mist"
                  }
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/counselling"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                Talk to a counsellor
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
