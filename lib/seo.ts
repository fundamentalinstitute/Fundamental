import type { Metadata } from "next";
import { fetchOr } from "@/lib/sanity";

export const SITE_URL = "https://www.fundamental.institute";
export const SITE_NAME = "Fundamental Institute";

interface PageSeoDoc {
  metaTitle?: string | null;
  metaDescription?: string | null;
  jsonLd?: string | null;
}

async function getPageSeo(path: string): Promise<PageSeoDoc | null> {
  return fetchOr<PageSeoDoc | null>(
    `*[_type == "pageSeo" && path == "${path.replace(/"/g, "")}"][0]{metaTitle, metaDescription, jsonLd}`,
    null,
  );
}

/**
 * Metadata for a page: CMS override (Page SEO document matching the path)
 * wins over the code fallback. Adds canonical URL, Open Graph and
 * Twitter/X card tags.
 */
export async function buildMetadata({
  path,
  title,
  description,
  noIndex = false,
  ogImage = "/og.png",
}: {
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
  ogImage?: string;
}): Promise<Metadata> {
  const seo = await getPageSeo(path);
  const finalTitle = seo?.metaTitle || title;
  const finalDescription = seo?.metaDescription || description;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false } : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
    },
  };
}

/** CMS-authored JSON-LD for a page — parsed and validated; invalid JSON is ignored. */
export async function getCustomJsonLd(path: string): Promise<object | null> {
  const seo = await getPageSeo(path);
  if (!seo?.jsonLd) return null;
  try {
    const parsed = JSON.parse(seo.jsonLd);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}
