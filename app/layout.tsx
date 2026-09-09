import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
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
    <html lang="en" className={`${openSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Google Sans / Product Sans font stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Google+Sans+Display:wght@400;500;700&family=Google+Sans+Text:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;600;700;800;900&family=Product+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-google-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
