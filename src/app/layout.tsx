import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spead.ai';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Spead AI - Enterprise Intelligence",
  description: "Indonesia's No.1 Administrative AI. Transform your workflow with AI-powered automation, intelligent document processing, and enterprise-grade security.",
  keywords: ['AI', 'Enterprise AI', 'Spead AI', 'Indonesia AI', 'Automation', 'Document Processing', 'Administrative AI'],
  icons: {
    icon: '/favicon.old.ico',
    apple: '/favicon.old.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'Spead AI',
    title: "Spead AI - Enterprise Intelligence",
    description: "Indonesia's No.1 Administrative AI.",
    images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: 'Spead AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Spead AI - Enterprise Intelligence",
    description: "Indonesia's No.1 Administrative AI.",
    creator: '@speadai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
