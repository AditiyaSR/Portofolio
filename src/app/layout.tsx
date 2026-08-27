import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aditiya Syaiful Ramadhan | Dual-Domain Engineering Portfolio",
  description: "Interactive portfolio of Aditiya Syaiful Ramadhan — Mechanical Engineer specializing in Materials Science & ICE Optimization, and Full-Stack Software Engineer.",
  keywords: [
    "Mechanical Engineer",
    "Materials Science",
    "Internal Combustion Engine",
    "Full-Stack Engineer",
    "Next.js",
    "TypeScript",
    "SolidWorks",
    "Aditiya Syaiful Ramadhan"
  ],
  authors: [{ name: "Aditiya Syaiful Ramadhan" }],
  openGraph: {
    title: "Aditiya Syaiful Ramadhan | Dual-Domain Engineering Portfolio",
    description: "Interactive Dual CV Portfolio - Mechanical Engineering & Software Engineering Specialist.",
    type: "website",
    locale: "en_US",
    siteName: "Aditiya Syaiful Ramadhan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditiya Syaiful Ramadhan | Dual-Domain Portfolio",
    description: "Mechanical Engineer & Full-Stack Software Engineer Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditiya Syaiful Ramadhan",
    "jobTitle": ["Mechanical Engineer", "Full-Stack Software Engineer"],
    "knowsAbout": [
      "Internal Combustion Engine Optimization",
      "Materials Science",
      "SolidWorks",
      "Next.js",
      "TypeScript",
      "Full-Stack Software Architecture",
      "AI Agent Integration"
    ],
    "description": "Mechanical Engineer specializing in ICE & Materials Science, and Full-Stack Software Engineer.",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
