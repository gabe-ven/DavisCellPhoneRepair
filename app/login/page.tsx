'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f9f9f9] dark:bg-[#111]">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.15em] uppercase mb-0.5 text-[#6b7280] dark:text-[#737373]">
            Davis Cell Phone Repair
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] dark:text-[#f5f5f5]" style={{ letterSpacing: '-0.02em' }}>
            Admin Portal
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-[#1a1a1a] rounded-xl p-8 border border-[#e5e7eb] dark:border-[#262626]"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          {error && (
            <p className="text-sm mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="space-y-3 mb-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-2.5 text-sm border border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#111] text-[#111111] dark:text-[#f0f0f0] placeholder-[#9ca3af] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-2.5 text-sm border border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#111] text-[#111111] dark:text-[#f0f0f0] placeholder-[#9ca3af] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 bg-[#6366f1] hover:bg-[#4f46e5]"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-[#9ca3af] dark:text-[#737373]">
          Davis Cell Phone Repair · Staff only
        </p>
      </div>
    </div>
  )
}
