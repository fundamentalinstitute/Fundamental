import type { AccordionItem } from "@/components/Accordion";

/**
 * Static page content. In production, most of this moves to Sanity
 * (headless CMS) exactly as in the Sapiens architecture — kept here as typed
 * data so pages render identically once the CMS is wired in.
 */

export const homeFaq: AccordionItem[] = [
  {
    q: "Do I need a marketing background?",
    a: "No. The program starts from fundamentals and is built for graduates from any stream, career switchers from sales, ops or engineering, and working professionals. If you can commit to the live hours and weekly briefs, you have the background you need.",
  },
  {
    q: "What are the class timings?",
    a: "Online runs Monday, Wednesday and Friday, 8:30 to 10 PM — after work hours. Offline runs Saturday and Sunday, 2 to 4 PM at the Hinjewadi studio in Pune, built for working professionals.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. EMI options start from ₹4,999 a month through our payment partner. A counsellor will walk you through the exact plans on your free call before you commit to anything.",
  },
  {
    q: "How does the internship for the top 20% work?",
    a: "The top 20% of each batch, selected on assignment and capstone performance, earn an internship of up to 4 months with partner companies. It is earned, not guaranteed — that is the whole point.",
  },
  {
    q: "What if I miss a class?",
    a: "Online sessions are recorded and available to rewatch. If you miss an offline weekend session, your mentor helps you catch up with the recording and notes before the next brief is due.",
  },
  {
    q: "What is the refund policy?",
    a: "You can request a full refund within the first week of the batch, no questions asked. After that, refunds are prorated as described in the refund policy page.",
  },
];

export const programFaq: AccordionItem[] = [
  {
    q: "Prerequisites",
    a: "None beyond a degree (completed or in final year) and working English. No marketing background needed — the first module builds the foundation everyone works from.",
  },
  {
    q: "Do I need a laptop?",
    a: "Yes. Weekly briefs are real deliverables — decks, sheets, ad accounts — and you will need your own laptop for them, online or offline.",
  },
  {
    q: "Class timings",
    a: "Online: Mon, Wed, Fri, 8:30 to 10 PM. Offline: Sat and Sun, 2 to 4 PM at the Hinjewadi studio, Pune.",
  },
  {
    q: "Missed classes and recordings",
    a: "Every online session is recorded and available for the length of the program. Offline learners get the recordings too.",
  },
  {
    q: "EMI and how the payment link works",
    a: "After your counsellor call you receive a payment link. It supports UPI, cards, net banking and EMI from ₹4,999 a month. Your seat is confirmed the moment payment clears.",
  },
  {
    q: "Refund window",
    a: "Full refund within the first week of the batch. Prorated after that — see the refund policy.",
  },
  {
    q: "Certificate",
    a: "A certificate of completion signed by the founder, issued when you finish the curriculum and submit the capstone.",
  },
  {
    q: "How is the top 20% selected?",
    a: "On weekly assignment scores plus capstone review. The rule is published to the batch on day one so everyone knows what they are playing for.",
  },
  {
    q: "Offline location",
    a: "The Fundamental studio in Hinjewadi, Pune. Address and map are on the contact page.",
  },
  {
    q: "I'm outside Pune",
    a: "Join the online batch — same curriculum, same mentoring, same certificate and internship eligibility. Timings are 8:30 to 10 PM IST.",
  },
];

export const counsellingFaq: AccordionItem[] = [
  {
    q: "Is it free?",
    a: "Yes, completely. The call exists to figure out whether the program fits you — not to pressure you into enrolling. If it is not a fit, we will say so.",
  },
  {
    q: "Who will call me?",
    a: "A counsellor from the Fundamental team who knows the curriculum, batch schedules, fees and EMI options inside out. For edge cases, Anjan joins the call himself.",
  },
  {
    q: "Can a parent join the call?",
    a: "Absolutely — many do. Bring anyone whose opinion matters to your decision; we are happy to answer their questions too.",
  },
];

export const communityFaq: AccordionItem[] = [
  {
    q: "Is it free?",
    a: "Yes. The Founders Club is free to join and stays free. It is how we build the network our learners and founders draw on.",
  },
  {
    q: "Who can join?",
    a: "Founders, working professionals and graduates. If you are building something or want to be around people who are, you belong here.",
  },
  {
    q: "I am not in these cities, can I still join?",
    a: "Yes — pick 'Other' when you join and you will be part of the WhatsApp community. City chapters open as soon as enough members cluster in one place.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  journey: string;
}

/** Labelled honestly: mentored or hired by Anjan until batch 1 graduates. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I'd done two online certificates and still froze in interviews. Eight weeks of real briefs later, I walked a panel through an actual campaign I'd run — and got the offer.",
    name: "Sneha K.",
    journey: "B.Com graduate → Marketing Executive (mentored by Anjan)",
  },
  {
    quote:
      "Coming from sales, I thought marketing was ads. The budgeting and funnel work changed how I pitch — my manager noticed within a month.",
    name: "Rohit D.",
    journey: "Inside sales → Growth Associate (mentored by Anjan)",
  },
  {
    quote:
      "The mock interview at the studio was harder than my real one. That's exactly why the real one went well.",
    name: "Priya M.",
    journey: "Career break → Digital Marketing Analyst (hired by Anjan)",
  },
];

export const learnOutcomes: string[] = [
  "Build a positioning and messaging doc a founder would sign off",
  "Plan and run a paid campaign with a real budget cap",
  "Set up analytics and read a funnel without guessing",
  "Write briefs and copy that survive first contact with a client",
  "Price, package and pitch a marketing retainer",
  "Run a content calendar that ships every week",
  "Present work to a hiring panel with confidence",
  "Ship a capstone campaign end to end",
];

export interface CurriculumModule {
  title: string;
  hours: number;
  detail: string;
  topics: string[];
}

/** 9 modules, 50 hours total — from "Marketing Management: Curriculum". */
export const curriculum: CurriculumModule[] = [
  {
    title: "Marketing & Digital Foundations",
    hours: 6,
    detail:
      "What marketing is, the 4 Ps, STP, the customer purchase funnel, and objectives and KPIs. Then the digital ecosystem — organic vs paid, owned/earned/paid media, and how the funnel works in the digital world.",
    topics: [
      "What marketing is & the 4 Ps",
      "STP and the customer purchase funnel",
      "Objectives and KPIs",
      "The digital ecosystem: organic vs paid",
      "Owned, earned and paid media",
      "Hands-on: map a real brand's funnel",
    ],
  },
  {
    title: "Audience Research",
    hours: 4,
    detail:
      "Audience research basics, segmentation, persona creation and customer journey mapping — so every decision that follows starts from a real person, not a guess.",
    topics: [
      "Audience research basics",
      "Segmentation",
      "Persona creation",
      "Customer journey mapping",
      "Hands-on: two personas + a journey map",
    ],
  },
  {
    title: "Brand & Marketing Strategy",
    hours: 6,
    detail:
      "Brand positioning, voice and tone, the strategy framework, channel strategy, campaign planning and budget allocation — the thinking layer that separates marketers from button-pushers.",
    topics: [
      "Brand positioning, voice and tone",
      "The strategy framework",
      "Channel strategy",
      "Campaign planning",
      "Budget allocation",
      "Hands-on: positioning, channel mix, budget split",
    ],
  },
  {
    title: "Paid Advertising",
    hours: 5,
    detail:
      "Google Ads fundamentals, keyword research, search campaigns and conversion tracking. Meta Ads objectives and audience targeting, ad creatives with AI tools, budgeting and bidding, and optimisation with a quick intro to A/B testing.",
    topics: [
      "Google Ads fundamentals & keyword research",
      "Search campaigns and conversion tracking",
      "Meta Ads objectives and audience targeting",
      "Ad creatives with AI tools",
      "Budgeting, bidding and A/B testing",
      "Hands-on: one Google + one Meta campaign",
    ],
  },
  {
    title: "SEO",
    hours: 10,
    detail:
      "How search works, keyword research with AI tools, on-page SEO, Local SEO and Google Business Profile, and SEO analytics basics — the deepest module in the program.",
    topics: [
      "How search works",
      "Keyword research with AI tools",
      "On-page SEO",
      "Local SEO and Google Business Profile",
      "SEO analytics basics",
      "Hands-on: SEO audit + recommendations",
    ],
  },
  {
    title: "Social Media & Content",
    hours: 6,
    detail:
      "Platform strategy, content pillars, content strategy and calendar, copywriting, content formats and repurposing, and social analytics.",
    topics: [
      "Platform strategy and content pillars",
      "Content strategy and calendar",
      "Copywriting",
      "Content formats and repurposing",
      "Social analytics",
      "Hands-on: a one-month content calendar",
    ],
  },
  {
    title: "Email Marketing & Automation",
    hours: 3,
    detail:
      "Email marketing, lead nurturing, basic automated workflows and an introduction to retargeting.",
    topics: [
      "Email marketing and lead nurturing",
      "Basic automated workflows",
      "Retargeting introduction",
      "Hands-on: a welcome / nurture sequence",
    ],
  },
  {
    title: "Analytics & Reporting",
    hours: 4,
    detail:
      "Marketing KPIs and metrics, GA4 basics, UTM tracking and reporting formats — so you can prove what worked.",
    topics: [
      "Marketing KPIs and metrics",
      "GA4 basics",
      "UTM tracking",
      "Reporting formats",
      "Hands-on: a performance report",
    ],
  },
  {
    title: "Capstone",
    hours: 6,
    detail:
      "You assemble the six deliverables — personas + positioning, strategy + budget, paid campaign, content/social plan, SEO recommendations and a performance report — and present them in the final session.",
    topics: [
      "Personas + positioning",
      "Strategy + budget",
      "Paid campaign",
      "Content & social plan",
      "SEO recommendations",
      "Final presentation",
    ],
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-51-percent-of-graduates-cant-get-hired",
    title: "Why 51% of graduates can't get hired — and what to do about it",
    category: "Careers",
    excerpt:
      "The employability gap isn't about effort. It's about being taught the subject instead of the job. Here's how to close it in 90 days.",
    readMinutes: 6,
    date: "2 Oct 2026",
    body: [
      "Every year, lakhs of graduates leave college with a degree in one hand and a resume nobody calls back in the other. The NASSCOM number that gets quoted — roughly half of graduates unemployable in their field — is not a comment on talent. It is a comment on what colleges optimise for.",
      "Colleges teach the subject: definitions, theories, end-of-chapter questions. Companies hire for the job: can you run the campaign, read the funnel, write the brief, present the work. These are different skills, and the gap between them is exactly the gap an interview exposes.",
      "The fix is not another recorded course. It is reps — real briefs, reviewed by someone from the hiring side, until the work is good enough to show a panel. That is the entire design philosophy behind Fundamental's 50 live hours.",
    ],
  },
  {
    slug: "what-hiring-managers-actually-ask",
    title: "What hiring managers actually ask in a marketing interview",
    category: "Interviews",
    excerpt:
      "After a decade on the hiring side of the table, these are the five questions that separate offers from rejections.",
    readMinutes: 5,
    date: "18 Sep 2026",
    body: [
      "Interviewers rarely ask you to define the 4 Ps. They ask what you would do with a shrinking budget, a campaign that stopped converting, a founder who wants virality by Friday.",
      "The pattern behind every good answer is the same: a real example, a number, and a decision you can defend. Candidates who have only consumed content have none of the three. Candidates who have shipped work — even training work on live accounts — have all of them.",
      "This is why every week of the program ends in a brief, and why the capstone is a campaign you can walk a panel through end to end.",
    ],
  },
  {
    slug: "online-vs-offline-which-batch-fits",
    title: "Online vs offline: which batch actually fits your week?",
    category: "Programs",
    excerpt:
      "Same curriculum, same mentors, two very different rhythms. A practical guide to choosing your mode.",
    readMinutes: 4,
    date: "5 Sep 2026",
    body: [
      "The online batch runs Monday, Wednesday and Friday, 8:30 to 10 PM — focused evening sessions after your workday ends. It suits students and working professionals alike.",
      "The offline batch runs Saturday and Sunday afternoons, 2 to 4 PM, at the Hinjewadi studio. In-person sessions, mock interviews, and the energy of a room. It is built for people who want their weekdays untouched.",
      "Whichever you pick, the curriculum, mentoring, certificate and internship eligibility are identical. Choose the rhythm you can actually sustain for 3 months.",
    ],
  },
];

export const leadMagnet = {
  slug: "marketing-career-switch-checklist",
  title: "The Marketing Career-Switch Checklist",
  bullets: [
    "The 12 skills hiring managers screen for (and the 4 that get you shortlisted)",
    "A 90-day plan from any background to interview-ready",
    "The portfolio pieces that matter more than certificates",
  ],
};
