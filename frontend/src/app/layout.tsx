
import type { Metadata, Viewport } from "next";
import { Allura, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const weddingDate = "2026-12-27";

export const metadata: Metadata = {
  title: {
    default: "Arsalan & Maria | Wedding Invitation",
    template: "%s | Arsalan & Maria",
  },

  description:
    "With the blessings of Allah, Arsalan Akhtar and Maria Bin-tul Islam invite you to celebrate their wedding on 27 December 2026.",

  applicationName: "Arsalan & Maria Wedding",

  authors: [
    { name: "Arsalan Akhtar" },
    { name: "Maria Bin-tul Islam" },
  ],

  keywords: [
    "Arsalan and Maria",
    "Arsalan Akhtar",
    "Maria Bin-tul Islam",
    "Wedding Invitation",
    "27 December 2026",
    "Muslim Wedding",
  ],

  creator: "Arsalan Akhtar",

  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Arsalan & Maria | Wedding Invitation",
    description:
      "With the blessings of Allah, join us as Arsalan & Maria begin their journey together on 27 December 2026.",
    siteName: "Arsalan & Maria",
    images: [
      {
        url: "/wedding/opening.webp",
        alt: "Arsalan & Maria Wedding Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Arsalan & Maria | Wedding Invitation",
    description:
      "A celebration of love, faith and togetherness. 27 December 2026.",
    images: ["/wedding/opening.webp"],
  },

  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "personal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173f35",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${allura.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f8f4ec]">
        {children}
      </body>
    </html>
  );
}
