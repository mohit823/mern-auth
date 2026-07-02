import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api, { getApiErrorMessage } from '../services/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const { isAuthenticated, login } = useAuth()
  const [form, setForm] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    remember: Boolean(localStorage.getItem('rememberedEmail')),
  })
  const [toast, setToast] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    if (!form.email.trim() || !form.password) return 'Email and password are required.'
    if (!emailPattern.test(form.email.trim())) return 'Please enter a valid email address.'
    if (form.password.length < 8) return 'Password must be at least 8 characters long.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setToast({ message: '', type: '' })

    const validationError = validate()
    if (validationError) {
      setToast({ message: validationError, type: 'error' })
      return
    }

    try {
      setLoading(true)
      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      login(data)
      if (form.remember) {
        localStorage.setItem('rememberedEmail', form.email.trim().toLowerCase())
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      setToast({ message: 'Login successful. Opening your dashboard.', type: 'success' })
      navigate(destination, { replace: true })
    } catch (requestError) {
      setToast({
        message: getApiErrorMessage(requestError, 'Unable to login. Please try again.'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] overflow-hidden bg-[#0d1117] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            JWT protected MERN authentication
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
            Secure access for a modern SaaS workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Sign in with a verified account, restore your session after refresh, and continue into a protected dashboard backed by MongoDB and JWT.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Encrypted token', 'Protected routes', 'Session refresh'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-bold text-white">{item}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">Active in this build</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-14 w-14 animate-[pulse_3s_ease-in-out_infinite] place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-emerald-300 text-2xl font-black text-slate-950">
              A
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-300">Login to continue</p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/15"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Password</span>
              <div className="mt-2 flex rounded-md border border-white/15 bg-white/10 transition focus-within:border-cyan-300 focus-within:ring-4 focus-within:ring-cyan-300/15">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-md bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="shrink-0 px-4 text-sm font-black text-cyan-200 transition hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-300"
                />
                Remember me
              </label>
              <button type="button" className="text-left text-sm font-bold text-cyan-200 hover:text-white sm:text-right">
                Forgot password?
              </button>
            </div>

            {toast.message && (
              <p className={`rounded-md border px-4 py-3 text-sm font-semibold ${
                toast.type === 'success'
                  ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                  : 'border-red-300/30 bg-red-300/10 text-red-100'
              }`}
              >
                {toast.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Signing in
                </span>
              ) : (
                'Login'
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-300">
            New here?{' '}
            <Link to="/register" className="font-black text-cyan-200 hover:text-white">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
