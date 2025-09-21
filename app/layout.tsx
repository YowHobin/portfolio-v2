

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import ClickSpark from "@/components/common/ClickSpark";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lenard Arellano — Full‑Stack Developer",
  description:
    "Portfolio of Lenard Arellano, full‑stack developer crafting performant, accessible web applications.",
  icons: { icon: "/icon.png" },
  metadataBase: new URL("https://lenard-portfoliov2.vercel.app"),
  openGraph: {
    title: "Lenard Arellano — Full‑Stack Developer",
    description:
      "Portfolio of Lenard Arellano, full‑stack developer crafting performant, accessible web applications.",
    url: "https://lenard-portfoliov2.vercel.app",
    siteName: "Lenard Arellano Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const STORAGE_KEY='theme'; const DARK='dark'; const LIGHT='light'; const stored = localStorage.getItem(STORAGE_KEY); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const theme = stored || (prefersDark ? DARK : LIGHT); if (theme === DARK) { document.documentElement.classList.add('dark'); document.documentElement.setAttribute('data-theme', DARK); } else { document.documentElement.classList.remove('dark'); document.documentElement.removeAttribute('data-theme'); } } catch(_){} })();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <ScrollProgress />
          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <footer className="mt-24 pb-8">
            <div className="mx-auto max-w-6xl px-4 w-full text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lenard Arellano. All rights reserved.
            </div>
          </footer>
        </ClickSpark>
      </body>
    </html>
  );
}
