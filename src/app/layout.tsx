import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jeong Mat — Kimchi Batch Tracker",
    template: "%s | Jeong Mat",
  },
  description:
    "Track your kimchi fermentation batches with precision. Log recipes, monitor fermentation timelines, and perfect your family kimchi over time.",
  keywords: ["kimchi", "fermentation", "batch tracking", "kimjang", "recipe"],
  openGraph: {
    title: "Jeong Mat — Kimchi Batch Tracker",
    description:
      "Track your kimchi batches, perfect your recipe, honour the tradition.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${notoSansKR.className} h-full`}>
        <body className="min-h-full flex flex-col bg-bg text-text antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
