

import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarNav from "@/components/common/SidebarNav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ClickSpark from "@/components/common/ClickSpark";
import ThemeToggle from "@/components/ui/ThemeToggle";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const COOKIE_NAME='theme'; const STORAGE_KEY='theme'; const DARK='dark'; const LIGHT='light'; const readCookie=(n)=>{const m=document.cookie.match(new RegExp('(?:^|; )'+n.replace(/[.$?*|{}()\[\]\\\/\+^]/g,'\\$&')+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}; const writeCookie=(n,v)=>{document.cookie = n+'='+encodeURIComponent(v)+'; Max-Age=31536000; Path=/; SameSite=Lax';}; const cookie = readCookie(COOKIE_NAME); const stored = cookie || localStorage.getItem(STORAGE_KEY); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const desired = stored || (prefersDark ? DARK : LIGHT); const html = document.documentElement; const hasDark = html.classList.contains('dark') || html.getAttribute('data-theme') === DARK; if (desired === DARK && !hasDark) { html.classList.add('dark'); html.setAttribute('data-theme', DARK); } else if (desired !== DARK && hasDark) { html.classList.remove('dark'); html.removeAttribute('data-theme'); } if (cookie !== desired) { writeCookie(COOKIE_NAME, desired); } } catch(_){} })();`,
          }}
        />
        <Script
          id="header-fallback"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => { try { if (window.scrollY < 2 && !location.hash) { document.documentElement.classList.add('at-hero'); } } catch(_){} })();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <ScrollProgress />
          <SidebarNav />
          <main className="overflow-x-hidden">{children}</main>
          <div className="fixed left-6 bottom-6 z-50">
            <ThemeToggle />
          </div>
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
