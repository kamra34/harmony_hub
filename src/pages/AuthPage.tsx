import { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const { login, register, isLoading, error, clearError } = useAuthStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, displayName)
      }
    } catch {
      // error is set in store
    }
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login')
    clearError()
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥁</div>
          <h1 className="text-3xl font-bold text-white">DrumTutor</h1>
          <p className="text-[#6b7280] text-sm mt-1">AI-Powered Drum Learning</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1117] border border-[#1e2433] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-[#6b7280] uppercase tracking-wider block mb-1.5">Name</label>
                <input
                  type="text" value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-[#0a0c13] border border-[#1e2433] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:outline-none focus:border-violet-700 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0a0c13] border border-[#1e2433] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:outline-none focus:border-violet-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-[#6b7280] uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full bg-[#0a0c13] border border-[#1e2433] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:outline-none focus:border-violet-700 transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-base transition-colors"
            >
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={switchMode} className="text-sm text-[#6b7280] hover:text-violet-400 transition-colors">
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#374151] mt-6">
          Your progress, exercises, and practice history are saved to your account.
        </p>
      </div>
    </div>
  )
}
