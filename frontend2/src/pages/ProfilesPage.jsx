import { useEffect, useState } from 'react'

import { ProfileCard } from '../components/profiles/ProfileCard'
import { PageHero, SectionTitle, StatusMessage } from '../components/ui'
import { apiFetch, buildApiUrl, readJson } from '../lib/api'
import { getProfileMeta, toArray } from '../lib/normalizers'

export function ProfilesPage() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch('/api/accounts/profiles/')
      if (!response.ok) {
        throw new Error(`GET failed: ${response.status}`)
      }

      const data = await readJson(response)
      setProfiles(toArray(data))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const publicCount = profiles.filter((item) => !getProfileMeta(item).isPrivate).length

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Community"
        title="Profile directory"
        description="Browse everyone currently exposed by the profiles API, with privacy state and bios surfaced in a cleaner card layout."
        actions={
          <button
            onClick={load}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-50"
          >
            Reload profiles
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Snapshot</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Metric label="Profiles" value={profiles.length} accent="amber" />
            <Metric label="Public" value={publicCount} accent="emerald" />
            <Metric
              label="Private"
              value={Math.max(profiles.length - publicCount, 0)}
              accent="slate"
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle
            title="Everyone on the platform"
            subtitle={buildApiUrl('/api/accounts/profiles/')}
          />
          <StatusMessage
            loading={loading}
            error={error}
            empty={!profiles.length}
            emptyText="No profiles were returned by the API."
          />
          {!loading && !error ? (
            <div className="grid gap-5 md:grid-cols-2">
              {profiles.map((profile) => (
                <ProfileCard
                  key={getProfileMeta(profile).key}
                  profile={profile}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value, accent }) {
  const tones = {
    amber: 'from-amber-100 to-orange-50 text-orange-900',
    emerald: 'from-emerald-100 to-teal-50 text-emerald-900',
    slate: 'from-slate-100 to-slate-50 text-slate-900',
  }

  return (
    <div className={`rounded-[1.5rem] bg-gradient-to-br ${tones[accent]} p-4`}>
      <p className="text-xs uppercase tracking-[0.28em] text-current/60">{label}</p>
      <p className="mt-3 font-serif text-4xl">{value}</p>
    </div>
  )
}
