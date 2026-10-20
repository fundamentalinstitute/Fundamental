import Link from "next/link";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import { getSettings } from "@/lib/cms";

const columns = [
  {
    title: "Programs",
    links: [
      { label: "Marketing Management (Online)", href: "/programs/marketing-management?mode=online" },
      { label: "Marketing Management (Offline)", href: "/programs/marketing-management?mode=offline" },
      { label: "Upcoming programs", href: "/programs" },
      { label: "Download brochure", href: "/brochure" },
    ],
  },
  {
    title: "Institute",
    links: [
      { label: "About Anjan", href: "/about" },
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Counselling", href: "/counselling" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund policy", href: "/refund-policy" },
    ],
  },
];

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="bg-brand text-white">
      {/* Notify-me band */}
      <div className="border-b border-white/15">
        <div className="container-site flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold">
            Get notified when the next batch opens
          </p>
          <div className="w-full max-w-sm">
            <LeadForm
              leadType="notify"
              fields={[{ name: "email", label: "Email", type: "email", required: true }]}
              submitLabel="Notify me"
              inlineSuccess="You're on the list. We'll email you when the next batch opens."
            />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="container-site grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Image src="/logo-light.svg" alt="Fundamental Institute" width={170} height={34} />
          <p className="text-sm text-white/80">
            Live, practitioner-led training that corrects careers — not another
            recorded course.
          </p>
          <p className="text-xs text-white/70">
            {settings.address}
            <br />
            {settings.hours}
          </p>
          <p className="text-xs text-white/70">
            <a href={settings.whatsappLink} className="hover:text-white">
              WhatsApp {settings.whatsappNumber}
            </a>
            <br />
            <a href={`mailto:${settings.email}`} className="hover:text-white">
              {settings.email}
            </a>
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-2">
            <p className="text-sm font-bold">{col.title}</p>
            {col.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/75 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Fundamental · fundamental.institute</span>
          {/* Social links render only once added in the CMS (Site settings → socials) */}
          {settings.socials.length > 0 && (
            <span className="flex gap-4">
              {settings.socials.map((s) => (
                <a key={s.label} href={s.url} className="hover:text-white">
                  {s.label}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
