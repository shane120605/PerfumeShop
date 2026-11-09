import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import { api } from '../../api/apiClient'
import { formatDate, money } from '../../utils/format'

export default function A2_DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.admin.dashboard().then(setData).catch((e) => setError(e.message))
  }, [])

  const stats = data && [
    { label: 'Total Products', value: data.total_products, icon: 'box' },
    { label: 'Total Orders', value: data.total_orders, icon: 'bag' },
    { label: 'Total Users', value: data.total_users, icon: 'users' },
    { label: 'Total Sales', value: money(data.total_sales), icon: 'chart' },
  ]

  return (
    <AdminLayout title="Dashboard">
      {error && <p className="notice notice--error" role="alert">{error}</p>}
      {!data && !error && <p className="empty">Loading dashboard…</p>}
      {data && (
        <>
          <div className="stat-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <span className="stat-card__icon"><Icon name={s.icon} size={24} color="#C4707F" /></span>
                <div><small>{s.label}</small><strong className="serif">{s.value}</strong></div>
              </div>
            ))}
          </div>

          <div className="page-head">
            <div><h2 className="serif">Recent Orders</h2><p className="muted">Latest customer orders</p></div>
            <Button to="/admin/orders" kind="soft" size="sm">View all Orders</Button>
          </div>

          <div className="table-card">
            <table className="table">
              <thead><tr><th>Order No.</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {data.recent_orders.map((o) => (
                  <tr key={o.no}>
                    <td>#{o.no}</td><td>{o.customer}</td><td>{formatDate(o.date)}</td><td>{money(o.total)}</td>
                    <td><Badge status={o.status} /></td>
                    <td><Button to={`/admin/orders/${o.no}`} kind="outline" size="sm">View</Button></td>
                  </tr>
                ))}
                {data.recent_orders.length === 0 && <tr><td colSpan="6" className="empty">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
