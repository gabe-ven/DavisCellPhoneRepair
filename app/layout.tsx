import type { Metadata } from "next";
import { Dancing_Script, Instrument_Serif, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Davis Cell Phone Repair — Repaired right. Right here in Davis.",
  description:
    "Davis' #1 rated phone repair shop. 4.6 ★ · 131 Google Reviews. iPhone & Android screen, battery, charging port, water damage and more. Walk-ins welcome. Family-owned on B Street since 2017.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${dancing.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
