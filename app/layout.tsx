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
  metadataBase: new URL("https://nevues.com"),
  title: "Nevue — Understand the Events Moving the World",
  description:
    "Nevue explains important global events through their financial, business, and market impact.",
  applicationName: "Nevue",
  creator: "Nevue",
  publisher: "Nevue",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Nevue — Understand the Events Moving the World",
    description:
      "Nevue explains important global events through their financial, business, and market impact.",
    type: "website",
    url: "/",
    siteName: "Nevue",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Nevue — Understand the Events Moving the World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nevue — Understand the Events Moving the World",
    description:
      "Nevue explains important global events through their financial, business, and market impact.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
