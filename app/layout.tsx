import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Davis Cell Phone Repair — Same-Day Phone Repair in Davis, CA",
  description:
    "Davis' #1 rated phone repair shop. iPhone & Android screen, battery, charging port, water damage, and more. Walk-ins welcome. 4.6 ★ · 131 Google Reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
