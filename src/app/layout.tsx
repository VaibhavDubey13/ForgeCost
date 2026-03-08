import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "ForgeCost — Material Cost Calculator for Tradespeople",
    template: "%s | ForgeCost",
  },
  description:
    "Stop undercharging. ForgeCost helps plumbers, electricians, HVAC techs, carpenters, painters and other tradespeople calculate exact material costs with markup — and generate professional PDF quotes instantly. Free forever.",
  keywords: [
    "material cost calculator",
    "tradesperson quote generator",
    "plumber estimate tool",
    "electrician quote calculator",
    "contractor pricing tool",
    "HVAC material cost",
    "carpenter quote",
    "painter estimate",
    "welder quote",
    "free PDF quote generator",
    "markup calculator trades",
    "job cost calculator",
  ],
  authors: [{ name: "ForgeCost" }],
  creator: "ForgeCost",
  metadataBase: new URL("https://forge-cost.vercel.app"),
  alternates: { canonical: "/" },

  // ── PWA ──────────────────────────────────────────────────────────────────
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ForgeCost",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forge-cost.vercel.app",
    siteName: "ForgeCost",
    title: "ForgeCost — Material Cost Calculator for Tradespeople",
    description:
      "Stop undercharging. Calculate exact material costs, apply your markup, and download a professional PDF quote in seconds. Free for solo tradespeople.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ForgeCost — Material Cost Calculator for Tradespeople",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeCost — Material Cost Calculator for Tradespeople",
    description:
      "Stop undercharging. Calculate exact material costs, apply your markup, and download a professional PDF quote in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png",   sizes: "72x72",   type: "image/png" },
      { url: "/icons/icon-96x96.png",   sizes: "96x96",   type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* iOS PWA full-screen meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ForgeCost" />
        {/* MS tiles */}
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {children}
        <FeedbackWidget />
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  );
}