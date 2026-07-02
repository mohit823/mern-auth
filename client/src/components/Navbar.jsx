import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const getInitials = (name = 'User') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-white/15 text-white'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d1117]/85 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            A
          </span>
          <span className="text-lg font-bold text-white">AuthFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <div className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm font-black text-slate-950">
                  {getInitials(user?.name)}
                </span>
                <span className="min-w-0">
                  <span className="block max-w-32 truncate text-sm font-bold text-white">
                    {user?.name}
                  </span>
                  <span className="block max-w-40 truncate text-xs font-medium text-slate-400">
                    {user?.email}
                  </span>
                </span>
              </div>
              <button
                type="button"
                title="Notifications"
                className="hidden h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-sm font-black text-slate-200 transition hover:bg-white/10 sm:grid"
              >
                !
              </button>
              <button
                type="button"
                title="Settings"
                className="hidden h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-sm font-black text-slate-200 transition hover:bg-white/10 md:grid"
              >
                S
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
