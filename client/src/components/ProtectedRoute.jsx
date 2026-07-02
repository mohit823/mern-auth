import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getToken } from '../services/tokenStorage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const hasToken = Boolean(getToken())

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#0d1117] px-4">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-5 py-4 text-white shadow-2xl backdrop-blur">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span className="text-sm font-semibold">Verifying session</span>
        </div>
      </main>
    )
  }

  if (!hasToken || !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
