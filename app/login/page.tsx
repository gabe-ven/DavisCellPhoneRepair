'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f9f9f9' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.15em] uppercase mb-0.5" style={{ color: '#6b7280' }}>
            Davis Cell Phone Repair
          </p>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#111111', letterSpacing: '-0.02em' }}>
            Admin Portal
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl p-8"
          style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          {error && (
            <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(139,26,26,0.06)', border: '1px solid rgba(139,26,26,0.18)', color: '#8B1A1A' }}>
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
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
              style={{ border: '1.5px solid #e5e7eb', color: '#111111' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
              style={{ border: '1.5px solid #e5e7eb', color: '#111111' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            style={{ background: loading ? '#a81f1f' : '#8B1A1A' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
          Davis Cell Phone Repair · Staff only
        </p>
      </div>
    </div>
  )
}
