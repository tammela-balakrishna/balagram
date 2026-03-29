import { useState } from 'react'

import { PageHero, SurfaceCard } from '../components/ui'
import { apiFetch, buildApiUrl, ensureCsrfCookie, getCookie, readJson } from '../lib/api'

export function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    is_private: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function updateField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setResult(null)

    try {
      await ensureCsrfCookie()
      const response = await apiFetch('/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(form),
      })

      const data = await readJson(response)
      if (!response.ok) {
        setError(typeof data === 'string' ? data : JSON.stringify(data))
        return
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Access"
        title="Create your Balagram profile."
        description="Register with a username, password, and optional bio. The session flow uses Django CSRF and cookie-based auth."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SurfaceCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Username"
              value={form.username}
              onChange={(value) => updateField('username', value)}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField('email', value)}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(value) => updateField('password', value)}
            />
            <Field
              label="Bio"
              as="textarea"
              value={form.bio}
              onChange={(value) => updateField('bio', value)}
            />
            <label className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_private}
                onChange={(event) => updateField('is_private', event.target.checked)}
              />
              Private account
            </label>
            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
          </form>
        </SurfaceCard>

        <SurfaceCard className="bg-slate-950 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Endpoint</p>
          <code className="mt-3 block rounded-2xl bg-white/10 px-4 py-3 text-sm text-amber-200">
            {buildApiUrl('/api/accounts/register/')}
          </code>
          {result ? (
            <pre className="mt-5 max-h-80 overflow-auto rounded-[1.25rem] bg-white/10 p-4 text-xs text-slate-200">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Submit the form to see the created profile payload here.
            </p>
          )}
        </SurfaceCard>
      </div>
    </div>
  )
}

function Field({ label, as = 'input', type = 'text', value, onChange }) {
  const Component = as

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Component
        type={as === 'input' ? type : undefined}
        value={value}
        rows={as === 'textarea' ? 4 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white"
      />
    </label>
  )
}
