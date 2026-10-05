import CartItem from './CartItem'
import TipSelector from './TipSelector'
import PaymentMethodSelector from './PaymentMethodSelector'
import PayButton from './PayButton'
import { useCart } from '../context/useCart'
import { formatMXN } from '../utils/currency'

function CartDrawer({ sucursal, ubicacion, whatsappNumber }) {
  const { items, subtotal, discountAmount, costoDelivery, zonaSeleccionada, total, closeCart, isCartOpen } = useCart()
  if (!isCartOpen) return null

  function handleChooseDeliveryZone() {
    closeCart()
    window.requestAnimationFrame(() => {
      document.getElementById('delivery-selection')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('delivery-zone-search')?.focus({ preventScroll: true })
    })
  }

  return (
    <div className="cart-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeCart()
    }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart-drawer-header">
          <div>
            <p className="complements-eyebrow">ENTRENOS</p>
            <h2 id="cart-title">Tu pedido</h2>
          </div>
          <button type="button" className="cart-close" onClick={closeCart} aria-label="Cerrar carrito">×</button>
        </header>
        {items.length > 0 ? (
          <>
            <ul className="cart-items-list">{items.map((item) => <CartItem key={item.id} item={item} />)}</ul>
            <div className="cart-totals">
              <div className="cart-total-line"><span>Subtotal</span><strong>{formatMXN(subtotal)}</strong></div>
              {discountAmount > 0 && <div className="cart-total-line"><span>Descuento de promoción</span><strong>−{formatMXN(discountAmount)}</strong></div>}
              <div className="cart-total-line">
                <span>{zonaSeleccionada ? `Envío (${zonaSeleccionada})` : 'Envío'}</span>
                <strong>{zonaSeleccionada ? formatMXN(costoDelivery) : 'Elegí una zona'}</strong>
              </div>
              <TipSelector />
              <div className="cart-total-line cart-grand-total"><span>Total</span><strong>{formatMXN(total)}</strong></div>
              <PaymentMethodSelector />
            </div>
          </>
        ) : (
          <p className="cart-empty">Todavía no agregaste productos.</p>
        )}
        <PayButton sucursal={sucursal} ubicacion={ubicacion} whatsappNumber={whatsappNumber} onChooseDeliveryZone={handleChooseDeliveryZone} />
      </aside>
    </div>
  )
}

export default CartDrawer