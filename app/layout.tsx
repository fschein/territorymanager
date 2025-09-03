import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Territory Manager",
  description: "Um gerenciador de territórios de serviço de campo",
  keywords: ["território", "testemunhas", "jeová", "pregação", "serviço de campo"],
  authors: [{ name: "Jonathan Amarante", url: "https://jonportfolio.vercel.app/" }],

  // Open Graph (Facebook, WhatsApp, etc)
  openGraph: {
    title: "Territory Manager",
    description:
      "Gerenciador de territórios de serviço de campo - Organize e gerencie territórios de pregação",
    url: process.env.NEXT_PUBLIC_URL || "http://localhost:5173",
    siteName: "Territory Manager",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png", // Criar esta imagem 1200x630px
        width: 1200,
        height: 630,
        alt: "Territory Manager - Gerenciador de Territórios",
      },
      {
        url: "/pwa/android/android-launchericon-512-512.png",
        width: 512,
        height: 512,
        alt: "Territory Manager Logo",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Territory Manager",
    description: "Gerenciador de territórios de serviço de campo",
    images: ["/og-image.png"],
  },

  // Outros metadados
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/pwa/ios/16.png", sizes: "16x16", type: "image/png" },
      { url: "/pwa/ios/32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/pwa/ios/180.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/pwa/ios/16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/pwa/ios/32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/pwa/ios/180.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <QueryProvider>
            {children}
            <Toaster richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
