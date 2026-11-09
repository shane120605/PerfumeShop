import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, ApiError } from '../api/apiClient'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const toSession = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }) // role = 'Admin' | 'Customer'
const messageOf = (err, fallback) =>
  err instanceof ApiError ? err.field('identifier') || err.field('email') || err.message : fallback

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken())) // true while we restore a saved login

  // restore the login after a page refresh
  useEffect(() => {
    if (!getToken()) return
    api.me()
      .then((u) => setUser(toSession(u)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // the API says the token expired -> log out in the app too
  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

  // role = 'Admin' for the admin login page, undefined for the customer login
  const login = async (identifier, password, role) => {
    try {
      const u = role === 'Admin'
        ? await api.adminLogin(identifier.trim(), password)
        : await api.login(identifier.trim(), password)
      const session = toSession(u)
      setUser(session)
      return { ok: true, user: session }
    } catch (err) {
      return { ok: false, error: messageOf(err, 'Could not sign in. Please try again.') }
    }
  }

  // creates a Customer account. Returns { ok } or { ok:false, errors:{ field: message } }
  const register = async ({ name, email, password }) => {
    try {
      await api.register({ name, email, password })
      return { ok: true }
    } catch (err) {
      if (err instanceof ApiError) {
        const errors = {}
        Object.keys(err.errors || {}).forEach((k) => { errors[k] = err.field(k) })
        return { ok: false, errors, error: err.message }
      }
      return { ok: false, errors: {}, error: 'Could not create the account.' }
    }
  }

  const logout = async () => {
    try { await api.logout() } catch { /* token already gone - ignore */ }
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
