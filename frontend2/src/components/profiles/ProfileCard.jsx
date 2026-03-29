import { getProfileMeta } from '../../lib/normalizers'

export function ProfileCard({ profile }) {
  const meta = getProfileMeta(profile)
  const initial = meta.username.charAt(0).toUpperCase()

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.1)]">
      <div className="flex items-start gap-4">
        {meta.image ? (
          <img
            src={meta.image}
            alt={meta.username}
            className="h-16 w-16 rounded-2xl object-cover"
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#fb923c,_#facc15)] text-xl font-semibold text-white">
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate font-serif text-2xl text-slate-900">
                {meta.username}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
                {meta.isPrivate ? 'Private account' : 'Public account'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                meta.isPrivate
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {meta.isPrivate ? 'Locked' : 'Open'}
            </span>
          </div>
          <p className="mt-4 min-h-16 text-sm leading-6 text-slate-600">
            {meta.bio || 'This profile has not added a bio yet.'}
          </p>
        </div>
      </div>
    </article>
  )
}
