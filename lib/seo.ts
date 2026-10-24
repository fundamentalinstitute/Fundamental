import type { Metadata } from "next";
import { fetchOr, urlFor } from "@/lib/sanity";

export const SITE_URL = "https://www.fundamental.institute";
export const SITE_NAME = "Fundamental Institute";

export const DEFAULT_TITLE =
  "Fundamental Institute — Not a course. A career correction.";
export const DEFAULT_DESCRIPTION =
  "Live, practitioner-led Marketing Management program in Pune and online. 50 live hours, small batches, internship for the top 20%.";

interface PageSeoDoc {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  ogImage?: object | null;
  noIndex?: boolean | null;
  jsonLd?: string | null;
}

async function getPageSeo(path: string): Promise<PageSeoDoc | null> {
  return fetchOr<PageSeoDoc | null>(
    `*[_type == "pageSeo" && path == "${path.replace(/"/g, "")}"][0]{metaTitle, metaDescription, keywords, ogImage, noIndex, jsonLd}`,
    null,
  );
}

export interface SeoDefaults {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoOgImage: object | null;
}

/** Site-wide SEO defaults from Site settings in Sanity, with code fallbacks. */
export async function getSeoDefaults(): Promise<SeoDefaults> {
  const doc = await fetchOr<Partial<SeoDefaults> | null>(
    `*[_id == "siteSettings"][0]{seoTitle, seoDescription, seoKeywords, seoOgImage}`,
    null,
  );
  return {
    seoTitle: doc?.seoTitle || DEFAULT_TITLE,
    seoDescription: doc?.seoDescription || DEFAULT_DESCRIPTION,
    seoKeywords: doc?.seoKeywords ?? [],
    seoOgImage: doc?.seoOgImage ?? null,
  };
}

function imageUrl(img: object | null | undefined): string | null {
  if (!img) return null;
  try {
    return urlFor(img as never).width(1200).height(630).url();
  } catch {
    return null;
  }
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
  const [seo, defaults] = await Promise.all([getPageSeo(path), getSeoDefaults()]);
  const finalTitle = seo?.metaTitle || title;
  const finalDescription = seo?.metaDescription || description;
  const keywords = seo?.keywords?.length ? seo.keywords : defaults.seoKeywords;
  const finalOgImage =
    imageUrl(seo?.ogImage) ?? imageUrl(defaults.seoOgImage) ?? ogImage;
  const hidden = noIndex || seo?.noIndex === true;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    title: finalTitle,
    description: finalDescription,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical: url },
    robots: hidden ? { index: false } : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: finalOgImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [finalOgImage],
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
