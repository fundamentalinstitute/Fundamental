import { getBatches, getPosts, getProgram, getSettings } from "@/lib/cms";
import { getSeoDefaults, SITE_URL } from "@/lib/seo";
import { formatINR } from "@/lib/site-config";

export const revalidate = 3600;

/**
 * llms.txt — the emerging convention AI search engines and assistants
 * (ChatGPT, Perplexity, Claude, Gemini) read to understand a site (GEO/AEO).
 * Built from the same Sanity content as the pages, so it stays current.
 */
export async function GET() {
  const [settings, seo, batches, program, posts] = await Promise.all([
    getSettings(),
    getSeoDefaults(),
    getBatches(),
    getProgram(),
    getPosts(),
  ]);
  const on = batches.online;
  const off = batches.offline;

  const body = `# Fundamental Institute

> ${seo.seoDescription}

Fundamental Institute (${SITE_URL}) is a practitioner-led training institute in
Pune, India. Its flagship live Marketing Management program takes graduates,
career switchers and working professionals to job-ready marketers — taught from
the hiring side of the table.
${seo.seoKeywords.length ? `\nKey topics: ${seo.seoKeywords.join(", ")}\n` : ""}
## Flagship program: ${program.title || "Marketing Management"}

- Online batch: ${on.schedule}, starts ${on.startDate}, ${on.location}, fee ${formatINR(on.offerPrice)}
- Offline batch: ${off.schedule}, starts ${off.startDate}, ${off.location}, fee ${formatINR(off.offerPrice)}
- 50 live hours, small batches (${off.seats} offline / ${on.seats} online seats), certificate, internship for the top 20%

## Main pages

- [Marketing Management program](${SITE_URL}/programs/marketing-management): curriculum, batches, fees, FAQ
- [All programs](${SITE_URL}/programs): current and upcoming programs
- [Free counselling](${SITE_URL}/counselling): book a free career counselling call
- [About the founder](${SITE_URL}/about)
- [Founders Club community](${SITE_URL}/community): free community, city chapters, meetups
- [Blog](${SITE_URL}/blog): career and marketing advice from the hiring side
- [Contact](${SITE_URL}/contact): ${settings.email}

## Articles
${posts
  .slice(0, 10)
  .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})`)
  .join("\n")}

## Contact

- Email: ${settings.email}
- Address: ${settings.address}
- Hours: ${settings.hours}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
