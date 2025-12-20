import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getGlobalSettings, getAssetUrl } from "@/lib/directus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Force Dynamic Fetching (Real-time updates)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  // LOGIC: Prefer Directus Favicon > Renamed Static > Default
  let iconUrl = '/favicon.old.ico'; // Default fallback (the renamed file)

  if (settings?.favicon) {
    // Directus has a key. Use it.
    const assetUrl = getAssetUrl(settings.favicon);
    if (assetUrl) {
      iconUrl = `${assetUrl}?v=${new Date().getTime()}`; // Cache Buster
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spead.ai';
  const title = settings?.seo_title_template?.replace('%s', settings?.site_name) || settings?.site_name || "Spead AI - Enterprise Intelligence";
  const description = settings?.seo_description_default || "Indonesia's No.1 Administrative AI. Transform your workflow with AI-powered automation, intelligent document processing, and enterprise-grade security.";
  const ogImage = settings?.og_image ? getAssetUrl(settings.og_image) : `${baseUrl}/og-default.jpg`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: ['AI', 'Enterprise AI', 'Spead AI', 'Indonesia AI', 'Automation', 'Document Processing', 'Administrative AI'],
    icons: {
      icon: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: settings?.site_name || 'Spead AI',
      title,
      description,
      images: [
        {
          url: ogImage || `${baseUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: 'Spead AI - Enterprise Intelligence',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || `${baseUrl}/og-default.jpg`],
      creator: '@speadai',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();
  const schemaJson = settings?.organization_schema_json || '{}';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Inject Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
        {/* Inject Custom Head Scripts */}
        {settings?.custom_head_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.custom_head_scripts }} />
        )}
      </head>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Navbar settings={settings} />
        {children}
        <Footer settings={settings} />

        {/* Inject Custom Body Scripts */}
        {settings?.custom_body_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.custom_body_scripts }} />
        )}
      </body>
    </html>
  );
}
