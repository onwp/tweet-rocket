import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TweetRocket — Write Viral Tweets with Algorithm Intelligence",
  description:
    "Powered by the actual X algorithm source code. TweetRocket analyzes 19 ranking signals to craft tweets that maximize your reach on X.",
  openGraph: {
    title: "TweetRocket — Write Viral Tweets with Algorithm Intelligence",
    description:
      "Craft tweets optimized for X's Grok-powered algorithm. Analyze 19 ranking signals, maximize engagement, and go viral.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
