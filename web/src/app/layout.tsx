import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { PowerOnPreloader } from "@/components/ui/power-on";
import { GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";

// Fontes Locais da Marca
const chillax = localFont({
  src: [
    {
      path: "../assets/fonts/Chillax-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Chillax-Semibold.otf",
      weight: "600",
      style: "normal",
    }
  ],
  variable: "--font-chillax",
});

const steelfish = localFont({
  src: [
    {
      path: "../assets/fonts/Steelfish Bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Steelfish Rg.otf",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-steelfish",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xpace.app'),
  title: {
    default: "XPACE — Aprenda Dança do Zero ao Palco",
    template: "%s | XPACE",
  },
  description: "A primeira plataforma premium de streaming para dança. Aprenda Hip-Hop, Breaking, Locking, Jazz e mais com os maiores mestres do Brasil. Sistema gamificado com XP, ranking e certificados.",
  keywords: ["dança", "aulas de dança online", "hip hop", "dance streaming", "coreografia", "locking", "breaking", "xpace", "dança urbana", "escola de dança online", "curso de dança", "breaking", "popping"],
  icons: {
    icon: [
      { url: '/icons/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "XPACE — Aprenda Dança do Zero ao Palco",
    description: "A evolução do streaming ensinando a vida real. Hip-Hop, Breaking, Locking e mais com os maiores mestres. Sistema de XP, ranking e certificados. Abertura: 29 de Abril.",
    url: "https://xpace.app",
    siteName: "XPACE",
    images: [
      {
        url: "/images/og-card.png",
        width: 1200,
        height: 630,
        alt: "XPACE — Plataforma Premium de Streaming para Dança",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XPACE — Aprenda Dança do Zero ao Palco",
    description: "A primeira plataforma premium de streaming para dança. Abertura: 29 de Abril de 2026.",
    images: ["/images/og-card.png"],
  },
};

import { Analytics } from "@vercel/analytics/next";
import { AffiliateTracker } from "@/components/providers/affiliate-tracker";
import { CookieBanner } from "@/components/layout/cookie-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${chillax.variable} ${steelfish.variable} ${poppins.variable} font-sans antialiased text-gray-100 bg-black`}
      >
        {/* Skip Navigation — Acessibilidade WCAG 2.1 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold focus:uppercase focus:tracking-widest"
        >
          Pular para o conteúdo
        </a>
        <PowerOnPreloader>
          <AffiliateTracker />
          <main id="main-content">
            {children}
          </main>
          <CookieBanner />
        </PowerOnPreloader>
        <script dangerouslySetInnerHTML={{
          __html: `
          if (localStorage.getItem('xpace-theme') === 'light') {
            document.documentElement.classList.add('theme-light');
          }
        `}} />
        <Analytics />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </body>
    </html>
  );
}
