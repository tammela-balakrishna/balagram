import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PostCard } from '../components/posts/PostCard'
import { PostComposer } from '../components/posts/PostComposer'
import { PageHero, SectionTitle, StatusMessage } from '../components/ui'
import { apiFetch, buildApiUrl, getCookie, readJson } from '../lib/api'
import { getPostMeta, toArray } from '../lib/normalizers'

export function PostsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [isReel, setIsReel] = useState(false)
  const [mediaFile, setMediaFile] = useState(null)
  const [creating, setCreating] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function load() {
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
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    if (!caption.trim()) {
      setSubmitError('Caption is required')
      return
    }

    try {
      setCreating(true)
      setSubmitError('')
      let mediaUrl = ''
      let mediaType = ''

      if (mediaFile) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
          throw new Error(
            'Cloudinary config missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.',
          )
        }

        const data = new FormData()
        data.append('file', mediaFile)
        data.append('upload_preset', uploadPreset)

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: 'POST', body: data },
        )

        const cloudinaryJson = await cloudinaryRes.json()
        if (!cloudinaryRes.ok) {
          throw new Error(
            cloudinaryJson?.error?.message || 'Cloudinary upload failed',
          )
        }

        mediaUrl = cloudinaryJson.secure_url
        mediaType = cloudinaryJson.resource_type // 'image' or 'video'
      }

      const response = await apiFetch('/api/posts/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
          caption,
          is_reel: isReel,
          media_url: mediaUrl || undefined,
          media_type: mediaType || undefined,
        }),
      })

      const data = await readJson(response)
      if (!response.ok) {
        throw new Error(
          typeof data === 'string' ? data : `Create failed: ${response.status}`,
        )
      }

      setCaption('')
      setIsReel(false)
      setMediaFile(null)
      await load()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const reelCount = posts.filter((post) => getPostMeta(post).isReel).length

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Publishing"
        title="Posts workspace"
        description="Create new posts and scan existing ones in a denser editorial layout. Every card opens the detail page."
        actions={
          <button
            onClick={load}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
          >
            Refresh feed
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <PostComposer
            caption={caption}
            isReel={isReel}
            creating={creating}
            error={submitError}
            onCaptionChange={setCaption}
            onIsReelChange={setIsReel}
            onMediaChange={setMediaFile}
            onSubmit={handleCreate}
          />

          <section className="grid gap-4 sm:grid-cols-3">
            <PostMetric label="Total posts" value={posts.length} tone="amber" />
            <PostMetric label="Reels" value={reelCount} tone="emerald" />
            <PostMetric
              label="Standard"
              value={Math.max(posts.length - reelCount, 0)}
              tone="slate"
            />
          </section>
        </div>

        <section className="space-y-5">
          <SectionTitle
            title="Published posts"
            subtitle={buildApiUrl('/api/posts/posts/')}
          />
          <StatusMessage
            loading={loading}
            error={error}
            empty={!posts.length}
            emptyText="No posts exist yet. Use the composer to create the first one."
          />
          {!loading && !error ? (
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard
                  key={getPostMeta(post).key}
                  post={post}
                  compact
                  onOpen={(postId) => navigate(`/posts/${postId}`)}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function PostMetric({ label, value, tone }) {
  const tones = {
    amber: 'from-amber-100 to-orange-50 text-orange-900',
    emerald: 'from-emerald-100 to-teal-50 text-emerald-900',
    slate: 'from-slate-100 to-slate-50 text-slate-900',
  }

  return (
    <div className={`rounded-[1.5rem] bg-gradient-to-br ${tones[tone]} p-4`}>
      <p className="text-xs uppercase tracking-[0.28em] text-current/60">{label}</p>
      <p className="mt-3 font-serif text-4xl">{value}</p>
    </div>
  )
}
