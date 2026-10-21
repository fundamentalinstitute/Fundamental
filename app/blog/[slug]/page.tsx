import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import FinalCta from "@/components/FinalCta";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import PageSeoJsonLd from "@/components/PageSeoJsonLd";
import { getPost, getPosts } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article" };
  return buildMetadata({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    ogImage: post.heroImageUrl ?? "/og.png",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);
  const mid = Math.ceil(post.body.length / 2);

  return (
    <>
      <PageSeoJsonLd path={`/blog/${post.slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url: `${SITE_URL}/blog/${post.slug}`,
          image: post.heroImageUrl ?? `${SITE_URL}/og.png`,
          author: { "@type": "Person", name: "Anjan Prasad" },
          publisher: {
            "@type": "EducationalOrganization",
            name: "Fundamental Institute",
            url: SITE_URL,
          },
        }}
      />
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
          {post.heroImageUrl ? (
            <div className="relative h-56 overflow-hidden rounded-lg">
              <Image src={post.heroImageUrl} alt={post.heroImageAlt ?? post.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center rounded-lg bg-mist text-xs text-muted">
              Hero image
            </div>
          )}

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
