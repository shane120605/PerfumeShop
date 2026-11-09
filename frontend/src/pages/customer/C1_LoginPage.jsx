import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/customer/AuthLayout'
import FormField from '../../components/common/FormField'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function C1_LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.identifier.trim() || !form.password) return setError('Enter your email and your password.')
    setBusy(true)
    const result = await login(form.identifier, form.password)
    setBusy(false)
    if (!result.ok) return setError(result.error)
    navigate(location.state?.from || '/') // go back to the page they wanted, or Home
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue shopping your favorite scents.">
      {location.state?.registered && <p className="notice notice--success">Account created. You can log in now.</p>}
      <form onSubmit={handleSubmit} className="auth__form" noValidate>
        <FormField label="Email" icon="mail" type="email" placeholder="Email" value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
        <FormField label="Password" icon="lock" type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="notice notice--error" role="alert">{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Signing in…' : 'Login'}</Button>
      </form>
      <p className="auth__foot">Don't have an account? <Link to="/register">Register</Link></p>
      <Link className="auth__admin" to="/admin/login">Admin? Open the Admin Panel</Link>
    </AuthLayout>
  )
}
