'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader2 } from 'lucide-react'
import { loginAdminAction } from '../actions'

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.set('password', password)

      const res = await loginAdminAction(formData)
      if (!res.success) {
        setError(res.error)
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
        >
          Senha de Acesso
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Digite a senha administrativa..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-colors text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            Entrar no Painel
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}
