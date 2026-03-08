import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <meta name="theme-color" content="#10b981" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {children}
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}