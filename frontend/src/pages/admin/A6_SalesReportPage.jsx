import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Icon from '../../components/common/Icon'
import { api } from '../../api/apiClient'
import { money } from '../../utils/format'

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const now = new Date()

export default function A6_SalesReportPage() {
  const [from, setFrom] = useState(iso(new Date(now.getFullYear(), now.getMonth(), 1))) // first day of this month
  const [to, setTo] = useState(iso(now))
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const validRange = from && to && from <= to

  useEffect(() => {
    if (!validRange) return
    let cancelled = false
    setError('')
    api.admin.salesReport(from, to)
      .then((r) => { if (!cancelled) setReport(r) })
      .catch((e) => { if (!cancelled) setError(e.errors?.to?.[0] || e.message) })
    return () => { cancelled = true }
  }, [from, to, validRange])

  const unit = report?.unit === 'month' ? 'Month' : 'Week'
  const buckets = report?.buckets || []
  const total = report?.total_sales || 0
  const max = Math.max(1, ...buckets.map((b) => b.value))

  return (
    <AdminLayout title="Sales Report">
      <div className="page-head">
        <div><h2 className="serif">Sales Overview</h2><p className="muted">Revenue for the selected period</p></div>
        <div className="date-filter">
          <Icon name="cal" size={18} color="#C4707F" />
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <span>–</span>
          <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
        </div>
      </div>

      {!validRange && <p className="notice notice--error">Choose a start date that is before the end date.</p>}
      {error && <p className="notice notice--error" role="alert">{error}</p>}

      <div className="stat-grid stat-grid--3">
        <div className="stat-card stat-card--big"><span className="stat-card__icon"><Icon name="chart" size={24} color="#C4707F" /></span><div><small>Total Sales</small><strong className="serif">{money(total)}</strong></div></div>
        <div className="stat-card"><span className="stat-card__icon"><Icon name="bag" size={24} color="#C4707F" /></span><div><small>Total Orders</small><strong className="serif">{report?.total_orders ?? 0}</strong></div></div>
        <div className="stat-card"><span className="stat-card__icon"><Icon name="tag" size={24} color="#C4707F" /></span><div><small>Average Order</small><strong className="serif">{money(report?.average_order ?? 0)}</strong></div></div>
      </div>

      <section className="card pad chart-card">
        <div className="chart-card__head"><h3 className="serif">Sales by {unit}</h3><small className="muted">Amount in PHP</small></div>
        {!report && !error ? (
          <p className="empty">Loading report…</p>
        ) : buckets.length === 0 || total === 0 ? (
          <p className="empty">No sales in this period. Try a wider date range.</p>
        ) : (
          <div className="bars" role="img" aria-label={`Bar chart of sales by ${unit.toLowerCase()}`}>
            {buckets.map((b, i) => (
              <div key={b.label + i} className="bars__col">
                <small>₱{(b.value / 1000).toFixed(1)}k</small>
                <div className={`bars__bar ${b.value === max ? 'bars__bar--top' : ''}`} style={{ height: `${Math.max(2, (b.value / max) * 170)}px` }} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
