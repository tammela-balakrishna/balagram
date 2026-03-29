import { NavLink } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/register', label: 'Register' },
  { to: '/login', label: 'Login' },
]

const privateLinks = [
  { to: '/feed', label: 'Feed' },
  { to: '/profiles', label: 'Profiles' },
  { to: '/posts', label: 'Posts' },
  { to: '/messages', label: 'Messages' },
]

function linkClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm transition ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950'
  }`
}

export function AppShell({ children }) {
  const { user, logout } = useAuth()
  const links = user ? privateLinks : publicLinks

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f3ea_0%,_#eef4ff_48%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(148,163,184,0.16)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <NavLink to="/" className="inline-flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#ea580c,_#facc15)] text-lg font-bold text-white shadow-lg">
                  B
                </span>
                <div>
                  <div className="font-serif text-2xl leading-none">Balagram</div>
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Social Studio
                  </div>
                </div>
              </NavLink>
              <nav className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="rounded-[1.5rem] bg-slate-950 px-4 py-4 text-white sm:px-5">
              {user ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Signed In
                    </div>
                    <div className="font-medium">
                      {user.username ?? user.email ?? 'Logged in'}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-white/35 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="max-w-xs">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Session
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Create an account or log in to manage profiles and publish posts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}
