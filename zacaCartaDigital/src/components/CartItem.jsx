import { useCart } from '../context/useCart'
import { formatMXN } from '../utils/currency'

function CartItem({ item }) {
  const { setQuantity, removeItem } = useCart()

  return (
    <li className="cart-item">
      <div className="cart-item-heading">
        <div>
          <h3>{item.name}</h3>
          <p>{formatMXN(item.price)} c/u</p>
        </div>
        <button type="button" className="cart-remove" onClick={() => removeItem(item.id)} aria-label={`Quitar ${item.name} del carrito`} title="Quitar del carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
        </button>
      </div>
      <div className="cart-item-footer">
        <div className="quantity-control cart-quantity" aria-label={`Cantidad de ${item.name}`}>
          <button
            type="button"
            onClick={() => setQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={`Disminuir cantidad de ${item.name}`}
          >−</button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar cantidad de ${item.name}`}>+</button>
        </div>
        <strong className="cart-item-subtotal">{formatMXN(item.price * item.quantity)}</strong>
      </div>
    </li>
  )
}

export default CartItem