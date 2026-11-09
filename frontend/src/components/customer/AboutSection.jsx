import { Link } from 'react-router-dom'
import ProductImage from '../common/ProductImage'
import Icon from '../common/Icon'
import { useStore } from '../../context/StoreContext'

const HIGHLIGHTS = [
  ['Carefully selected', 'Every fragrance is chosen for how it wears, from the first spray to the last hour.'],
  ['50 ml Eau de Parfum', 'A rich, long-lasting concentration in a size that is easy to carry and use daily.'],
  ['Delivered to your door', 'Order online, pay by Cash on Delivery or GCash, and we bring it to you. Shipping is free.'],
]

export default function AboutSection() {
  const { products } = useStore()

  return (
    <section className="about-wrap" id="about">
      <div className="about-intro">
        <div className="about-intro__text">
          <h2 className="serif">About Perfume Shop</h2>
          <p className="about-lead">
            We are a small online perfume shop for people who love a scent that feels like them.
          </p>
          <p>
            Our collection is small on purpose. Each perfume is described honestly, with its top,
            heart and base notes, so you know what to expect even though you cannot smell it through
            a screen. Every bottle is 50 ml of carefully selected Eau de Parfum, delivered to your door.
          </p>
          <Link to="/shop" className="btn btn--dark about-btn">Shop the collection <Icon name="right" size={16} /></Link>
        </div>
        <div className="about-intro__photos" aria-hidden="true">
          <div className="about-photo about-photo--a"><ProductImage product={products[0]} /></div>
          <div className="about-photo about-photo--b"><ProductImage product={products[3] || products[0]} /></div>
        </div>
      </div>

      <div className="highlights">
        {HIGHLIGHTS.map(([title, text]) => (
          <div key={title}>
            <h3 className="serif">{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
