import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/common/FormField'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../context/AuthContext'

export default function A1_AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) return setError('Enter your admin email (or name) and password.')
    setBusy(true)
    const result = await login(form.username, form.password, 'Admin')
    setBusy(false)
    if (!result.ok) return setError(result.error)
    navigate('/admin')
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit} noValidate>
        <div className="admin-login__logo"><Icon name="bottle" size={36} color="#C4707F" /></div>
        <h1 className="serif">Perfume Shop</h1>
        <p className="admin-login__label">Admin Panel</p>
        <FormField label="Username" icon="user" placeholder="Username (or admin email)" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <FormField label="Password" icon="lock" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="notice notice--error" role="alert">{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Signing in…' : 'Login'}</Button>
        <Link to="/login" className="admin-login__back">Back to User Login</Link>
      </form>
    </div>
  )
}
