import CartItem from './CartItem'
import TipSelector from './TipSelector'
import { useCart } from '../context/useCart'
import { formatARS } from '../utils/currency'

function CartDrawer() {
  const { items, subtotal, total, closeCart, isCartOpen } = useCart()
  if (!isCartOpen) return null

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
              <div className="cart-total-line"><span>Subtotal</span><strong>{formatARS(subtotal)}</strong></div>
              <TipSelector />
              <div className="cart-total-line cart-grand-total"><span>Total</span><strong>{formatARS(total)}</strong></div>
            </div>
          </>
        ) : (
          <p className="cart-empty">Todavía no agregaste productos.</p>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer