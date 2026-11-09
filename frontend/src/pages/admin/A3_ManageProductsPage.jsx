import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import ProductImage from '../../components/common/ProductImage'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import { useStore } from '../../context/StoreContext'
import { money } from '../../utils/format'

export default function A3_ManageProductsPage() {
  const { products, productsReady, deleteProduct } = useStore()
  const [target, setTarget] = useState(null) // product waiting for delete confirmation
  const [notice, setNotice] = useState('')

  const confirmDelete = async () => {
    try { await deleteProduct(target.id); setNotice('') } catch (err) { setNotice(err.message) }
    setTarget(null)
  }

  return (
    <AdminLayout title="Manage Products">
      <div className="page-head">
        <div><h2 className="serif">Products</h2><p className="muted">{products.length} products in catalog</p></div>
        <Button to="/admin/products/new" icon="plus" size="sm">Add Product</Button>
      </div>

      {notice && <p className="notice notice--error" role="alert">{notice}</p>}
      {!productsReady && <p className="empty">Loading products…</p>}

      <div className="table-card">
        <table className="table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><ProductImage product={p} className="table__thumb" /></td>
                <td>{p.name} · EDP {p.size}</td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td className={p.stock <= 5 ? 'text-warn' : ''}>{p.stock}{p.stock <= 5 && ' · Low stock'}</td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/products/${p.id}`} aria-label={`View ${p.name}`}><Icon name="eye" /></Link>
                    <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`}><Icon name="edit" /></Link>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Delete ${p.name}`} onClick={() => setTarget(p)}><Icon name="trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete Product?"
        message={`Are you sure you want to delete “${target?.name}”? This action cannot be undone.`}
        confirmLabel="Delete Product"
        onCancel={() => setTarget(null)}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  )
}
