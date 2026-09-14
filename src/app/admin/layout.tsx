import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ExternalLink, Sparkles } from 'lucide-react'
import { isAuthenticatedAdmin } from '@/modules/admin/auth'
import { logoutAdminAction } from '@/modules/admin/actions'

export const metadata = {
  title: 'Painel Administrativo | Catálogo de Roupas'
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isAuth = await isAuthenticatedAdmin()

  // If on login page, let it render without wrapper
  // Note: App Router sub-route /admin/login handles its own layout, but since this is /admin/layout.tsx,
  // we check if this is the login route or protected dashboard.
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {isAuth && (
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-stone-900 leading-tight">
                  Painel da Vendedora
                </h1>
                <p className="text-[11px] text-stone-500">
                  Gerenciamento do Catálogo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <span>Ver Catálogo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
