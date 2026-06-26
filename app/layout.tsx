import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  icons: {
    icon: [{ url: "/vetsai-icon.svg", type: "image/svg+xml" }],
    shortcut: "/vetsai-icon.svg",
    apple: "/vetsai-icon.svg",
  },
  title: "VetsAI — Clinic Operating System",
  description: "AI-powered clinic operating system for veterinary professionals across Africa and beyond.",
  openGraph: {
    title: "VetsAI — Clinic Operating System",
    description: "AI-powered clinical support, patient records and practice management for vets across Africa.",
    url: "https://vetsai.vet",
    siteName: "VetsAI",
    images: [
      {
        url: "https://vetsai.vet/og-image.png",
        width: 1200,
        height: 630,
        alt: "VetsAI — Clinic Operating System",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VetsAI — Clinic Operating System",
    description: "AI-powered clinic operating system for veterinary professionals across Africa.",
    images: ["https://vetsai.vet/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}