import { Fragment, useEffect, useRef, useState } from 'react'
import { branches } from './data/branches'
import { menuSections as defaultMenuSections, complements } from './data/menuData'
import { FACEBOOK_URL, HORARIOS, INSTAGRAM_URL, WHATSAPP_NUMBER } from './config'
import BranchSelector from './components/BranchSelector'
import CartDrawer from './components/CartDrawer'
import CartIcon from './components/CartIcon'
import FlyingDot from './components/FlyingDot'
import OpenStatusButton from './components/OpenStatusButton'
import DeliveryZoneSelector from './components/DeliveryZoneSelector'
import LocationPicker from './components/LocationPicker'
import WelcomeSplash from './components/WelcomeSplash'
import SocialLinks from './components/SocialLinks'
import { useCart } from './context/useCart'
import CartProvider from './context/CartProvider'
import useFlyToCart from './useFlyToCart'
import { formatMXN } from './utils/currency'
import { isPromoCurrent } from './utils/promotions'
import useAdminData from './hooks/useAdminData'
import Admin from './components/Admin'
import milanesasImage from './assets/fotosStock/milanesas.jfif'
import pizzaImage from './assets/fotosStock/pizza.jfif'
import quesadillasImage from './assets/fotosStock/quesadillas.jfif'
import tacosImage from './assets/fotosStock/tacos.webp'
import empanadasImage from './assets/fotosStock/empanadas.png'
import burritosImage from './assets/fotosStock/burritos.png'
import calzonesImage from './assets/fotosStock/calzones.jpg'
import './App.css'

const categoryImages = {
  Empanadas: empanadasImage,
  Calzones: calzonesImage,
  Milanesas: milanesasImage,
  Pizzas: pizzaImage,
  Quesadillas: quesadillasImage,
  Tacos: tacosImage,
  Burritos: burritosImage,
}

function ChefHat() {
  return (
    <svg className="chef-hat" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 31a12 12 0 0 1 6-22 13 13 0 0 1 24 0 12 12 0 0 1 6 22v22H14V31Z" fill="currentColor" />
      <path d="M13 35h38v9H13zM19 54h26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 16c-3 3-4 7-3 10m15-10c3 3 4 7 3 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
    </svg>
  )
}

function Header({ search, onSearchChange, instagramUrl, facebookUrl }) {
  return (
    <header className="site-header">
      <div className="brand-mark"><ChefHat /></div>
      <p className="header-kicker">COCINA MEXICANA · ITALIANA · ARGENTINA</p>
      <h1>EntreNos</h1>
      <p className="tagline">Más que comida, buenos momentos</p>
      <SocialLinks instagramUrl={instagramUrl} facebookUrl={facebookUrl} />
      <div className="flag-rule" aria-hidden="true"><span /><span /><span /></div>
      <label className="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Busca tu próximo antojo"
          aria-label="Buscar platos"
        />
        {search && <button type="button" onClick={() => onSearchChange('')} aria-label="Limpiar búsqueda">×</button>}
      </label>
    </header>
  )
}

function MenuItem({ item, sectionId, flyToCart, showDivider }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  return (
    <li className="menu-item">
      <div className="menu-item-content">
        <div className="item-main">
          <span className="item-name">{item.name}</span>
          {item.description && <span className="item-description">{item.description}</span>}
        </div>
        <span className="dot-leader" aria-hidden="true" />
        <span className="item-price">{formatMXN(item.price)}</span>
        <div className="menu-item-actions">
          <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={`Disminuir cantidad de ${item.name}`}>−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label={`Aumentar cantidad de ${item.name}`}>+</button>
          </div>
          <button
            type="button"
            className="add-to-cart"
            onClick={(event) => {
              const itemToAdd = { id: item.id ?? `${sectionId}:${item.name}`, name: item.name, price: item.price, categoria: item.categoria }
              flyToCart(event.currentTarget, () => addItem(itemToAdd, quantity))
            }}
          >
            Agregar
          </button>
        </div>
      </div>
      {showDivider && <Divider />}
    </li>
  )
}

function Divider() {
  return <div className="menu-divider" aria-hidden="true" />
}

function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

function CategorySection({ section, flyToCart }) {
  const categoryImage = categoryImages[section.title]

  return (
    <section className="category-section" id={section.id}>
      <div className="section-heading">
        <div className="section-heading-copy">
          <span className="section-index">{section.number}</span>
          <div className="section-title-copy">
            <h2>{section.title}</h2>
            {section.subtitle && <span className="section-subtitle">{section.subtitle}</span>}
          </div>
        </div>
        <div className={`category-image${categoryImage ? '' : ' is-placeholder'}`} aria-hidden="true">
          {categoryImage ? <img src={categoryImage} alt="" /> : <ChefHat />}
        </div>
      </div>
      {section.note && <p className="section-note">{section.note}</p>}
      <ul className="menu-list">{section.items.map((item, index) => <MenuItem key={item.name} item={item} sectionId={section.id} flyToCart={flyToCart} showDivider={index < section.items.length - 1} />)}</ul>
      {section.footnote && <p className="section-footnote">{section.footnote}</p>}
    </section>
  )
}

function Complements() {
  return (
    <aside className="complements" aria-labelledby="complements-title">
      <div>
        <p className="complements-eyebrow">EL TOQUE FINAL</p>
        <h2 id="complements-title">Complementos a elección <span>¡GRATIS!</span></h2>
      </div>
      <ul className="complement-list">
        {complements.map((complement) => (
          <li key={complement.name}><span aria-hidden="true">{complement.icon}</span>{complement.name}</li>
        ))}
      </ul>
    </aside>
  )
}

function Footer({ instagramUrl, facebookUrl }) {
  return (
    <footer className="site-footer">
      <span className="footer-tagline">Pasión por la buena comida <span aria-label="amor">♥</span></span>
      <SocialLinks instagramUrl={instagramUrl} facebookUrl={facebookUrl} />
    </footer>
  )
}

function PromoBanner({ promos }) {
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    if (promos.length < 2) return undefined
    const interval = window.setInterval(() => setActiveIndex((index) => (index + 1) % promos.length), 6000)
    return () => window.clearInterval(interval)
  }, [promos.length])
  if (promos.length === 0) return null
  const promo = promos[activeIndex % promos.length]
  return (
    <aside className="promo-banner" aria-label="Promociones vigentes">
      <div><span className="promo-banner-label">PROMOCIÓN</span><strong>{promo.titulo}</strong><span>{promo.descripcion}</span></div>
      {promos.length > 1 && <div className="promo-banner-controls"><button type="button" aria-label="Promoción anterior" onClick={() => setActiveIndex((index) => (index - 1 + promos.length) % promos.length)}>‹</button><span>{activeIndex + 1} / {promos.length}</span><button type="button" aria-label="Siguiente promoción" onClick={() => setActiveIndex((index) => (index + 1) % promos.length)}>›</button></div>}
    </aside>
  )
}

function createMenuSections(products) {
  const activeProducts = products.filter((product) => product.activo).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
  const categories = [...new Set(activeProducts.map((product) => product.categoria).filter(Boolean))]
  return categories.map((category, index) => {
    const original = defaultMenuSections.find((section) => section.title === category)
    return {
      id: category.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      number: original?.number ?? String(index + 1).padStart(2, '0'),
      title: category,
      subtitle: original?.subtitle,
      note: original?.note,
      footnote: original?.footnote,
      items: activeProducts.filter((product) => product.categoria === category).map((product) => ({
        id: product.id,
        name: product.nombre,
        price: Number(product.precio || 0),
        description: product.descripcion,
        categoria: product.categoria,
      })),
    }
  })
}

function PublicMenu({ data, activePromos }) {
  const cartIconRef = useRef(null)
  const { flyToCart, flights, finishFlight } = useFlyToCart(cartIconRef)
  const { zonaSeleccionada, setDeliveryZone } = useCart()
  const menuSections = data.loading
    ? defaultMenuSections.map((section) => ({ ...section, items: [] }))
    : createMenuSections(data.productos)
  const config = data.config ?? {}
  const whatsappNumber = config.whatsappNumber || WHATSAPP_NUMBER
  const horarios = config.horarios || HORARIOS
  const instagramUrl = config.instagramUrl || INSTAGRAM_URL
  const facebookUrl = config.facebookUrl || FACEBOOK_URL
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true)
  const [search, setSearch] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const [preferredBranchId, setPreferredBranchId] = useState('')
  const [assignedBranch, setAssignedBranch] = useState(null)
  const normalizedSearch = search.trim().toLocaleLowerCase('es')
  const visibleSections = menuSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      `${item.name} ${item.description ?? ''}`.toLocaleLowerCase('es').includes(normalizedSearch),
    ),
  }))
  const menuSectionsToShow = data.loading
    ? visibleSections
    : visibleSections.filter((section) => section.items.length > 0)

  return (
    <>
      {isWelcomeVisible && <WelcomeSplash onComplete={setIsWelcomeVisible} />}
      <div className="menu-page" inert={isWelcomeVisible}>
      <div className="corner-ribbon corner-ribbon-top" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom" aria-hidden="true" />
      <Header
        search={search}
        onSearchChange={setSearch}
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
      />
      <PromoBanner promos={activePromos} />
      <nav className="category-nav" aria-label="Categorías del menú">
        {visibleSections.map((section) => (
          <a key={section.id} href={`#${section.id}`} aria-disabled={section.items.length === 0} className={section.items.length === 0 ? 'is-disabled' : ''}>
            {section.title}
          </a>
        ))}
      </nav>
      <main className="menu-content">
        {menuSectionsToShow.length > 0
          ? menuSectionsToShow.map((section, index) => (
            <Fragment key={section.id}>
              {index > 0 && <SectionDivider />}
              <CategorySection section={section} flyToCart={flyToCart} />
            </Fragment>
          ))
          : <p className="empty-state">No encontramos platos con “{search}”. Prueba con otro nombre.</p>}
        <section className="delivery-section" aria-labelledby="delivery-title">
          <div className="section-heading">
            <span className="section-index">00</span>
            <h2 id="delivery-title">Elegí tu zona de entrega</h2>
          </div>
          <p className="delivery-intro">
            Seleccioná tu zona para calcular el costo de envío. El mapa es opcional y sirve como referencia de ubicación.
          </p>
          <DeliveryZoneSelector
            zonaSeleccionada={zonaSeleccionada}
            zones={data.zonasDelivery}
            whatsappNumber={whatsappNumber}
            onSelectZone={(zone) => setDeliveryZone(zone?.zona ?? null, zone?.costo ?? 0)}
          />
          <div className="delivery-grid">
            <LocationPicker location={deliveryLocation} onLocationChange={setDeliveryLocation} />
            <BranchSelector
              location={deliveryLocation}
              preferredBranchId={preferredBranchId}
              onPreferredBranchChange={setPreferredBranchId}
              onAssignmentChange={setAssignedBranch}
            />
          </div>
        </section>
        <Complements />
      </main>
      <Footer instagramUrl={instagramUrl} facebookUrl={facebookUrl} />
      <CartIcon ref={cartIconRef} />
      <CartDrawer
        sucursal={assignedBranch}
        ubicacion={deliveryLocation}
        whatsappNumber={whatsappNumber}
      />
      {flights.map((flight) => <FlyingDot key={flight.id} flight={flight} onFinish={finishFlight} />)}
      </div>
      <OpenStatusButton branches={branches} horarios={horarios} />
    </>
  )
}

function App() {
  const data = useAdminData()
  if (window.location.pathname.startsWith('/admin')) return <Admin data={data} />
  if (data.error) return <main className="firebase-state firebase-error" role="alert"><h1>No pudimos cargar la carta</h1><p>{data.error}</p></main>

  const activePromos = data.promociones.filter((promo) => isPromoCurrent(promo))
  return <CartProvider promotions={activePromos}><PublicMenu data={data} activePromos={activePromos} /></CartProvider>
}

export default App