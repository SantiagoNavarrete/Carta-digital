import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { branches } from './data/branches'
import { menuSections as defaultMenuSections, complements } from './data/menuData'
import { FACEBOOK_URL, HORARIOS, INSTAGRAM_URL, WHATSAPP_NUMBER } from './config'
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
import { db } from './firebase/config'
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

const savedLocationKey = 'entrenos_direccion_guardada'
const savedCustomerPhoneKey = 'entrenos_cliente_telefono'

function normalizeCustomerPhone(value) {
  return value.replace(/\D/g, '')
}

function isValidCustomerPhone(value) {
  const phone = value.trim()
  return /^\+?[\d\s().-]{8,20}$/.test(phone) && /^\d{8,15}$/.test(normalizeCustomerPhone(phone))
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
      {section.complements && <Complements items={section.complements} id={`${section.id}-complements-title`} />}
      {section.footnote && <p className="section-footnote">{section.footnote}</p>}
    </section>
  )
}

function Complements({ items = complements, id = 'complements-title' } = {}) {
  return (
    <aside className="complements" aria-labelledby={id}>
      <div>
        <p className="complements-eyebrow">EL TOQUE FINAL</p>
        <h2 id={id}>Complementos a elección <span>¡GRATIS!</span></h2>
      </div>
      <ul className="complement-list">
        {items.map((complement) => (
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
      complements: original?.complements,
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
  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      return window.localStorage.getItem(savedCustomerPhoneKey) ?? ''
    } catch {
      return ''
    }
  })
  const [customerName, setCustomerName] = useState('')
  const [customerProfileStatus, setCustomerProfileStatus] = useState(() => {
    try {
      return isValidCustomerPhone(window.localStorage.getItem(savedCustomerPhoneKey) ?? '') ? 'checking' : 'empty'
    } catch {
      return 'empty'
    }
  })
  const [isChangingCustomerAddress, setIsChangingCustomerAddress] = useState(false)
  const [zoneSearchVersion, setZoneSearchVersion] = useState(0)
  const [customerProfileError, setCustomerProfileError] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      const savedLocation = window.localStorage.getItem(savedLocationKey)
      return savedLocation ? JSON.parse(savedLocation) : null
    } catch {
      return null
    }
  })
  const handleLocationChange = useCallback((updates) => {
    setDeliveryLocation((current) => ({ ...current, ...updates }))
  }, [])
  const normalizedCustomerPhone = normalizeCustomerPhone(customerPhone)
  const customerPhoneIsValid = isValidCustomerPhone(customerPhone)

  useEffect(() => {
    if (!customerPhoneIsValid || data.loading) return undefined

    let isCurrentLookup = true
    const timeout = window.setTimeout(async () => {
      try {
        if (!db) {
          setCustomerProfileStatus('unavailable')
          return
        }
        setCustomerProfileStatus('checking')
        window.localStorage.setItem(savedCustomerPhoneKey, normalizedCustomerPhone)
        const snapshot = await getDoc(doc(db, 'clientes', normalizedCustomerPhone))
        if (!isCurrentLookup) return

        if (!snapshot.exists()) {
          setCustomerName('')
          setCustomerProfileStatus('new')
          setIsChangingCustomerAddress(false)
          return
        }

        const profile = snapshot.data()
        setCustomerName(profile.nombre ?? '')
        setIsChangingCustomerAddress(false)
        if (profile.ubicacion?.lat != null && profile.ubicacion?.lng != null) {
          handleLocationChange({
            latitude: Number(profile.ubicacion.lat),
            longitude: Number(profile.ubicacion.lng),
            address: profile.direccionTexto ?? '',
            reference: profile.detallesDireccion ?? '',
          })
        }
        const savedZone = data.zonasDelivery.find(({ zona }) => zona === profile.zonaSeleccionada)
        setDeliveryZone(savedZone?.zona ?? null, savedZone?.costo ?? 0)
        setCustomerProfileStatus('recognized')
      } catch {
        if (isCurrentLookup) setCustomerProfileStatus('unavailable')
      }
    }, 300)

    return () => {
      isCurrentLookup = false
      window.clearTimeout(timeout)
    }
  }, [customerPhone, customerPhoneIsValid, data.loading, data.zonasDelivery, handleLocationChange, normalizedCustomerPhone, setDeliveryZone])

  const saveCustomerProfile = useCallback(() => {
    if (!db || !customerPhoneIsValid || !deliveryLocation
      || deliveryLocation.latitude == null || deliveryLocation.longitude == null) return Promise.resolve()

    const name = customerName.trim()
    return setDoc(doc(db, 'clientes', normalizedCustomerPhone), {
      ...(name ? { nombre: name } : {}),
      telefono: normalizedCustomerPhone,
      ubicacion: { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude },
      direccionTexto: deliveryLocation.address ?? '',
      detallesDireccion: deliveryLocation.reference ?? '',
      zonaSeleccionada: zonaSeleccionada ?? '',
      ultimaActualizacion: serverTimestamp(),
    }, { merge: true })
  }, [customerName, customerPhoneIsValid, deliveryLocation, normalizedCustomerPhone, zonaSeleccionada])

  useEffect(() => {
    if (!['new', 'recognized'].includes(customerProfileStatus) || data.loading
      || deliveryLocation?.latitude == null || deliveryLocation?.longitude == null) return undefined

    const timeout = window.setTimeout(() => {
      saveCustomerProfile()
        .then(() => setCustomerProfileError(''))
        .catch(() => setCustomerProfileError('No pudimos guardar tu dirección. Podés continuar con el pedido.'))
    }, 500)
    return () => window.clearTimeout(timeout)
  }, [customerProfileStatus, data.loading, deliveryLocation, saveCustomerProfile])

  useEffect(() => {
    if (!deliveryLocation) return
    window.localStorage.setItem(savedLocationKey, JSON.stringify(deliveryLocation))
  }, [deliveryLocation])

  function handleCustomerPhoneChange(event) {
    const nextPhone = event.target.value
    const nextNormalizedPhone = normalizeCustomerPhone(nextPhone)
    if (customerProfileStatus === 'recognized' && nextNormalizedPhone !== normalizedCustomerPhone) {
      setDeliveryLocation(null)
      window.localStorage.removeItem(savedLocationKey)
      setDeliveryZone(null, 0)
      setZoneSearchVersion((version) => version + 1)
    }
    setCustomerPhone(nextPhone)
    setIsChangingCustomerAddress(false)
    setCustomerProfileError('')
    const isPhoneValid = isValidCustomerPhone(nextPhone)
    setCustomerProfileStatus(isPhoneValid ? 'checking' : nextPhone.trim() ? 'invalid' : 'empty')
    if (isPhoneValid) window.localStorage.setItem(savedCustomerPhoneKey, nextNormalizedPhone)
    else window.localStorage.removeItem(savedCustomerPhoneKey)
  }

  function changeCustomerAddress() {
    setIsChangingCustomerAddress(true)
    setDeliveryLocation(null)
    window.localStorage.removeItem(savedLocationKey)
    setDeliveryZone(null, 0)
    setZoneSearchVersion((version) => version + 1)
  }
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
        <Complements />
      </main>
      <Footer instagramUrl={instagramUrl} facebookUrl={facebookUrl} />
      <CartIcon ref={cartIconRef} />
      <CartDrawer
        ubicacion={deliveryLocation}
        whatsappNumber={whatsappNumber}
        cliente={customerName}
        onOrderComplete={saveCustomerProfile}
      >
        <section className="cart-delivery-section" aria-labelledby="delivery-title">
          <div className="delivery-card" id="delivery-selection">
            <div className="delivery-card-heading">
              <span aria-hidden="true">📍</span>
              <div>
                <h2 id="delivery-title">¿Dónde te lo llevamos?</h2>
                <p>Elegí tu zona y agregá una referencia para la entrega.</p>
              </div>
            </div>
            <div className="customer-identification">
              <div className="customer-identification-fields">
                <label>
                  Tu número de WhatsApp
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={customerPhone}
                    onChange={handleCustomerPhoneChange}
                    placeholder="Ej: +52 984 123 4567"
                    aria-invalid={Boolean(customerPhone) && !customerPhoneIsValid}
                  />
                  {customerPhone && !customerPhoneIsValid && <small>Ingresá un número válido de 8 a 15 dígitos.</small>}
                </label>
                {!['checking', 'recognized'].includes(customerProfileStatus) && (
                  <label>
                    Tu nombre <span>(opcional)</span>
                    <input
                      type="text"
                      autoComplete="given-name"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="¿Cómo te llamás?"
                    />
                  </label>
                )}
              </div>
              {customerProfileStatus === 'recognized' && !isChangingCustomerAddress && (
                <div className="returning-customer" role="status">
                  <p>¡Hola de nuevo{customerName.trim() ? `, ${customerName.trim()}` : ''}! 👋 Ya tenemos tu dirección guardada</p>
                  <button type="button" onClick={changeCustomerAddress}>No es mi dirección / Cambiar</button>
                </div>
              )}
              {customerProfileError && <p className="customer-profile-error" role="status">{customerProfileError}</p>}
            </div>
            <DeliveryZoneSelector
              key={zoneSearchVersion}
              zonaSeleccionada={zonaSeleccionada}
              zones={data.zonasDelivery}
              whatsappNumber={whatsappNumber}
              onSelectZone={(zone) => setDeliveryZone(zone?.zona ?? null, zone?.costo ?? 0)}
            />
            <div className="delivery-address-details">
              <label className="location-reference-label" htmlFor="location-reference">Detalles de tu dirección</label>
              <input
                id="location-reference"
                className="location-reference-input"
                type="text"
                value={deliveryLocation?.reference ?? ''}
                onChange={(event) => handleLocationChange({ reference: event.target.value })}
                placeholder="Ej: portón blanco, casa con reja negra, depto 3B, timbre no funciona"
              />
              <p className="location-reference-help">Esto ayuda al repartidor a encontrarte más rápido</p>
            </div>
            <div className="delivery-grid">
              <LocationPicker location={deliveryLocation} onLocationChange={handleLocationChange} />
            </div>
          </div>
        </section>
      </CartDrawer>
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