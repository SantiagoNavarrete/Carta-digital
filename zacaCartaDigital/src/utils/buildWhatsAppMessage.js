function formatAmount(amount) {
  return `$${Number(amount || 0).toLocaleString('es-AR')}`
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
  tipoPedido,
  sucursal,
  ubicacion,
  porcentajePropina,
  subtotal,
  propina,
  total,
}) {
  const isDelivery = tipoPedido === 'delivery'
  const lines = [
    '🍽️ *NUEVO PEDIDO - EntreNos*',
    '',
    `📦 *Modalidad:* ${isDelivery ? 'Delivery' : 'Retiro en sucursal'}`,
    `🏪 *Sucursal:* ${sucursal?.name ?? 'Sin sucursal seleccionada'}`,
  ]

  if (isDelivery) {
    const address = ubicacion?.address || `${ubicacion?.latitude ?? ''}, ${ubicacion?.longitude ?? ''}`
    lines.push(`📍 *Dirección de entrega:* ${address}`)
    lines.push(`🗺️ *Ubicación:* https://www.google.com/maps?q=${ubicacion?.latitude},${ubicacion?.longitude}`)
  } else {
    if (sucursal?.address) lines.push(`📍 *Dirección:* ${sucursal.address}`)
    if (sucursal?.hours) lines.push(`🕒 *Horario:* ${sucursal.hours}`)
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