import type { Metadata, Viewport } from "next";
import { Archivo_Black, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

/* Display / numerals — heavy & confident (DESIGN_SYSTEM.md: Archivo Black fallback;
   Clash Display is not on Google Fonts, so Archivo Black is the production face). */
const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

/* Body / UI */
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});

/* Accent — tags, badges, playful microcopy */
const accent = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-accent-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Cup 2026 — Prediction League",
  description: "Predict scores, fill your bracket, climb the league. Invite-only.",
  applicationName: "WC 2026 League",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ecdd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0916" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* Set the theme before first paint to avoid a flash of the wrong theme.
   Runs synchronously in <head>, ahead of hydration. */
const themeScript = `(function(){try{var t=localStorage.getItem("wc26-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Runs before paint to set the theme and avoid a flash of the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
