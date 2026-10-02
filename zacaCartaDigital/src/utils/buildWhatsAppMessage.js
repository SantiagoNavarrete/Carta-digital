import { formatMXN } from './currency'
import { ALIAS_TRANSFERENCIA } from '../config'

const paymentMethodLabels = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
}

function formatAmount(amount) {
  return formatMXN(Number(amount || 0))
}

function getItemComplements(item) {
  const complements = item.complements ?? item.extras ?? []
  const names = Array.isArray(complements)
    ? complements.map((complement) => typeof complement === 'string' ? complement : complement.name).filter(Boolean)
    : [complements].filter(Boolean)
  return names.length > 0 ? ` (${names.join(', ')})` : ''
}

export function buildWhatsAppMessage({
  items,
  sucursal,
  ubicacion,
  zonaSeleccionada,
  costoDelivery,
  metodoPago,
  porcentajePropina,
  subtotal,
  propina,
  total,
}) {
  const lines = [
    '🍽️ *NUEVO PEDIDO - EntreNos*',
    '',
    '📦 *Modalidad:* Delivery',
    `🏪 *Sucursal:* ${sucursal?.name ?? 'Sin sucursal seleccionada'}`,
    `🏘️ *Zona de entrega:* ${zonaSeleccionada}`,
    `🛵 *Envío (${zonaSeleccionada}):* ${formatAmount(costoDelivery)}`,
    `💳 *Método de pago:* ${paymentMethodLabels[metodoPago] ?? 'Sin seleccionar'}`,
  ]

  if (metodoPago === 'transferencia') lines.push(`🏦 *Alias:* ${ALIAS_TRANSFERENCIA}`)

  if (ubicacion) {
    const address = ubicacion.address || `${ubicacion.latitude}, ${ubicacion.longitude}`
    lines.push(`📍 *Dirección de entrega:* ${address}`)
    lines.push(`🗺️ *Ubicación:* https://www.google.com/maps?q=${ubicacion.latitude},${ubicacion.longitude}`)
  }

  lines.push('', '🛒 *Pedido:*')
  items.forEach((item) => {
    const lineTotal = item.price * item.quantity
    lines.push(`- ${item.quantity}x ${item.name}${getItemComplements(item)} - ${formatAmount(lineTotal)}`)
  })

  lines.push('', `💵 *Subtotal:* ${formatAmount(subtotal)}`)
  lines.push(porcentajePropina > 0
    ? `🙌 *Propina (${porcentajePropina}%):* ${formatAmount(propina)}`
    : '🙌 *Propina:* Sin propina')
  lines.push(`✅ *TOTAL A PAGAR:* ${formatAmount(total)}`)

  return lines.join('\n')
}

export default buildWhatsAppMessage