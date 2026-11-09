import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: 'dash', end: true },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/orders', label: 'Orders', icon: 'bag' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/sales', label: 'Reports', icon: 'chart' },
]

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <Icon name="bottle" size={28} color="#C4707F" />
          <div><strong className="serif">Perfume Shop</strong><small>Admin Panel</small></div>
        </div>
        <nav className="sidebar__menu" aria-label="Admin">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className="menu-item">
              <Icon name={m.icon} size={20} /> {m.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="menu-item sidebar__logout" onClick={handleLogout}><Icon name="out" size={20} /> Logout</button>
      </aside>

      <div className="admin__main">
        <header className="topbar">
          <h1 className="serif">{title}</h1>
          <div className="topbar__user"><span className="avatar">A</span> Admin</div>
        </header>
        <div className="admin__content">{children}</div>
      </div>
    </div>
  )
}
