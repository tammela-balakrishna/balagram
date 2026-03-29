import { API_BASE } from '../../lib/api'
import { getPostMeta } from '../../lib/normalizers'

export function PostCard({ post, onOpen, compact = false }) {
  const meta = getPostMeta(post)
  const mediaItems = Array.isArray(post.media_set) ? post.media_set : []
  const primaryMedia = mediaItems.length ? mediaItems[0] : null

  let mediaUrl = null
  const rawUrl = primaryMedia?.url || primaryMedia?.file
  if (rawUrl) {
    const value = String(rawUrl)
    mediaUrl = value.startsWith('http')
      ? value
      : `${API_BASE}${value.startsWith('/') ? '' : '/'}${value}`
  }

  return (
    <article
      onClick={() => meta.id && onOpen?.(meta.id)}
      className={`group overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition ${
        meta.id ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.1)]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            {meta.isReel ? 'Reel' : 'Post'}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-slate-900">
            {meta.author}
          </h3>
        </div>
        {meta.created ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            {meta.created}
          </span>
        ) : null}
      </div>
      {primaryMedia && mediaUrl ? (
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-100">
          {primaryMedia.media_type === 'video' ? (
            <video
              src={mediaUrl}
              controls
              className="h-auto w-full max-h-80 object-contain"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={meta.text || 'Post media'}
              className="h-auto w-full max-h-80 object-cover"
            />
          )}
        </div>
      ) : null}
      <p
        className={`mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700 ${
          compact ? 'line-clamp-4' : ''
        }`}
      >
        {meta.text || 'No caption provided.'}
      </p>
    </article>
  )
}
