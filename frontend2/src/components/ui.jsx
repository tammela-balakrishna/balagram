export function PageHero({ eyebrow, title, description, actions }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),_transparent_20%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.9))] px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          {eyebrow ? (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-amber-200/90">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-3">
            <h1 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export function SurfaceCard({ children, className = '' }) {
  return (
    <section
      className={`rounded-[1.5rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl text-slate-900">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function StatusMessage({ loading, error, empty, emptyText }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-5 text-sm text-slate-500">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
        {error}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-5 text-sm text-slate-500">
        {emptyText}
      </div>
    )
  }

  return null
}
