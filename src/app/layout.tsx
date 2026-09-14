import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WishlistProvider } from '@/modules/wishlist/context'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  title:
    'Catálogo By Jessica Lindsey | Consultora Canal Concept - Anália Franco',
  description:
    'Catálogo exclusivo da Consultora Jessica Lindsey - Canal Concept Anália Franco. Selecione suas peças favoritas na lista de desejos e solicite atendimento via WhatsApp.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F7F7F7] text-[#111111] font-sans antialiased selection:bg-black selection:text-white">
        <WishlistProvider>{children}</WishlistProvider>
      </body>
    </html>
  )
}
