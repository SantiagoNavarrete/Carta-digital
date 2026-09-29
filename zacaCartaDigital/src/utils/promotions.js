export function isPromoCurrent(promo, now = new Date()) {
  if (!promo.activo) return false

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (promo.fechaInicio && today < promo.fechaInicio) return false
  if (promo.fechaFin && today > promo.fechaFin) return false
  if (Array.isArray(promo.dias) && promo.dias.length > 0 && !promo.dias.includes(now.getDay())) return false

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  if (promo.horaDesde && promo.horaHasta) {
    if (promo.horaDesde <= promo.horaHasta) {
      if (time < promo.horaDesde || time > promo.horaHasta) return false
    } else if (time < promo.horaDesde && time > promo.horaHasta) {
      return false
    }
  }

  return true
}

export function getPromoDiscount(items, promos) {
  return promos.reduce((total, promo) => {
    if (promo.tipo !== 'porcentaje' && promo.tipo !== 'monto') return total
    const eligibleItems = promo.categoriaAplicable
      ? items.filter((item) => item.categoria === promo.categoriaAplicable)
      : items
    const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = promo.tipo === 'porcentaje'
      ? eligibleSubtotal * Number(promo.valor || 0) / 100
      : Number(promo.valor || 0)
    return total + Math.min(eligibleSubtotal, discount)
  }, 0)
}