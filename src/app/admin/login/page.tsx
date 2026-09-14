import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { isAuthenticatedAdmin } from '@/modules/admin/auth'
import { LoginForm } from '@/modules/admin/components/login-form'

export const metadata = {
  title: 'Acesso Administrativo | Catálogo'
}

export default async function AdminLoginPage() {
  const isAuth = await isAuthenticatedAdmin()
  if (isAuth) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fcfbf9]">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800 mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-stone-900">
            Acesso Administrativo
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Área restrita para a vendedora gerenciar peças e catálogo.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
