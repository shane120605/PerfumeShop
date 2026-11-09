import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/customer/AuthLayout'
import FormField from '../../components/common/FormField'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function C2_RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    const result = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    setBusy(false)
    if (!result.ok) return setErrors({ ...result.errors, ...(Object.keys(result.errors).length ? {} : { general: result.error }) })
    navigate('/login', { state: { registered: true } }) // Register -> Login
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join Perfume Shop and find your signature scent.">
      <form onSubmit={handleSubmit} className="auth__form" noValidate>
        <FormField label="Full Name" icon="user" placeholder="Full Name" value={form.name} onChange={set('name')} error={errors.name} />
        <FormField label="Email" icon="mail" type="email" placeholder="Email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField label="Password" icon="lock" type="password" placeholder="Password" value={form.password} onChange={set('password')} error={errors.password} />
        {errors.general && <p className="notice notice--error" role="alert">{errors.general}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Creating account…' : 'Register'}</Button>
      </form>
      <p className="auth__foot">Already have an account? <Link to="/login">Login</Link></p>
    </AuthLayout>
  )
}
