import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ProductImage from '../../components/common/ProductImage'
import FormField from '../../components/common/FormField'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useStore } from '../../context/StoreContext'
import { money } from '../../utils/format'
import { apiErrors } from '../../utils/apiErrors'

const PAYMENTS = ['Cash on Delivery', 'GCash / Online Payment']

export default function C7_CheckoutPage() {
  const { user } = useAuth()
  const { lines, subtotal, clearCart, productsReady } = useCart()
  const { placeOrder } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: user?.name || '', address: '', city: '', phone: '' })
  const [payment, setPayment] = useState(PAYMENTS[0])
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (!productsReady) return <div className="page"><Navbar /><main className="container"><p className="empty">Loading your cart…</p></main></div>
  if (lines.length === 0) return <Navigate to="/cart" replace />

  const handlePlaceOrder = async () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Enter your full name.'
    if (!form.address.trim()) next.address = 'Enter your street address.'
    if (!form.city.trim()) next.city = 'Enter your city or province.'
    if (!/^[0-9 +()-]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      const order = await placeOrder({ lines, shipping: form, payment })
      clearCart()
      navigate('/order-confirmation', { state: { order } }) // Place Order -> Confirmation
    } catch (err) {
      // e.g. not enough stock, or the server rejected a field
      const { fields, general } = apiErrors(err, { full_name: 'fullName', payment_method: 'payment' })
      setErrors({ ...fields, ...(general ? { general } : {}) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <h1 className="serif">Checkout</h1>
        <div className="cart">
          <section className="card checkout__form">
            <h2 className="serif">Shipping Address</h2>
            <FormField label="Full Name" placeholder="Full Name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
            <FormField label="Address" placeholder="House no., street, barangay" value={form.address} onChange={set('address')} error={errors.address} />
            <div className="two-col">
              <FormField label="City / Province" placeholder="City / Province" value={form.city} onChange={set('city')} error={errors.city} />
              <FormField label="Phone Number" placeholder="09XX XXX XXXX" value={form.phone} onChange={set('phone')} error={errors.phone} />
            </div>

            <h2 className="serif">Payment Method</h2>
            <div className="radios">
              {PAYMENTS.map((p) => (
                <label key={p} className={`radio ${payment === p ? 'radio--on' : ''}`}>
                  <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} />
                  <span className="radio__dot" /> {p}
                </label>
              ))}
            </div>
            {errors.payment && <p className="field__error">{errors.payment}</p>}
            {errors.items && <p className="notice notice--error" role="alert">{errors.items}</p>}
            {errors.general && <p className="notice notice--error" role="alert">{errors.general}</p>}
          </section>

          <aside className="card summary">
            <h2 className="serif">Order Summary</h2>
            {lines.map(({ product, qty }) => (
              <div key={product.id} className="summary__item">
                <ProductImage product={product} className="summary__thumb" />
                <span>{product.name} × {qty}</span>
                <strong>{money(product.price * qty)}</strong>
              </div>
            ))}
            <hr />
            <div className="summary__row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="summary__row"><span>Shipping</span><strong>Free</strong></div>
            <hr />
            <div className="summary__row summary__total"><span>Total:</span><strong>{money(subtotal)}</strong></div>
            <Button block onClick={handlePlaceOrder} disabled={busy}>{busy ? 'Placing order…' : 'Place Order'}</Button>
            <Button to="/cart" kind="outline" block>Back to Cart</Button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
