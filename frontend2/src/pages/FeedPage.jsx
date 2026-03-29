import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PostCard } from '../components/posts/PostCard'
import { PageHero, StatusMessage } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { apiFetch, readJson } from '../lib/api'
import { getPostMeta, toArray } from '../lib/normalizers'

export function FeedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch('/api/posts/posts/')
      if (!response.ok) {
        throw new Error(`GET failed: ${response.status}`)
      }

      const data = await readJson(response)
      setPosts(toArray(data))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const intervalId = setInterval(load, 15000)
    return () => clearInterval(intervalId)
  }, [load])

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Feed"
        title={`Welcome back${user?.username ? `, ${user.username}` : ''}.`}
        description="The home feed shows the latest posts coming from your Django API, with direct links into the post details view."
        actions={
          <button
            onClick={load}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
          >
            Refresh
          </button>
        }
      />

      <StatusMessage
        loading={loading}
        error={error}
        empty={!posts.length}
        emptyText="No posts yet. Head to the posts workspace and publish one."
      />

      {!loading && !error ? (
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard
              key={getPostMeta(post).key}
              post={post}
              compact
              onOpen={(id) => navigate(`/posts/${id}`)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
