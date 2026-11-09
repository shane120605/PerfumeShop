import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import ProductForm from '../../components/admin/ProductForm'
import Icon from '../../components/common/Icon'
import { useStore } from '../../context/StoreContext'

export default function A3b_EditProductPage() {
  const { id } = useParams()
  const { products, productsReady, updateProduct } = useStore()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === Number(id))

  return (
    <AdminLayout title="Edit Product">
      <Link to="/admin/products" className="back-link"><Icon name="left" size={16} /> Back to Products</Link>
      {product ? (
        <ProductForm key={product.id} product={product} submitLabel="Save Changes"
          onSave={async (data, file) => { await updateProduct(product.id, data, file); navigate('/admin/products') }} />
      ) : <p className="empty">{productsReady ? 'Product not found.' : 'Loading product…'}</p>}
    </AdminLayout>
  )
}
