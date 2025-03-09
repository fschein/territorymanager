import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Territory Manager",
  description: "Um gerenciador de territórios",
  authors: [{ name: "Jonathan Amarante", url: "https://jon-portfolio.vercel.app/" }],
  openGraph: {
    title: "Territory Manager",
    description: "Gerenciador de territórios de serviço",
    url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/android-chrome-192x192.png",
        width: 190,
        height: 190,
      },
    ],
  },
  icons: {
    icon: "./favicon.ico",
    apple: "./apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
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
