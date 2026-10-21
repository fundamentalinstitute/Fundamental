/**
 * CMS data layer. Every getter queries Sanity first and falls back to the
 * local defaults in lib/site-config.ts and lib/content.ts, so the site
 * renders identically before the first content import and keeps working if
 * Sanity is unreachable. Content is cached for 60s (ISR-style).
 */
import { fetchOr } from "@/lib/sanity";
import {
  type Batch,
  type BatchMode,
  applicationDeadline as fallbackDeadline,
  batches as fallbackBatches,
  siteConfig,
} from "@/lib/site-config";
import {
  type BlogPost,
  type Testimonial,
  blogPosts as fallbackPosts,
  communityFaq,
  counsellingFaq,
  curriculum as fallbackCurriculum,
  homeFaq,
  leadMagnet as fallbackMagnet,
  learnOutcomes,
  programFaq,
  testimonials as fallbackTestimonials,
} from "@/lib/content";
import type { AccordionItem } from "@/components/Accordion";

/* ───────────────────────── settings ───────────────────────── */

export interface Settings {
  email: string;
  whatsappNumber: string;
  whatsappLink: string;
  address: string;
  hours: string;
  replyPromise: string;
  applicationDeadline: string;
  socials: { label: string; url: string }[];
}

const settingsFallback: Settings = {
  email: siteConfig.email,
  whatsappNumber: siteConfig.whatsappNumber,
  whatsappLink: siteConfig.whatsappLink,
  address: siteConfig.address,
  hours: siteConfig.hours,
  replyPromise: siteConfig.replyPromise,
  applicationDeadline: fallbackDeadline,
  // Placeholder links — the real URLs are edited in Sanity (Site settings → socials).
  socials: [
    { label: "Instagram", url: "#" },
    { label: "X", url: "#" },
    { label: "YouTube", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],
};

export async function getSettings(): Promise<Settings> {
  const doc = await fetchOr<Partial<Settings> | null>(
    `*[_id == "siteSettings"][0]{email, whatsappNumber, whatsappLink, address, hours, replyPromise, applicationDeadline, socials}`,
    null,
  );
  return { ...settingsFallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── batches ───────────────────────── */

export async function getBatches(): Promise<Record<BatchMode, Batch>> {
  const docs = await fetchOr<Partial<Batch>[]>(
    `*[_type == "batch"]{mode, label, schedule, startDate, seats, seatsLeft, listPrice, offerPrice, location, includes}`,
    [],
  );
  const result = { online: { ...fallbackBatches.online }, offline: { ...fallbackBatches.offline } };
  for (const d of docs) {
    if (d.mode === "online" || d.mode === "offline") {
      result[d.mode] = { ...result[d.mode], ...stripNulls(d) };
    }
  }
  return result;
}

export async function getAnnouncement(): Promise<string> {
  const b = await getBatches();
  return `Offline batch starts ${b.offline.startDate}, Online batch starts ${b.online.startDate}. ${b.offline.seatsLeft} and ${b.online.seatsLeft} seats left.`;
}

/* ───────────────────────── home page ───────────────────────── */

export interface HomeStat {
  value: string;
  caption: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface HomePage {
  heroBadge: string;
  heroHeadlineTop: string;
  heroHeadlineAccent: string;
  heroSupporting: string;
  programDescription: string;
  collegeItems: string[];
  industryItems: string[];
  stats: HomeStat[];
  methodSteps: { title: string; description: string }[];
}

const homeFallback: HomePage = {
  heroBadge: "◦ LIVE PROGRAM + CERTIFICATE",
  heroHeadlineTop: "Not a course.",
  heroHeadlineAccent: "A career correction.",
  heroSupporting:
    "For graduates, career switchers and working professionals who were taught the subject but never the job — 50 live hours that end in work you can show a hiring panel.",
  programDescription:
    "One live program that takes you from any background to job-ready marketer — taught from the hiring side of the table.",
  collegeItems: [
    "Passing exams and understanding concepts",
    "Learning from textbooks and theoretical examples",
    "Studying how things work, without always doing the work yourself",
    "Earning a degree that gets you to the starting line",
  ],
  industryItems: [
    "Skills you can apply to real-world problems",
    "Experience turning knowledge into actual work",
    "The ability to solve problems, make decisions and adapt",
    "Proof of what you can do, not just what you have studied",
  ],
  stats: [
    {
      value: "39 in 100",
      caption: "young graduates under age 25 are unemployed",
      sourceLabel: "Source: Azim Premji University, State of Working India 2026",
      sourceUrl:
        "https://azimpremjiuniversity.edu.in/media/resources/SWI/SWI-2026/Executive-Summary_SWI2026-16-March.pdf",
    },
    {
      value: "46 in 100",
      caption: "working graduates are in jobs that may not require a degree",
      sourceLabel:
        "Source: RSIS International — Unemployment after Higher Education in India",
      sourceUrl:
        "https://rsisinternational.org/journals/ijriss/articles/unemployment-after-higher-education-in-india-a-statistical-analysis/",
    },
  ],
  methodSteps: [
    {
      title: "Learn from practitioners",
      description:
        "Live sessions led by people who have done the work. Small batches, personal attention.",
    },
    {
      title: "Put your skills to work",
      description:
        "Solve practical assignments and work through real-world briefs. Get feedback on every submission.",
    },
    {
      title: "Get personal guidance",
      description:
        "Regular one-on-one check-ins to review your progress, work through challenges and improve.",
    },
    {
      title: "Earn an internship opportunity",
      description:
        "The top 20% of learners get the opportunity to intern for up to 4 months.",
    },
  ],
};

export async function getHomePage(): Promise<HomePage> {
  const doc = await fetchOr<Partial<HomePage> | null>(
    `*[_id == "homePage"][0]{heroBadge, heroHeadlineTop, heroHeadlineAccent, heroSupporting, programDescription, collegeItems, industryItems, stats, methodSteps}`,
    null,
  );
  return { ...homeFallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── founder ───────────────────────── */

export interface Founder {
  name: string;
  homeBlurb: string;
  shortBio: string;
  aboutParagraphs: string[];
  carouselPhotos: { url: string; alt: string }[];
  aboutPhoto: { url: string; width: number; height: number } | null;
  videoUrl: string | null;
  journey: { period: string; title: string; description: string }[];
}

const founderFallback: Founder = {
  name: "Anjan Prasad",
  homeBlurb:
    "Ten-plus years on the hiring side of the table — as interviewer, consultant and founder. Anjan built Fundamental after watching hundreds of capable graduates lose offers for skills no one had ever shown them.",
  shortBio: "10+ years on the hiring side. Building the institute he wishes existed.",
  aboutParagraphs: [
    "For over a decade, I've been on the other side of the hiring table — interviewing candidates, advising businesses and building as a founder.",
    "One interview stayed with me. A bright MBA graduate could explain every marketing framework, but struggled when I asked her to plan a month of marketing for a café.",
    "It wasn't a question of intelligence or effort. It was the gap between knowing the theory and knowing how to apply it.",
    "I realised that capable graduates don't just need more information. They need the opportunity to practise, make decisions, learn from feedback and build skills they can take into a real job.",
    "That's why I built Fundamental: practitioner-led learning where the focus isn't just on what you know, but on what you can actually do.",
    "Over the years, I've also taught as visiting faculty at IMT Ghaziabad, BML Munjal University and IIFT — and the same pattern showed up in every classroom. Students learn fastest when they work on something real, and someone from the industry reviews it honestly.",
    "So that's how we run things here. Small batches. Live sessions. A real brief every week, with feedback you can act on. And one simple promise: we'll always tell you the truth about your work — because the industry will, too.",
  ],
  carouselPhotos: [
    { url: "/founder/anjan-1.jpg", alt: "Anjan Prasad, founder of Fundamental Institute" },
    { url: "/founder/anjan-2.jpg", alt: "Anjan Prasad smiling" },
    { url: "/founder/anjan-3.jpg", alt: "Anjan Prasad at the studio" },
  ],
  aboutPhoto: { url: "/founder/anjan-about.jpg", width: 1335, height: 2000 },
  videoUrl: null,
  journey: [
    {
      period: "2010–2012",
      title: "The Digital Marketing Years",
      description:
        "Hands-on experience in search, social and display marketing, driving measurable business results across global markets.",
    },
    {
      period: "2012–2018",
      title: "From Strategy to Leadership",
      description:
        "Worked across leading agencies and global brands, building expertise in digital strategy, consulting, campaign execution and team leadership.",
    },
    {
      period: "2015–2021",
      title: "Bringing Industry into the Classroom",
      description:
        "Visiting faculty at IMT Ghaziabad, BML Munjal University and IIFT, teaching digital marketing and strategy to future professionals.",
    },
    {
      period: "2018–2025",
      title: "Building Businesses",
      description:
        "Founded Noboru World and went on to build and advise businesses across marketing, technology and consumer brands.",
    },
    {
      period: "2026",
      title: "Fundamental",
      description:
        "Bringing industry experience into practical, practitioner-led learning to help graduates build skills they can apply in the real world.",
    },
  ],
};

interface FounderDoc {
  name?: string;
  homeBlurb?: string;
  shortBio?: string;
  aboutParagraphs?: string[];
  carouselPhotos?: { url?: string; alt?: string }[];
  aboutPhoto?: { url?: string; width?: number; height?: number } | null;
  videoUrl?: string;
  journey?: Founder["journey"];
}

export async function getFounder(): Promise<Founder> {
  const doc = await fetchOr<FounderDoc | null>(
    `*[_id == "founder"][0]{
      name, homeBlurb, shortBio, aboutParagraphs, videoUrl, journey,
      "carouselPhotos": carouselPhotos[]{ "url": asset->url, alt },
      "aboutPhoto": aboutPhoto{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
    }`,
    null,
  );
  if (!doc) return founderFallback;
  const photos = (doc.carouselPhotos ?? []).filter((p) => p.url) as {
    url: string;
    alt?: string;
  }[];
  return {
    ...founderFallback,
    ...stripNulls({
      name: doc.name,
      homeBlurb: doc.homeBlurb,
      shortBio: doc.shortBio,
      aboutParagraphs: doc.aboutParagraphs,
      videoUrl: doc.videoUrl,
      journey: doc.journey,
    }),
    carouselPhotos:
      photos.length > 0
        ? photos.map((p) => ({ url: p.url, alt: p.alt ?? "Anjan Prasad" }))
        : founderFallback.carouselPhotos,
    aboutPhoto:
      doc.aboutPhoto?.url && doc.aboutPhoto.width && doc.aboutPhoto.height
        ? { url: doc.aboutPhoto.url, width: doc.aboutPhoto.width, height: doc.aboutPhoto.height }
        : founderFallback.aboutPhoto,
  };
}

/* ───────────────────────── program ───────────────────────── */

export interface Program {
  title: string;
  promise: string;
  cardPromise: string;
  personas: { title: string; subtitle: string; leavesWith: string }[];
  outcomes: string[];
  curriculumOverline: string;
  curriculumHeading: string;
  curriculumIntro: string;
  internshipRule: string;
  certificateText: string;
  imageUrl: string | null;
}

const programFallback: Program = {
  title: "Marketing Management",
  promise: "Walk into marketing interviews with work worth talking about.",
  cardPromise: "From any background to job-ready marketer in 3 months.",
  personas: [
    {
      title: "Fresh graduate",
      subtitle: "Any stream, no marketing background",
      leavesWith: "A portfolio that beats three years of certificates",
    },
    {
      title: "1 to 3 years in",
      subtitle: "Stuck in a role going nowhere",
      leavesWith: "The skills to move into the role you actually wanted",
    },
    {
      title: "Switching in",
      subtitle: "From sales, ops or engineering",
      leavesWith: "A credible story and shipped work to back it",
    },
  ],
  outcomes: learnOutcomes,
  curriculumOverline: "Program learning outcomes and content",
  curriculumHeading: "What will you learn?",
  curriculumIntro:
    "A practical curriculum that takes you from marketing foundations to a presented final project — every module ends in hands-on work you can show, not just notes.",
  internshipRule:
    "The top 20% of each batch, selected on weekly assignment scores and capstone review, earn an internship of up to 4 months. Interns work on live client briefs; partner companies are named only with their permission.",
  certificateText:
    "Issued on completing the curriculum and capstone, signed by the founder. It states what you built — not just that you attended.",
  imageUrl: null,
};

export async function getProgram(): Promise<Program> {
  const doc = await fetchOr<Partial<Program> | null>(
    `*[_id == "program"][0]{title, promise, cardPromise, personas, outcomes, curriculumOverline, curriculumHeading, curriculumIntro, internshipRule, certificateText, "imageUrl": image.asset->url}`,
    null,
  );
  return { ...programFallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── collections ───────────────────────── */

export interface CurriculumModuleDoc {
  title: string;
  hours: number;
  detail: string;
  topics: string[];
}

export async function getCurriculum(): Promise<CurriculumModuleDoc[]> {
  const docs = await fetchOr<Partial<CurriculumModuleDoc>[]>(
    `*[_type == "curriculumModule"] | order(order asc) {title, hours, detail, topics}`,
    [],
  );
  if (docs.length === 0) return fallbackCurriculum;
  return docs.map((d) => ({
    title: d.title ?? "",
    hours: d.hours ?? 0,
    detail: d.detail ?? "",
    topics: d.topics ?? [],
  }));
}

export async function getFaq(
  group: "home" | "program" | "counselling" | "community",
): Promise<AccordionItem[]> {
  const fallbacks: Record<string, AccordionItem[]> = {
    home: homeFaq,
    program: programFaq,
    counselling: counsellingFaq,
    community: communityFaq,
  };
  return fetchOr<AccordionItem[]>(
    `*[_type == "faqItem" && group == "${group}"] | order(order asc) {"q": question, "a": answer}`,
    fallbacks[group],
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchOr<Testimonial[]>(
    `*[_type == "testimonial"] | order(order asc) {quote, name, journey}`,
    fallbackTestimonials,
  );
}

/* ───────────────────────── blog ───────────────────────── */

interface PostDoc {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  heroImageUrl?: string | null;
  body?: { children?: { text?: string }[] }[];
}

function blocksToParagraphs(body: PostDoc["body"]): string[] {
  return (body ?? [])
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter((p) => p.trim() !== "");
}

export interface PostWithImage extends BlogPost {
  heroImageUrl: string | null;
}

const postsFallback: PostWithImage[] = fallbackPosts.map((p) => ({
  ...p,
  heroImageUrl: null,
}));

const POST_PROJECTION = `{title, "slug": slug.current, category, excerpt, readMinutes, date, "heroImageUrl": heroImage.asset->url, body}`;

export async function getPosts(): Promise<PostWithImage[]> {
  const docs = await fetchOr<PostDoc[]>(
    `*[_type == "post"] | order(date desc) ${POST_PROJECTION}`,
    [],
  );
  if (docs.length === 0) return postsFallback;
  return docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.category,
    excerpt: d.excerpt,
    readMinutes: d.readMinutes,
    date: d.date,
    body: blocksToParagraphs(d.body),
    heroImageUrl: d.heroImageUrl ?? null,
  }));
}

export async function getPost(slug: string): Promise<PostWithImage | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/* ───────────────────────── lead magnet ───────────────────────── */

export interface LeadMagnetDoc {
  title: string;
  slug: string;
  bullets: string[];
  coverUrl: string | null;
}

export async function getLeadMagnet(): Promise<LeadMagnetDoc> {
  const fallback: LeadMagnetDoc = { ...fallbackMagnet, coverUrl: null };
  const doc = await fetchOr<Partial<LeadMagnetDoc> | null>(
    `*[_id == "leadMagnet"][0]{title, "slug": slug.current, bullets, "coverUrl": cover.asset->url}`,
    null,
  );
  return { ...fallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── community page ───────────────────────── */

export interface CommunityPage {
  chapters: { city: string; status: "Live" | "Coming"; head: string; next: string }[];
  perks: { title: string; description: string }[];
  photoUrl: string | null;
}

const communityFallback: CommunityPage = {
  chapters: [
    { city: "Pune", status: "Live", head: "Chapter head: Anjan Prasad", next: "Next meetup: first meetup soon" },
    { city: "Mumbai", status: "Coming", head: "Chapter head: TBA", next: "" },
    { city: "Bengaluru", status: "Coming", head: "Chapter head: TBA", next: "" },
  ],
  perks: [
    { title: "Meet founders and hiring managers", description: "The room you can't get into on LinkedIn" },
    { title: "Quarterly events in your city", description: "Small, curated, no mic-hogging panels" },
    { title: "First access to founder programs and the fund", description: "Members hear everything first" },
  ],
  photoUrl: null,
};

export async function getCommunityPage(): Promise<CommunityPage> {
  const doc = await fetchOr<Partial<CommunityPage> | null>(
    `*[_id == "communityPage"][0]{chapters, perks, "photoUrl": photo.asset->url}`,
    null,
  );
  return { ...communityFallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── about page ───────────────────────── */

export interface AboutPage {
  problems: { title: string; lead: string; description: string }[];
  values: { title: string; description: string }[];
  studioPhotoUrls: string[];
}

const aboutFallback: AboutPage = {
  problems: [
    {
      title: "The gap between education and employment",
      lead: "A degree tells the world what you studied. Not what you can do.",
      description:
        "Graduates spend years learning concepts, but often get too few opportunities to apply them to real-world problems. When employers ask for experience, knowing the theory isn't always enough. Fundamental bridges that gap through practical, practitioner-led learning.",
    },
    {
      title: "The gap between learning and doing",
      lead: "You don't build skills by just listening. You build them by doing the work.",
      description:
        "Real competence comes from trying, making mistakes, getting feedback and trying again. Yet too much learning ends when the lesson does. At Fundamental, learners work on practical assignments, receive individual feedback and build the confidence to apply their skills beyond the classroom.",
    },
  ],
  values: [
    { title: "Practitioners over professors", description: "Everyone who teaches here still does the work" },
    { title: "Accessibility first", description: "Priced and scheduled so working people can actually attend" },
    { title: "Economic impact as the metric", description: "We count careers corrected, not certificates printed" },
  ],
  studioPhotoUrls: [],
};

export async function getAboutPage(): Promise<AboutPage> {
  const doc = await fetchOr<Partial<AboutPage> | null>(
    `*[_id == "aboutPage"][0]{problems, values, "studioPhotoUrls": studioPhotos[].asset->url}`,
    null,
  );
  return { ...aboutFallback, ...stripNulls(doc ?? {}) };
}

/* ───────────────────────── util ───────────────────────── */

function stripNulls<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}
