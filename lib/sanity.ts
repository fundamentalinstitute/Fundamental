import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/**
 * Fetch with a 60s cache and a hard fallback: if Sanity is unreachable or
 * returns nothing, the caller's local default is used, so the site always
 * renders — before the first import, offline, and during incidents.
 */
export async function fetchOr<T>(query: string, fallback: T): Promise<T> {
  try {
    const result = await sanityClient.fetch<T | null>(
      query,
      {},
      { next: { revalidate: 60 } } as never,
    );
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result as T;
  } catch {
    return fallback;
  }
}
