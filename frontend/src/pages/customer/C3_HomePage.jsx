import { Link } from 'react-router-dom'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ProductCard from '../../components/customer/ProductCard'
import AboutSection from '../../components/customer/AboutSection'
import Button from '../../components/common/Button'
import Icon from '../../components/common/Icon'
import { useStore } from '../../context/StoreContext'
import { heroImage } from '../../data/images'

/* small decorative pieces */
const Sparkle = ({ className }) => (
  <svg className={`deco deco--sparkle ${className}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c.7 6.2 3.2 9.9 12 12-8.8 2.1-11.3 5.8-12 12-.7-6.2-3.2-9.9-12-12C8.8 9.9 11.3 6.2 12 0Z" />
  </svg>
)
const Heart = ({ className }) => (
  <svg className={`deco deco--heart ${className}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11Z" />
  </svg>
)

export default function C3_HomePage() {
  const { products, productsReady, productsError, refreshProducts } = useStore()
  const featured = products.slice(0, 4)

  return (
    <div className="page">
      <Navbar />
      <main>
        {/* HERO — the photo fills the rest of the screen under the navbar */}
        <section className="hero">
          <img className="hero__img" src={heroImage} alt="" aria-hidden="true" />
          <div className="hero__veil" aria-hidden="true" />

          <Sparkle className="deco--a" /><Sparkle className="deco--b" /><Sparkle className="deco--c" />
          <Heart className="deco--d" /><Heart className="deco--e" />

          <div className="hero__inner">
            <div className="hero__text">
              <span className="hero__eyebrow">New collection <Heart className="deco--inline" /></span>
              <h1 className="serif">Discover Your Signature <em>Scent.</em></h1>
              <p className="hero__script">Made with Love, Worn with Delight.</p>
              <p className="hero__lead">Elegant, long-lasting fragrances for every moment.</p>
              <div className="hero__cta">
                <Button to="/shop" kind="dark" className="hero__btn">
                  Shop Now <Icon name="right" size={16} />
                </Button>
                <a href="#featured" className="hero__ghost">
                  <span className="hero__ghost-icon"><Icon name="down" size={16} /></span>
                  See Featured
                </a>
              </div>
              <p className="hero__meta">{products.length} fragrances &middot; 50 ml Eau de Parfum</p>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="section" id="featured">
          <div className="section__head">
            <h2 className="serif">Featured Products</h2>
            <Link to="/shop" className="link-arrow">View All <Icon name="right" size={16} /></Link>
          </div>
          {productsError ? (
            <div className="notice notice--error" role="alert">
              {productsError} <button type="button" className="link-arrow" onClick={refreshProducts}>Try again</button>
            </div>
          ) : !productsReady ? (
            <p className="empty">Loading products…</p>
          ) : featured.length === 0 ? (
            <p className="empty">No products yet.</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* ABOUT (the navbar's ABOUT link scrolls here) */}
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
