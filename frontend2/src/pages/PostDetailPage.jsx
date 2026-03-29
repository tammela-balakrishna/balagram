import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PostCard } from '../components/posts/PostCard'
import { SectionTitle, StatusMessage, SurfaceCard } from '../components/ui'
import { apiFetch, readJson } from '../lib/api'
import { toArray } from '../lib/normalizers'

export function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')

        const [postResponse, commentsResponse, likesResponse] = await Promise.all([
          apiFetch(`/api/posts/posts/${id}/`),
          apiFetch('/api/posts/comments/'),
          apiFetch('/api/social/likes/'),
        ])

        if (!postResponse.ok) {
          throw new Error(`Post ${id} not found`)
        }

        const [postData, commentsData, likesData] = await Promise.all([
          readJson(postResponse),
          readJson(commentsResponse),
          readJson(likesResponse),
        ])

        const numericId = Number(id)
        setPost(postData)
        setComments(
          toArray(commentsData).filter((comment) => matchPostId(comment, numericId)),
        )
        setLikes(toArray(likesData).filter((like) => matchPostId(like, numericId)))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  return (
    <div className="space-y-8">
      <SectionTitle title="Post details" subtitle={`Post ID: ${id}`} />
      <StatusMessage loading={loading} error={error} />

      {post ? <PostCard post={post} /> : null}

      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <SurfaceCard>
            <h2 className="font-serif text-2xl text-slate-900">Comments</h2>
            <div className="mt-5 space-y-3">
              {comments.length ? (
                comments.map((comment) => {
                  const key = comment.id ?? comment.pk ?? JSON.stringify(comment)
                  const author =
                    comment.user?.username ??
                    comment.author?.username ??
                    comment.user ??
                    comment.author ??
                    'Unknown user'
                  const body = comment.text ?? comment.body ?? comment.content ?? ''

                  return (
                    <article
                      key={key}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        {author}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {body || 'No comment text.'}
                      </p>
                    </article>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500">No comments yet.</p>
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <h2 className="font-serif text-2xl text-slate-900">Likes</h2>
            <p className="mt-3 text-sm text-slate-600">
              Total likes: <span className="font-medium">{likes.length}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {likes.length ? (
                likes.map((like) => {
                  const key = like.id ?? like.pk ?? JSON.stringify(like)
                  const author =
                    like.user?.username ?? like.user ?? like.liker ?? 'Unknown user'
                  return (
                    <span
                      key={key}
                      className="rounded-full bg-amber-50 px-3 py-2 text-sm text-amber-800"
                    >
                      {author}
                    </span>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500">No likes yet.</p>
              )}
            </div>
          </SurfaceCard>
        </div>
      ) : null}
    </div>
  )
}

function matchPostId(item, numericId) {
  const postField = item.post ?? item.post_id ?? item.postId

  if (typeof postField === 'object' && postField !== null) {
    return postField.id === numericId || postField.pk === numericId
  }

  return postField === numericId
}
