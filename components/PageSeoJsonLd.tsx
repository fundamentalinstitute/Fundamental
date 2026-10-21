import JsonLd from "@/components/JsonLd";
import { getCustomJsonLd } from "@/lib/seo";

/** Renders CMS-authored JSON-LD (Page SEO document) for the given path. */
export default async function PageSeoJsonLd({ path }: { path: string }) {
  return <JsonLd data={await getCustomJsonLd(path)} />;
}
