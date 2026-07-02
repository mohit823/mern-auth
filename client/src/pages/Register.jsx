import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api, { getApiErrorMessage } from '../services/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getPasswordScore = (password) => {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

function Register() {
  const { isAuthenticated, login } = useAuth()
  const [form, setForm] = useState({
    confirmPassword: '',
    email: '',
    name: '',
    password: '',
  })
  const [toast, setToast] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const passwordScore = useMemo(() => getPasswordScore(form.password), [form.password])
  const strengthLabel = ['Too weak', 'Starter', 'Good', 'Strong', 'Excellent'][passwordScore]

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      return 'All fields are required.'
    }
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters long.'
    if (!emailPattern.test(form.email.trim())) return 'Please enter a valid email address.'
    if (form.password.length < 8) return 'Password must be at least 8 characters long.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
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
      const { data } = await api.post('/auth/register', {
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        password: form.password,
      })
      login(data)
      setToast({ message: 'Account created. Opening your dashboard.', type: 'success' })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setToast({
        message: getApiErrorMessage(requestError, 'Unable to register. Please try again.'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] overflow-hidden bg-[#0d1117] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[460px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-white/15 bg-white/10 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-2xl sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-normal text-emerald-200">Create account</p>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-white">Start protected</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">Your password is hashed before storage and your JWT starts immediately.</p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Full name</span>
              <input name="name" autoComplete="name" value={form.name} onChange={handleChange} disabled={loading} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" placeholder="Your full name" />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Email</span>
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} disabled={loading} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" placeholder="you@example.com" />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Password</span>
                <input name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} disabled={loading} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" placeholder="8+ characters" />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-200">Confirm</span>
                <input name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} disabled={loading} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" placeholder="Repeat password" />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Password strength</span>
                <span>{strengthLabel}</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <span key={step} className={`h-2 rounded-full ${passwordScore >= step ? 'bg-emerald-300' : 'bg-white/15'}`} />
                ))}
              </div>
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

            <button type="submit" disabled={loading} className="w-full rounded-md bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Creating account
                </span>
              ) : (
                'Register'
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already registered?{' '}
            <Link to="/login" className="font-black text-emerald-200 hover:text-white">
              Login
            </Link>
          </p>
        </form>

        <div className="max-w-3xl lg:justify-self-end">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <div className="grid h-24 w-24 place-items-center rounded-lg bg-gradient-to-br from-emerald-300 via-cyan-300 to-sky-300 text-5xl font-black text-slate-950 shadow-2xl shadow-cyan-950/30">
              A
            </div>
            <h2 className="mt-8 text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
              One account. Clean session control.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Registration stores a normalized email, prevents duplicates, hashes credentials, and returns the same secure auth contract as login.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Duplicate email guard', 'Hashed password', 'JWT issued on signup', 'Profile API ready'].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-[#0d1117]/60 p-4">
                  <p className="text-sm font-bold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
