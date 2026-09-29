export function formatMXN(amount) {
  return Number(amount || 0).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  })
}