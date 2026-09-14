import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WishlistProvider } from "@/modules/wishlist/context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Canal Concept | Catálogo Oficial de Moda Feminina",
  description: "Descubra a coleção exclusiva da Canal Concept. Selecione suas peças favoritas e finalize seu atendimento diretamente pelo WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F7F7F7] text-[#111111] font-sans antialiased selection:bg-black selection:text-white">
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}
