import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloater from "@/components/WhatsAppFloater";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";
import { getAnnouncement, getSettings } from "@/lib/cms";
import { SITE_NAME, SITE_URL, getSeoDefaults } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  // Site-wide SEO defaults are editable in Sanity → Site settings.
  const seo = await getSeoDefaults();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.seoTitle,
      template: "%s | Fundamental Institute",
    },
    description: seo.seoDescription,
    ...(seo.seoKeywords.length ? { keywords: seo.seoKeywords } : {}),
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [announcement, settings] = await Promise.all([
    getAnnouncement(),
    getSettings(),
  ]);
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.svg`,
            email: settings.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressLocality: "Pune",
              addressCountry: "IN",
            },
            // Social profiles (Sanity → Site settings → socials) strengthen
            // the knowledge-graph entity for SEO and AI answer engines.
            ...(settings.socials.filter((s) => s.url && s.url !== "#").length
              ? {
                  sameAs: settings.socials
                    .filter((s) => s.url && s.url !== "#")
                    .map((s) => s.url),
                }
              : {}),
          }}
        />
        <Header announcement={announcement} />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloater link={settings.whatsappLink} />
        <CookieConsent />
      </body>
    </html>
  );
}
