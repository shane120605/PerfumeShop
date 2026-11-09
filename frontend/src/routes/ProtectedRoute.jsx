import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p style={{ padding: 80, textAlign: 'center' }} className="muted">Loading…</p>
  if (role === 'Admin') {
    if (!user || user.role !== 'Admin') return <Navigate to="/admin/login" replace />
    return children
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
