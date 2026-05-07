import { Geist_Mono, Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Header } from "@/components/common/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "IntellMeet",
  title: {
    default: "IntellMeet | Smart meetings, AI summaries, and team collaboration",
    template: "%s | IntellMeet",
  },
  description:
    "IntellMeet is a production-ready meeting workspace for live collaboration, AI summaries, action items, transcripts, and team analytics.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "IntellMeet",
    title: "IntellMeet | Smart meetings, AI summaries, and team collaboration",
    description:
      "Run collaborative meetings, generate summaries, and keep action items organized in one fast workspace.",
    images: [
      {
        url: "/Logo.svg",
        width: 512,
        height: 512,
        alt: "IntellMeet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntellMeet | Smart meetings, AI summaries, and team collaboration",
    description:
      "Collaborative meetings with AI summaries, transcripts, and action-item tracking.",
    images: ["/Logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark antialiased", poppins.variable, fontMono.variable)}
    >
      <body className="bg-background font-sans text-foreground">
        <Header />
        <main className="relative z-10 pt-24">{children}</main>
      </body>
    </html>
  );
}