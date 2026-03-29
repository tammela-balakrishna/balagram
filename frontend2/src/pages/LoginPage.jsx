import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PageHero, SurfaceCard } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { apiFetch, ensureCsrfCookie, getCookie, readJson } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await ensureCsrfCookie()
      const response = await apiFetch('/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await readJson(response)
      if (!response.ok) {
        setError(typeof data === 'string' ? data : JSON.stringify(data))
        return
      }

      setUser(data)
      const from = location.state?.from?.pathname || '/feed'
      navigate(from)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Session"
        title="Sign in and work inside the app."
        description="Login uses your Django session cookie, so the frontend requests a CSRF token first and then sends it with the credentials request."
      />

      <div className="mx-auto max-w-2xl">
        <SurfaceCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>
            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[linear-gradient(135deg,_#059669,_#14b8a6)] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:brightness-105 disabled:opacity-60"
              >
                {submitting ? 'Logging in...' : 'Login'}
              </button>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
          </form>
        </SurfaceCard>
      </div>
    </div>
  )
}
