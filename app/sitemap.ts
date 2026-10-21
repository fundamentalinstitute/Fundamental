import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getLeadMagnet, getPosts } from "@/lib/cms";

export const revalidate = 3600; // refresh hourly so new CMS pages appear

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, magnet] = await Promise.all([getPosts(), getLeadMagnet()]);
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/programs", priority: 0.9 },
    { path: "/programs/marketing-management", priority: 1 },
    { path: "/counselling", priority: 0.8 },
    { path: "/brochure", priority: 0.6 },
    { path: "/community", priority: 0.7 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.6 },
    { path: "/blog", priority: 0.7 },
    { path: "/waitlist", priority: 0.5 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/refund-policy", priority: 0.2 },
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified: now,
      priority: p.priority,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/resources/${magnet.slug}`,
      lastModified: now,
      priority: 0.5,
    },
  ];
}
