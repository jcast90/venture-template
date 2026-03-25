import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: config.name + " - " + config.tagline,
  description: config.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased bg-[#0A0A0F] text-white font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
