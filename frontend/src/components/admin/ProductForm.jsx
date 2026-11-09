import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../common/FormField'
import Button from '../common/Button'
import Icon from '../common/Icon'
import ProductImage from '../common/ProductImage'
import { useStore } from '../../context/StoreContext'
import { apiErrors } from '../../utils/apiErrors'

export default function ProductForm({ product, onSave, submitLabel }) {
  const { categories } = useStore()
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price ?? '',
    stock: product?.stock ?? '',
    size: product?.size || '50 ml',
    description: product?.description || '',
  })
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '') // preview only
  const [imageFile, setImageFile] = useState(null) // the real file that is uploaded to the backend
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  // keep the chosen file (uploaded when you save) and show a preview of it
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setErrors({ ...errors, image: 'Use a JPG, PNG or WEBP image.' })
    if (file.size > 2 * 1024 * 1024) return setErrors({ ...errors, image: 'Image must be 2 MB or smaller.' })
    setErrors({ ...errors, image: undefined })
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Enter the product name.'
    if (!form.category) next.category = 'Select a category.'
    if (!(Number(form.price) > 0)) next.price = 'Enter a price greater than 0.'
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Enter the stock quantity.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      }, imageFile)
    } catch (err) {
      const { fields, general } = apiErrors(err, { category_id: 'category' })
      setErrors({ ...fields, ...(general ? { general } : {}) })
      setBusy(false)
    }
  }

  const hasImage = imageUrl || product

  return (
    <form className="card form-card form-card--product" onSubmit={handleSubmit} noValidate>
      <div className="form-card__image">
        <label className="field-label">Product Image</label>
        {hasImage ? (
          <ProductImage product={product} src={imageUrl || undefined} className="form-card__preview" />
        ) : (
          <div className="upload-box"><Icon name="upload" size={32} color="#C4707F" /><strong>Click to upload image</strong><small>JPG, PNG or WEBP, up to 2 MB</small></div>
        )}
        <label className="btn btn--outline btn--sm btn--block upload-btn">
          <Icon name="upload" size={16} /> {hasImage ? 'Change Image' : 'Choose Image'}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} hidden />
        </label>
        {errors.image && <span className="field__error">{errors.image}</span>}
      </div>

      <div className="form-card__fields">
        <FormField label="Product Name" placeholder="e.g. Rose Éclat" value={form.name} onChange={set('name')} error={errors.name} />
        <div className="two-col">
          <FormField label="Category" as="select" options={categories.filter((c) => c !== 'All')} placeholder="Select category" value={form.category} onChange={set('category')} error={errors.category} />
          <FormField label="Price (₱)" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={set('price')} error={errors.price} />
        </div>
        <div className="two-col">
          <FormField label="Stock" type="number" min="0" placeholder="0" value={form.stock} onChange={set('stock')} error={errors.stock} />
          <FormField label="Size" placeholder="e.g. 50 ml" value={form.size} onChange={set('size')} />
        </div>
        <FormField label="Description" as="textarea" placeholder="Write a short product description..." value={form.description} onChange={set('description')} />
        {errors.general && <p className="notice notice--error" role="alert">{errors.general}</p>}
        <div className="form-actions">
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : submitLabel}</Button>
          <Button to="/admin/products" kind="outline">Cancel</Button>
        </div>
      </div>
    </form>
  )
}
