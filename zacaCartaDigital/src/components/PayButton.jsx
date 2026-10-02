import { useState } from 'react'
import { useCart } from '../context/useCart'
import { buildWhatsAppMessage } from '../utils/buildWhatsAppMessage'

function PayButton({ sucursal, ubicacion, whatsappNumber }) {
  const { items, subtotal, zonaSeleccionada, costoDelivery, tipPercentage, tipAmount, metodoPago, total, clearCart } = useCart()
  const [wasSent, setWasSent] = useState(false)

  let missingRequirement = ''
  if (items.length === 0) missingRequirement = 'Agregá al menos un producto para continuar.'
  else if (!zonaSeleccionada) missingRequirement = 'Elegí tu zona de entrega para continuar.'
  else if (!metodoPago) missingRequirement = 'Elegí el método de pago para continuar.'

  function handlePay() {
    if (missingRequirement) return

    const message = buildWhatsAppMessage({
      items,
      sucursal,
      ubicacion,
      zonaSeleccionada,
      costoDelivery,
      metodoPago,
      porcentajePropina: tipPercentage,
      subtotal,
      propina: tipAmount,
      total,
    })
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setWasSent(true)
  }

  function handleClearCart() {
    if (window.confirm('¿Querés vaciar el carrito? Esta acción no se puede deshacer.')) {
      clearCart()
      setWasSent(false)
    }
  }

  return (
    <div className="cart-checkout">
      <button type="button" className="pay-button" onClick={handlePay} disabled={Boolean(missingRequirement)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.3 11.8a8.3 8.3 0 0 1-12.2 7.4L3 20.5l1.3-4.9a8.3 8.3 0 1 1 16-3.8Z" />
          <path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.6 1 1.4 1.8 2.5 2.3.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.1-.6 1.4-.4.4-1 .7-2 .6-1-.1-2.5-.6-4.1-2-1.3-1.1-2.2-2.4-2.5-3.4-.4-1 .1-2.1.5-2.8Z" />
        </svg>
        <span>Enviar comanda a cocina</span>
      </button>
      {missingRequirement && <p className="checkout-hint" role="status">{missingRequirement}</p>}
      {wasSent && (
        <div className="checkout-success" role="status">
          <p>¡Gracias! Te redirigimos a WhatsApp para confirmar tu pedido 🎉</p>
          <button type="button" className="clear-cart-button" onClick={handleClearCart}>Vaciar carrito</button>
        </div>
      )}
    </div>
  )
}

export default PayButton