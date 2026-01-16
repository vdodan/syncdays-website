import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SyncDays - Plan Your Life Together",
  description: "The shared calendar for families, friends, and anyone who doesn't want to merge Google Calendars. Plan in days, not hours.",
  keywords: ["calendar", "family planner", "shared calendar", "life planning", "habit tracker"],
  authors: [{ name: "SyncDays" }],
  openGraph: {
    title: "SyncDays - Plan Your Life Together",
    description: "The shared calendar for families, friends, and anyone who doesn't want to merge Google Calendars.",
    url: "https://syncdays.com",
    siteName: "SyncDays",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncDays - Plan Your Life Together",
    description: "The shared calendar for families, friends, and anyone who doesn't want to merge Google Calendars.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
