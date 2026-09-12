import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WishlistProvider } from "@/modules/wishlist/context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Catálogo de Roupas",
  description: "Escolha suas peças favoritas e envie sua lista diretamente pelo WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#fcfbf9] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}
