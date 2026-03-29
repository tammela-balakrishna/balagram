import { Link } from 'react-router-dom'

import { PageHero, SurfaceCard } from '../components/ui'
import { buildApiUrl } from '../lib/api'

export function HomePage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Balagram"
        title="A cleaner React front end for your Django social app."
        description="Use the new split-page setup to browse profiles, publish posts, and keep the API flow readable while you build."
        actions={
          <>
            <Link
              to="/register"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard>
          <h2 className="font-serif text-3xl text-slate-900">What changed</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The app is now organized around dedicated page and component files instead of one large
            view module. Profiles and posts have a more intentional layout and cleaner data flow.
          </p>
        </SurfaceCard>
        <SurfaceCard className="bg-slate-950 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">API</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">Backend base URL:</p>
          <code className="mt-3 block rounded-2xl bg-white/10 px-4 py-3 text-sm text-amber-200">
            {buildApiUrl('/')}
          </code>
        </SurfaceCard>
      </div>
    </div>
  )
}
