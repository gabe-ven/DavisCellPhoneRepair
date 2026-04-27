import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dancing.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
