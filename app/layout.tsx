import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JoEL - Joy of Engineering Lab | PES University",
    template: "%s | JoEL - PES University",
  },
  description:
    "Official website of JoEL (Joy of Engineering Lab), Department of Electronics & Communication Engineering, PES University. Fostering innovation, collaboration, and excellence in engineering education.",
  keywords: [
    "JoEL",
    "PES University",
    "Engineering Lab",
    "Electronics",
    "Communication Engineering",
    "Innovation",
    "HackeZee",
    "JIMPPS",
    "RoadShow",
    "Bootstrap",
    "Electronic Kit Distribution"
  ],
  authors: [{ name: "JoEL - Joy of Engineering Lab" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://joel.pes.edu",
    siteName: "JoEL - Joy of Engineering Lab",
    title: "JoEL - Joy of Engineering Lab | PES University",
    description:
      "Fostering innovation and excellence in Electronics & Communication Engineering at PES University.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JoEL - Joy of Engineering Lab",
    description: "Innovation Lab at PES University ECE Department",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}