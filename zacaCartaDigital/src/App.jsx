import { useState } from 'react'
import { branches } from './data/branches'
import { menuSections, complements } from './data/menuData'
import BranchSelector from './components/BranchSelector'
import CartDrawer from './components/CartDrawer'
import CartIcon from './components/CartIcon'
import LocationPicker from './components/LocationPicker'
import OrderTypeModal from './components/OrderTypeModal'
import { useCart } from './context/useCart'
import { formatARS } from './utils/currency'
import './App.css'

function ChefHat() {
  return (
    <svg className="chef-hat" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 31a12 12 0 0 1 6-22 13 13 0 0 1 24 0 12 12 0 0 1 6 22v22H14V31Z" fill="currentColor" />
      <path d="M13 35h38v9H13zM19 54h26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 16c-3 3-4 7-3 10m15-10c3 3 4 7 3 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
    </svg>
  )
}

function Header({ search, onSearchChange, tipoPedido, onChangeOrderType }) {
  return (
    <header className="site-header">
      {tipoPedido && (
        <button type="button" className="order-type-switch" onClick={onChangeOrderType}>
          {tipoPedido === 'retiro' ? 'Retiro en sucursal' : 'Delivery'} <span>Cambiar</span>
        </button>
      )}
      <div className="brand-mark"><ChefHat /></div>
      <p className="header-kicker">COCINA MEXICANA · ITALIANA · ARGENTINA</p>
      <h1>EntreNos</h1>
      <p className="tagline">Más que comida, buenos momentos</p>
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

function MenuItem({ item, sectionId }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  return (
    <li className="menu-item">
      <div className="item-main">
        <span className="item-name">{item.name}</span>
        {item.description && <span className="item-description">{item.description}</span>}
      </div>
      <span className="dot-leader" aria-hidden="true" />
      <span className="item-price">{formatARS(item.price)}</span>
      <div className="menu-item-actions">
        <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={`Disminuir cantidad de ${item.name}`}>−</button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label={`Aumentar cantidad de ${item.name}`}>+</button>
        </div>
        <button
          type="button"
          className="add-to-cart"
          onClick={() => addItem({ id: `${sectionId}:${item.name}`, name: item.name, price: item.price }, quantity)}
        >
          Agregar
        </button>
      </div>
    </li>
  )
}

function CategorySection({ section }) {
  return (
    <section className="category-section" id={section.id}>
      <div className="section-heading">
        <span className="section-index">{section.number}</span>
        <h2>{section.title}</h2>
        {section.subtitle && <span className="section-subtitle">{section.subtitle}</span>}
      </div>
      {section.note && <p className="section-note">{section.note}</p>}
      <ul className="menu-list">{section.items.map((item) => <MenuItem key={item.name} item={item} sectionId={section.id} />)}</ul>
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

function Footer() {
  return <footer className="site-footer">Pasión por la buena comida <span aria-label="amor">♥</span></footer>
}

function App() {
  const [tipoPedido, setTipoPedido] = useState(() => {
    try {
      const savedType = window.localStorage.getItem('entrenos:tipoPedido')
      return savedType === 'retiro' || savedType === 'delivery' ? savedType : null
    } catch {
      return null
    }
  })
  const [search, setSearch] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const [preferredBranchId, setPreferredBranchId] = useState('')
  const [assignedBranch, setAssignedBranch] = useState(null)
  const [pickupBranchId, setPickupBranchId] = useState('')
  const [confirmedLocationKey, setConfirmedLocationKey] = useState(null)
  const locationKey = deliveryLocation ? `${deliveryLocation.latitude},${deliveryLocation.longitude}` : null
  const selectionKey = tipoPedido === 'retiro'
    ? pickupBranchId
    : locationKey && assignedBranch ? `${locationKey},${assignedBranch.id}` : null
  const orderReady = Boolean(selectionKey) && confirmedLocationKey === selectionKey
  const normalizedSearch = search.trim().toLocaleLowerCase('es')
  const visibleSections = menuSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      `${item.name} ${item.description ?? ''}`.toLocaleLowerCase('es').includes(normalizedSearch),
    ),
  }))

  function selectOrderType(orderType) {
    setTipoPedido(orderType)
    setConfirmedLocationKey(null)
    try {
      window.localStorage.setItem('entrenos:tipoPedido', orderType)
    } catch {
      return
    }
  }

  function changeOrderType() {
    setTipoPedido(null)
    setConfirmedLocationKey(null)
    try {
      window.localStorage.removeItem('entrenos:tipoPedido')
    } catch {
      return
    }
  }

  if (!tipoPedido) return <OrderTypeModal onSelect={selectOrderType} />

  return (
    <div className="menu-page">
      <div className="corner-ribbon corner-ribbon-top" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom" aria-hidden="true" />
      <Header
        search={search}
        onSearchChange={setSearch}
        tipoPedido={tipoPedido}
        onChangeOrderType={changeOrderType}
      />
      <nav className="category-nav" aria-label="Categorías del menú">
        {visibleSections.map((section) => (
          <a key={section.id} href={`#${section.id}`} aria-disabled={section.items.length === 0} className={section.items.length === 0 ? 'is-disabled' : ''}>
            {section.title}
          </a>
        ))}
      </nav>
      <main className="menu-content">
        {visibleSections.some((section) => section.items.length > 0)
          ? visibleSections.filter((section) => section.items.length > 0).map((section) => <CategorySection key={section.id} section={section} />)
          : <p className="empty-state">No encontramos platos con “{search}”. Prueba con otro nombre.</p>}
        <section className="delivery-section" aria-labelledby="delivery-title">
          <div className="section-heading">
            <span className="section-index">00</span>
            <h2 id="delivery-title">{tipoPedido === 'retiro' ? '¿Dónde lo retirás?' : '¿Dónde te lo llevamos?'}</h2>
          </div>
          <p className="delivery-intro">
            {tipoPedido === 'retiro'
              ? 'Elegí la sucursal donde vas a pasar a buscar tu pedido.'
              : 'Elegí el punto de entrega y verificamos qué sucursal puede atenderte.'}
          </p>
          <div className={`delivery-grid ${tipoPedido === 'retiro' ? 'is-pickup' : ''}`}>
            {tipoPedido === 'delivery' && (
              <LocationPicker location={deliveryLocation} onLocationChange={setDeliveryLocation} />
            )}
            {tipoPedido === 'retiro' ? (
              <BranchSelector
                key={tipoPedido}
                mode="pickup"
                pickupBranchId={pickupBranchId}
                onPickupBranchChange={(branchId) => {
                  setPickupBranchId(branchId)
                  setConfirmedLocationKey(null)
                }}
              />
            ) : (
              <BranchSelector
                key={tipoPedido}
                location={deliveryLocation}
                preferredBranchId={preferredBranchId}
                onPreferredBranchChange={(branchId) => {
                  setPreferredBranchId(branchId)
                  setConfirmedLocationKey(null)
                }}
                onAssignmentChange={setAssignedBranch}
              />
            )}
          </div>
          <button
            type="button"
            className="delivery-continue"
            disabled={!selectionKey}
            onClick={() => setConfirmedLocationKey(selectionKey)}
          >
            Continuar con el pedido
          </button>
          {orderReady && (
            <p className="delivery-saved" role="status">
              {tipoPedido === 'retiro'
                ? `Retiro guardado en ${branches.find((branch) => branch.id === pickupBranchId)?.name}.`
                : `Ubicación guardada: ${deliveryLocation.address || `${deliveryLocation.latitude.toFixed(5)}, ${deliveryLocation.longitude.toFixed(5)}`} · ${assignedBranch.name}.`}
            </p>
          )}
        </section>
        <Complements />
      </main>
      <Footer />
      <CartIcon />
      <CartDrawer />
    </div>
  )
}

export default App