import { useCart } from '../context/useCart'

function CartIcon() {
  const { itemCount, openCart } = useCart()

  return (
    <button type="button" className="cart-fab" onClick={openCart} aria-label={`Abrir carrito, ${itemCount} productos`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 9H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <span className="cart-fab-label">Carrito</span>
      <span className="cart-count" aria-live="polite">{itemCount}</span>
    </button>
  )
}

export default CartIcon