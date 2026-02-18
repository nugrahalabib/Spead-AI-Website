import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://spead.ai";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Spead AI - Enterprise Intelligence",
  description:
    "Indonesia's No.1 Administrative AI. Transform your workflow with AI-powered automation, intelligent document processing, and enterprise-grade security.",
  keywords: [
    "AI",
    "Enterprise AI",
    "Spead AI",
    "Indonesia AI",
    "Automation",
    "Document Processing",
    "Administrative AI",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: baseUrl,
    siteName: "Spead AI",
    title: "Spead AI - Enterprise Intelligence",
    description: "Indonesia's No.1 Administrative AI.",
    images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: "Spead AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spead AI - Enterprise Intelligence",
    description: "Indonesia's No.1 Administrative AI.",
    creator: "@speadai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // console.log("parr", locale);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={`${inter.className} bg-foreground text-foreground`}>
        <NextIntlClientProvider>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
