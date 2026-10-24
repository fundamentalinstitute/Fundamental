import { defineField, defineType, type SchemaTypeDefinition } from "sanity";
import {
  whatsappMessageDefaults,
  type WhatsAppMessageKey,
} from "../../lib/whatsapp-defaults";

/**
 * All site content lives in these types. Singletons (one document each):
 * siteSettings, homePage, founder, program, aboutPage, communityPage,
 * leadMagnet. Collections: batch (2), curriculumModule, faqItem,
 * testimonial, post.
 */

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({ name: "whatsappNumber", type: "string", description: "Display format, e.g. +91 98765 43210" }),
    defineField({ name: "whatsappLink", type: "url", description: "https://wa.me/91XXXXXXXXXX" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "hours", type: "string" }),
    defineField({ name: "replyPromise", type: "string", description: 'e.g. "2 working hours"' }),
    defineField({ name: "applicationDeadline", type: "string", description: 'e.g. "10 Nov 2026"' }),
    // ── SEO defaults (used site-wide unless a Page SEO document overrides) ──
    defineField({
      name: "seoTitle",
      title: "SEO: default meta title",
      type: "string",
      description:
        'Homepage/default title, ≤ 60 characters. Other pages append " | Fundamental Institute" automatically.',
    }),
    defineField({
      name: "seoDescription",
      title: "SEO: default meta description",
      type: "text",
      rows: 3,
      description: "Default description for pages without their own, ≤ 160 characters.",
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO: site keywords",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Brand/program keywords used site-wide and in the llms.txt file read by AI search engines (ChatGPT, Perplexity, Gemini).",
    }),
    defineField({
      name: "seoOgImage",
      title: "SEO: default social share image",
      type: "image",
      description: "Default 1200×630 image for social shares; pages can override it.",
    }),
    defineField({
      name: "socials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({
              name: "url",
              type: "string",
              description: 'Full URL ("#" keeps it as a placeholder)',
            }),
          ],
        },
      ],
      description: "Footer social links (empty = hidden)",
    }),
  ],
});

const batch = defineType({
  name: "batch",
  title: "Batch",
  type: "document",
  fields: [
    defineField({
      name: "mode",
      type: "string",
      options: { list: ["online", "offline"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string" }),
    defineField({ name: "schedule", type: "string", description: 'e.g. "Mon, Wed, Fri, 8:30 to 10 PM"' }),
    defineField({ name: "startDate", type: "string", description: 'e.g. "16 Nov 2026"' }),
    defineField({ name: "seats", type: "number" }),
    defineField({ name: "seatsLeft", type: "number" }),
    defineField({ name: "listPrice", type: "number" }),
    defineField({ name: "offerPrice", type: "number" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "includes", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { select: { title: "label", subtitle: "startDate" } },
});

const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", type: "string" }),
    defineField({ name: "heroHeadlineTop", type: "string", description: 'First line, e.g. "Not a course."' }),
    defineField({ name: "heroHeadlineAccent", type: "string", description: "Second line (shown in brand green)" }),
    defineField({ name: "heroSupporting", type: "text", rows: 3 }),
    defineField({ name: "programDescription", type: "text", rows: 2, description: '"The program" section one-liner' }),
    defineField({ name: "collegeItems", title: "What college prepared you for", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "industryItems", title: "What the industry expects", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", description: 'e.g. "39 in 100"' }),
            defineField({ name: "caption", type: "string" }),
            defineField({ name: "sourceLabel", type: "string" }),
            defineField({ name: "sourceUrl", type: "url" }),
          ],
          preview: { select: { title: "value", subtitle: "caption" } },
        },
      ],
    }),
    defineField({
      name: "methodSteps",
      title: "How your 3 months work",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
        },
      ],
    }),
  ],
});

const founder = defineType({
  name: "founder",
  title: "Founder",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "homeBlurb", type: "text", rows: 3, description: "Short bio on the home page" }),
    defineField({ name: "shortBio", type: "string", description: "One line (waitlist page)" }),
    defineField({ name: "aboutParagraphs", type: "array", of: [{ type: "text", rows: 3 }], description: "About page bio" }),
    defineField({
      name: "carouselPhotos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }],
      description: "Home carousel — landscape 4:3, min 1600×1200 px",
    }),
    defineField({
      name: "aboutPhoto",
      type: "image",
      options: { hotspot: true },
      description: "About page portrait — 2:3, min 1200×1800 px",
    }),
    defineField({ name: "videoUrl", type: "url", description: "Founder intro video (MP4 URL, 16:9 1920×1080)" }),
    defineField({
      name: "journey",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "period", type: "string", description: 'e.g. "2010–2012"' }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "period", subtitle: "title" } },
        },
      ],
    }),
  ],
});

const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "promise", type: "string", description: "One-line promise under the program hero" }),
    defineField({ name: "cardPromise", type: "string", description: "One-liner on the programs listing card" }),
    defineField({
      name: "personas",
      title: "Who this is for",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "subtitle", type: "string" }),
            defineField({ name: "leavesWith", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "outcomes", title: "What you'll learn", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "curriculumOverline",
      type: "string",
      description: 'Small label above the curriculum heading, e.g. "Program learning outcomes and content"',
    }),
    defineField({
      name: "curriculumHeading",
      type: "string",
      description: 'Curriculum section heading — last word renders in green, e.g. "What will you learn?"',
    }),
    defineField({
      name: "curriculumIntro",
      type: "text",
      rows: 3,
      description: "Paragraph beside the curriculum heading",
    }),
    defineField({ name: "internshipRule", type: "text", rows: 3 }),
    defineField({ name: "certificateText", type: "text", rows: 2 }),
    defineField({ name: "image", type: "image", description: "Programs listing card image — 800×300 px", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
  ],
});

const curriculumModule = defineType({
  name: "curriculumModule",
  title: "Curriculum module",
  type: "document",
  fields: [
    defineField({ name: "order", type: "number" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "hours", type: "number" }),
    defineField({ name: "detail", title: "Overview", type: "text", rows: 4 }),
    defineField({
      name: "topics",
      type: "array",
      of: [{ type: "string" }],
      description: "Checklist shown in the module detail panel",
    }),
    defineField({ name: "icon", type: "string", description: "Emoji, e.g. 📘" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "hours" } },
});

const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "document",
  fields: [
    defineField({
      name: "group",
      type: "string",
      options: { list: ["home", "program", "counselling", "community"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "question", type: "string" }),
    defineField({ name: "answer", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "question", subtitle: "group" } },
});

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "order", type: "number" }),
    defineField({ name: "quote", type: "text", rows: 3 }),
    defineField({ name: "name", type: "string" }),
    defineField({ name: "journey", type: "string", description: "Before → After (role / company)" }),
    defineField({ name: "photo", type: "image", description: "Square headshot — min 400×400 px", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
  ],
});

const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "excerpt", type: "text", rows: 2 }),
    defineField({ name: "readMinutes", type: "number" }),
    defineField({ name: "date", type: "string", description: 'e.g. "2 Oct 2026"' }),
    defineField({ name: "heroImage", type: "image", description: "2:1 landscape — min 1600×800 px", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
  ],
});

const leadMagnet = defineType({
  name: "leadMagnet",
  title: "Lead magnet",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", validation: (r) => r.required() }),
    defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "cover", type: "image", description: "Portrait cover — 800×1000 px", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
  ],
});

const communityPage = defineType({
  name: "communityPage",
  title: "Community page",
  type: "document",
  fields: [
    defineField({
      name: "chapters",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "city", type: "string" }),
            defineField({ name: "status", type: "string", options: { list: ["Live", "Coming"] } }),
            defineField({ name: "head", type: "string" }),
            defineField({ name: "next", type: "string", description: "Next meetup line (optional)" }),
          ],
          preview: { select: { title: "city", subtitle: "status" } },
        },
      ],
    }),
    defineField({
      name: "perks",
      title: "What members get",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "photo", type: "image", description: "Community/meetup photo — 1200×650 px", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
  ],
});

const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "problems",
      title: "The problems we're here to solve",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "lead", type: "string", description: "Bold first line" }),
            defineField({ name: "description", type: "text", rows: 4 }),
          ],
        },
      ],
    }),
    defineField({
      name: "values",
      title: "What we believe",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "studioPhotos",
      type: "array",
      of: [{ type: "image", fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }],
      description: "Studio gallery — 800×500 px each",
    }),
  ],
});

const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "path",
      type: "string",
      description: 'Page path, e.g. "/", "/about", "/blog/my-post"',
      validation: (r) => r.required().regex(/^\//, { name: "path starting with /" }),
    }),
    defineField({ name: "metaTitle", type: "string", description: "≤ 60 characters" }),
    defineField({ name: "metaDescription", type: "text", rows: 3, description: "≤ 160 characters" }),
    defineField({
      name: "keywords",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Optional focus keywords/phrases for this page (meta keywords + AI answer engines).",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description:
        "Shown when this page is shared on WhatsApp/LinkedIn/X. Ideal 1200×630. Falls back to the site default.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Turn on to add noindex to this page.",
      initialValue: false,
    }),
    defineField({
      name: "jsonLd",
      title: "Structured data (JSON-LD)",
      type: "text",
      rows: 8,
      description:
        "Optional raw JSON-LD object for this page. Must be valid JSON or it is ignored. The site already emits Organization, Course, BlogPosting and FAQPage schema automatically — only add types that are not covered, to avoid duplicates.",
      validation: (r) =>
        r.custom((v) => {
          if (!v) return true;
          try {
            JSON.parse(v);
            return true;
          } catch {
            return "Not valid JSON";
          }
        }),
    }),
  ],
  preview: { select: { title: "path", subtitle: "metaTitle" } },
});

/**
 * Prefilled WhatsApp messages, one per form type. Opened on the visitor's
 * phone after a successful submission — the visitor still presses Send.
 * Placeholders {{name}}, {{programName}}, {{batchName}}, {{reference}},
 * {{schedule}}, {{startDate}}, {{location}} and {{fee}} are replaced with the
 * visitor's actual form values (and removed cleanly when a value is missing).
 */
const whatsappMessageField = (
  name: string,
  title: string,
  description: string,
) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 4,
    description,
    initialValue: whatsappMessageDefaults[name as WhatsAppMessageKey],
    validation: (r) => r.max(900),
  });

const whatsappMessages = defineType({
  name: "whatsappMessages",
  title: "WhatsApp messages",
  type: "document",
  fields: [
    whatsappMessageField(
      "counselling",
      "Counselling enquiry",
      "Sent after the free-counselling forms (homepage and /counselling). Placeholders: {{name}}, {{programName}}.",
    ),
    whatsappMessageField(
      "enrolOnline",
      "Enrolment — Online batch",
      "Sent after an Online enrolment application. Placeholders: {{name}}, {{programName}}, {{batchName}}, {{schedule}}, {{startDate}}, {{fee}}, {{reference}}.",
    ),
    whatsappMessageField(
      "enrolOffline",
      "Enrolment — Offline batch",
      "Sent after an Offline enrolment application. Placeholders: {{name}}, {{programName}}, {{batchName}}, {{schedule}}, {{startDate}}, {{location}}, {{fee}}, {{reference}}.",
    ),
    whatsappMessageField(
      "brochure",
      "Brochure request",
      "Sent after the brochure form. Placeholders: {{name}}.",
    ),
    whatsappMessageField(
      "community",
      "Community signup",
      "Sent after the Founders Club join form. Placeholders: {{name}}.",
    ),
    whatsappMessageField(
      "contact",
      "Contact enquiry",
      "Used for the contact form's WhatsApp link on the thank-you page. Placeholders: {{name}}.",
    ),
    whatsappMessageField(
      "waitlist",
      "Waitlist",
      "Used for waitlist signups. Placeholders: {{name}}, {{programName}}.",
    ),
    whatsappMessageField(
      "notify",
      "Notify Me",
      "Used for Notify Me signups. Placeholders: {{name}}, {{programName}}.",
    ),
  ],
  preview: { prepare: () => ({ title: "WhatsApp messages" }) },
});

export const schemaTypes: SchemaTypeDefinition[] = [
  pageSeo,
  siteSettings,
  whatsappMessages,
  batch,
  homePage,
  founder,
  program,
  curriculumModule,
  faqItem,
  testimonial,
  post,
  leadMagnet,
  communityPage,
  aboutPage,
];
