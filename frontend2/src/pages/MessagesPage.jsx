import { useEffect, useState } from 'react'

import { PageHero, StatusMessage, SurfaceCard } from '../components/ui'
import { apiFetch, readJson } from '../lib/api'
import { getMessageMeta, toArray } from '../lib/normalizers'

export function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch('/api/messaging/messages/')
      if (!response.ok) {
        throw new Error(`GET failed: ${response.status}`)
      }

      const data = await readJson(response)
      setMessages(toArray(data))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Inbox"
        title="Message stream"
        description="A simple view over the messaging API while the rest of the product structure catches up."
        actions={
          <button
            onClick={load}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
          >
            Reload messages
          </button>
        }
      />

      <StatusMessage
        loading={loading}
        error={error}
        empty={!messages.length}
        emptyText="No messages were returned."
      />

      {!loading && !error ? (
        <div className="space-y-4">
          {messages.map((message) => {
            const meta = getMessageMeta(message)
            return (
              <SurfaceCard key={meta.key}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{meta.sender}</p>
                    {meta.created ? (
                      <p className="mt-1 text-xs text-slate-500">{meta.created}</p>
                    ) : null}
                  </div>
                  {meta.conversation ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      Conversation {meta.conversation}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {meta.body || 'No message body.'}
                </p>
              </SurfaceCard>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
