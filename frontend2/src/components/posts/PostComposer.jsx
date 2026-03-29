export function PostComposer({
  caption,
  isReel,
  creating,
  error,
  onCaptionChange,
  onIsReelChange,
  onMediaChange,
  onSubmit,
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Composer
          </p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">
            Publish a new post
          </h2>
        </div>
        <span className="text-sm text-slate-500">
          Share a caption and send it straight to the feed.
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Caption</label>
          <textarea
            className="min-h-36 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white"
            rows={5}
            value={caption}
            onChange={(event) => onCaptionChange(event.target.value)}
            placeholder="Write something that feels worth stopping for."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Attach image or video (optional)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(event) => onMediaChange?.(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-amber-800 hover:file:bg-amber-100"
          />
        </div>
        <label className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isReel}
            onChange={(event) => onIsReelChange(event.target.checked)}
          />
          Mark this as a reel
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={creating}
            className="rounded-full bg-[linear-gradient(135deg,_#ea580c,_#f59e0b)] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Posting...' : 'Upload post'}
          </button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      </form>
    </section>
  )
}
