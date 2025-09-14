import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";

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
  description: "Portfolio of Lenard Arellano, full‑stack developer crafting performant, accessible web applications.",
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Lenard Arellano — Full‑Stack Developer",
    description:
      "Portfolio of Lenard Arellano, full‑stack developer crafting performant, accessible web applications.",
    url: "https://example.com",
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
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const s = localStorage.getItem('theme');
                const m = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (s === 'dark' || (!s && m)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ScrollProgress />
        <Header />
        <main>{children}</main>
        <footer className="mt-24 pb-8">
          <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lenard Arellano. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
