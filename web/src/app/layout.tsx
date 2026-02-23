import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
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
  title: "XPACE ON | Streaming para Dança",
  description: "Plataforma de streaming educacional voltada para criadores de conteúdo de dança e suas comunidades.",
  openGraph: {
    title: "XPACE ON | Streaming para Dança",
    description: "Plataforma de streaming educacional voltada para criadores de conteúdo de dança e suas comunidades.",
    url: "https://xpace.on", // Placeholder for actual prod domain
    siteName: "XPACE ON",
    images: [
      {
        url: "/images/bg-degrade.png", // Fallback OG image
        width: 1200,
        height: 630,
        alt: "XPACE ON Cover",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XPACE ON",
    description: "Sua nova academia de dança online.",
  },
};

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
        {children}
      </body>
    </html>
  );
}
