import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import FinalCta from "@/components/FinalCta";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return post
    ? { title: post.title, description: post.excerpt }
    : { title: "Article" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const mid = Math.ceil(post.body.length / 2);

  return (
    <>
      <Section>
        <article className="mx-auto flex max-w-2xl flex-col gap-5">
          <p className="text-xs text-muted">
            <Link href="/" className="hover:text-brand">Home</Link> /{" "}
            <Link href="/blog" className="hover:text-brand">Blog</Link> / {post.title}
          </p>
          <span className="chip w-fit">{post.category}</span>
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{post.title}</h1>
          <p className="text-xs text-muted">
            Anjan Prasad · {post.date} · {post.readMinutes} min read
          </p>
          <div className="flex h-56 items-center justify-center rounded-lg bg-mist text-xs text-muted">
            Hero image
          </div>

          {post.body.slice(0, mid).map((para) => (
            <p key={para.slice(0, 32)} className="text-base leading-relaxed">
              {para}
            </p>
          ))}

          {/* MID-ARTICLE NEWSLETTER, ~50% scroll */}
          <div className="card bg-mist">
            <p className="mb-3 text-sm font-bold">Get one useful article a week</p>
            <LeadForm
              leadType="newsletter"
              fields={[{ name: "email", label: "Email", type: "email", required: true }]}
              submitLabel="Subscribe"
              inlineSuccess="Subscribed. See you next week."
            />
          </div>

          {post.body.slice(mid).map((para) => (
            <p key={para.slice(0, 32)} className="text-base leading-relaxed">
              {para}
            </p>
          ))}

          {/* PROGRAM CALLOUT */}
          <div className="card flex flex-col items-start gap-3 border-brand sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-bold">
                This is what the Marketing Management program covers, live.
              </p>
            </div>
            <Link href="/programs/marketing-management" className="btn-primary">
              View program
            </Link>
          </div>

          {/* AUTHOR BOX */}
          <div className="flex items-center gap-4 border-t border-line pt-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-white">
              A
            </div>
            <div>
              <p className="text-sm font-bold">Anjan Prasad</p>
              <p className="text-xs text-muted">
                Founder, Fundamental Institute. 10+ years on the hiring side.
              </p>
            </div>
          </div>
        </article>
      </Section>

      {/* RELATED ARTICLES */}
      <Section tone="mist">
        <h2 className="mb-5 text-lg font-bold">Related articles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card flex flex-col gap-2 transition-colors hover:border-brand"
            >
              <span className="chip w-fit">{p.category}</span>
              <h3 className="text-sm leading-snug font-bold">{p.title}</h3>
              <p className="mt-auto text-xs text-muted">
                {p.readMinutes} min read · {p.date}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
