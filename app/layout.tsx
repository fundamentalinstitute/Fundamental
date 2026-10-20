import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloater from "@/components/WhatsAppFloater";
import { getAnnouncement, getSettings } from "@/lib/cms";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://fundamental.institute"),
  title: {
    default: "Fundamental Institute — Not a course. A career correction.",
    template: "%s | Fundamental Institute",
  },
  description:
    "Live, practitioner-led Marketing Management program in Pune and online. 50 live hours, small batches, internship for the top 20%.",
};

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
        <Header announcement={announcement} />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloater link={settings.whatsappLink} />
      </body>
    </html>
  );
}
