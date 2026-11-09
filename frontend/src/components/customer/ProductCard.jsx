import { Link } from 'react-router-dom'
import ProductImage from '../common/ProductImage'
import { money } from '../../utils/format'

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__photo">
        <ProductImage product={product} />
      </div>
      <div className="product-card__info">
        <h3 className="serif">{product.name}</h3>
        <p>{product.category} · Eau de Parfum {product.size}</p>
        <strong>{money(product.price)}</strong>
      </div>
    </Link>
  )
}
