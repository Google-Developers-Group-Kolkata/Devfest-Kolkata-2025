import type { Metadata } from "next";
import {
  Outfit,
  DM_Sans,
  Google_Sans_Code,
  Noto_Sans_Bengali,
} from "next/font/google";
import "./globals.css";

/* ── Type system ──────────────────────────────────────────────────────────
   Google Sans / Product Sans are not licensed on Google Fonts, so the site
   used to request families that never resolved and silently fell back to
   system-ui. These four are all real, self-hosted Google Fonts picked to
   match the Google brand voice:
     Outfit            → geometric display face, closest open match to
                         Google Sans Display / Product Sans
     DM Sans           → humanist-geometric body face, pairs with Outfit
     Google Sans Code  → Google's own monospace, for labels & eyebrow text
     Noto Sans Bengali → Bengali script support (Kolkata copy)             */

const displayFont = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const monoFont = Google_Sans_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gs-code",
  // Google Sans Code has no entry in the fallback-metrics table, so let
  // next/font skip the size-adjust shim and name the fallback explicitly.
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const bengaliFont = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-noto-bengali",
});

export const metadata: Metadata = {
  title: "DevFest - Google Developer Groups",
  description: "Official DevFest website powered by Google Developer Groups",
  icons: {
    icon: [
      { url: "/logo-brackets.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo-brackets.svg",
    apple: "/logo-brackets.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${bengaliFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
