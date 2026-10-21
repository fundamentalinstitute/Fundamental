import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the CMS, API and post-submit pages out of search results.
        disallow: ["/studio", "/api/", "/thank-you", "/enrol"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
