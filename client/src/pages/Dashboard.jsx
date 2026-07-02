import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getToken } from '../services/tokenStorage'

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(date))
    : 'Not available'

const getInitials = (name = 'User') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U'

function Dashboard() {
  const { logout, refreshSession, token, user } = useAuth()
  const navigate = useNavigate()
  const storedToken = getToken()
  const tokenPreview = storedToken ? `${storedToken.slice(0, 18)}...${storedToken.slice(-10)}` : 'No token'

  const stats = useMemo(
    () => [
      { label: 'Auth status', value: 'Verified', accent: 'bg-emerald-300' },
      { label: 'Token source', value: token ? 'Local storage' : 'Missing', accent: 'bg-cyan-300' },
      { label: 'Session age', value: user?.createdAt ? 'Active' : 'New', accent: 'bg-sky-300' },
      { label: 'API profile', value: 'Online', accent: 'bg-fuchsia-300' },
    ],
    [token, user?.createdAt],
  )

  const activity = [
    'JWT profile check completed',
    'Protected dashboard route unlocked',
    'User data loaded without password fields',
    'Session persistence ready for refresh',
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0d1117] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-base font-black text-slate-950">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">{user?.name}</p>
              <p className="truncate text-xs font-medium text-slate-400">{user?.email}</p>
            </div>
          </div>

          <nav className="mt-7 space-y-2">
            {['Dashboard', 'Profile', 'Settings', 'Security'].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-bold transition ${
                  index === 0
                    ? 'bg-white text-slate-950'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
                <span className="text-xs">{index === 0 ? 'On' : 'Go'}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-md border border-red-300/30 bg-red-300/10 px-3 py-3 text-left text-sm font-bold text-red-100 transition hover:bg-red-300/20"
            >
              Logout
            </button>
          </nav>
        </aside>

        <section className="space-y-6">
          <div id="dashboard" className="rounded-lg border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-cyan-200">Protected dashboard</p>
                <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white sm:text-5xl">
                  Welcome back, {user?.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Your dashboard is available because the stored JWT was verified through GET /api/auth/profile.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={refreshSession}
                  className="rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Refresh session
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                <span className={`block h-2 w-12 rounded-full ${stat.accent}`} />
                <p className="mt-5 text-sm font-semibold text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article id="profile" className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-24 w-24 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-emerald-300 text-3xl font-black text-slate-950">
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-normal text-emerald-200">Profile</p>
                  <h2 className="mt-2 break-words text-3xl font-black text-white">{user?.name}</h2>
                  <p className="mt-2 break-words text-sm font-medium text-slate-300">{user?.email}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#0d1117]/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-400">Account created</p>
                  <p className="mt-2 text-sm font-bold text-white">{formatDate(user?.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0d1117]/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-400">Last profile sync</p>
                  <p className="mt-2 text-sm font-bold text-white">{formatDate(user?.updatedAt)}</p>
                </div>
              </div>
              <button type="button" className="mt-6 rounded-md bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-100">
                Edit profile
              </button>
            </article>

            <article id="security" className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-normal text-cyan-200">JWT status</p>
              <h2 className="mt-3 text-2xl font-black text-white">Session authenticated</h2>
              <p className="mt-3 break-all rounded-md border border-white/10 bg-[#0d1117]/60 p-4 text-xs font-semibold leading-6 text-slate-300">
                {tokenPreview}
              </p>
              <div className="mt-5 space-y-3">
                {['Authorization header attached', 'Invalid tokens auto logout', 'Password never exposed'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm font-bold text-slate-200">{item}</span>
                    <span className="rounded-md bg-emerald-300/15 px-2 py-1 text-xs font-black text-emerald-100">OK</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <article id="settings" className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-normal text-fuchsia-200">Quick actions</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['Update profile', 'Rotate password', 'View sessions', 'Export account'].map((action) => (
                  <button key={action} type="button" className="rounded-md border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-black text-white transition hover:bg-white/15">
                    {action}
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-normal text-sky-200">Recent activity</p>
              <div className="mt-5 space-y-3">
                {activity.map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-[#0d1117]/50 px-4 py-3">
                    <p className="text-sm font-bold text-white">{item}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">Just now</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
