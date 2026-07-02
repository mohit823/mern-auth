import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { subscribeToAuthLogout } from '../services/authEvents'
import { clearAuthStorage, getToken, getUser, saveToken, saveUser } from '../services/tokenStorage'
import AuthContext from './authContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken)
  const [user, setUser] = useState(getUser)
  const [loading, setLoading] = useState(Boolean(getToken()))

  const clearAuth = useCallback(() => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
  }, [])

  const loadUser = useCallback(async () => {
    const storedToken = getToken()

    if (!storedToken) {
      clearAuth()
      setLoading(false)
      return null
    }

    try {
      setLoading(true)
      const { data } = await api.get('/auth/profile')
      setUser(data.user)
      setToken(storedToken)
      saveUser(data.user)
      return data.user
    } catch {
      clearAuth()
      return null
    } finally {
      setLoading(false)
    }
  }, [clearAuth])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => subscribeToAuthLogout(clearAuth), [clearAuth])

  const login = useCallback(({ token: nextToken, user: nextUser }) => {
    saveToken(nextToken)
    saveUser(nextUser)
    setToken(nextToken)
    setUser(nextUser)
    setLoading(false)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post('/auth/logout')
      }
    } catch {
      // Local logout still succeeds when the token is already invalid.
    } finally {
      clearAuth()
    }
  }, [clearAuth, token])

  const refreshSession = useCallback(async () => {
    const loadedUser = await loadUser()
    return Boolean(loadedUser)
  }, [loadUser])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
      loadUser,
      refreshSession,
      checkAuth: refreshSession,
      token,
      user,
    }),
    [loading, login, logout, loadUser, refreshSession, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
