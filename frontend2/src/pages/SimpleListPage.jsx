import { useState } from 'react'

import { PageHero, SurfaceCard } from '../components/ui'
import { apiFetch, buildApiUrl, getCookie, readJson } from '../lib/api'
import { toArray } from '../lib/normalizers'

export function SimpleListPage({ title, path }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch(path)
      if (!response.ok) {
        throw new Error(`GET failed: ${response.status}`)
      }

      const data = await readJson(response)
      setItems(toArray(data))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function create(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      const body = payload ? JSON.parse(payload) : {}
      const response = await apiFetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`POST failed: ${response.status}`)
      }

      setPayload('')
      await load()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Utility"
        title={title}
        description={`Manual API surface for ${path}`}
        actions={
          <button
            onClick={load}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
          >
            Load items
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard>
          <form onSubmit={create} className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">POST JSON payload</span>
              <textarea
                rows={8}
                value={payload}
                onChange={(event) => setPayload(event.target.value)}
                placeholder="{ }"
                className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-amber-400 focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Create
            </button>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </form>
        </SurfaceCard>

        <SurfaceCard className="bg-slate-950 text-white">
          <code className="block rounded-2xl bg-white/10 px-4 py-3 text-sm text-amber-200">
            {buildApiUrl(path)}
          </code>
          <pre className="mt-4 max-h-[32rem] overflow-auto rounded-[1.25rem] bg-white/10 p-4 text-xs text-slate-200">
            {JSON.stringify(items, null, 2)}
          </pre>
        </SurfaceCard>
      </div>
    </div>
  )
}
