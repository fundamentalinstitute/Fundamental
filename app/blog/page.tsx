import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import FinalCta from "@/components/FinalCta";
import Image from "next/image";
import { getPosts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog — straight talk about careers and marketing",
  description:
    "No listicles, no fluff. What hiring managers actually look for, and how to build a career that survives contact with the market.",
};


export default async function BlogPage() {
  const blogPosts = await getPosts();
  const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];
  return (
    <>
      {/* FOLD 01: HEADER + CATEGORIES */}
      <Section>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Straight talk, from the hiring side</h1>
          <p className="max-w-xl text-base">
            What hiring managers actually look for — and how to become the
            candidate they call back.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <span key={c} className={i === 0 ? "chip-solid" : "chip"}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FOLD 02: ARTICLE CARDS */}
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card flex flex-col gap-3 transition-colors hover:border-brand"
            >
              {p.heroImageUrl ? (
                <div className="relative h-36 overflow-hidden rounded-md">
                  <Image src={p.heroImageUrl} alt={p.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-md bg-mist text-xs text-muted">
                  Article image
                </div>
              )}
              <span className="chip w-fit">{p.category}</span>
              <h2 className="text-base leading-snug font-bold">{p.title}</h2>
              <p className="text-xs leading-relaxed text-muted">{p.excerpt}</p>
              <p className="mt-auto text-xs text-muted">
                {p.readMinutes} min read · {p.date}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* FOLD 03: NEWSLETTER BAND */}
      <Section tone="mist">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">Get one useful article a week</h2>
          <div className="w-full max-w-sm">
            <LeadForm
              leadType="newsletter"
              fields={[{ name: "email", label: "Email", type: "email", required: true }]}
              submitLabel="Subscribe"
              inlineSuccess="Subscribed. One useful article a week, no spam."
            />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
