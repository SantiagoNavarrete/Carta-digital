import { useState } from 'react'
import { ALIAS_TRANSFERENCIA } from '../config'
import { useCart } from '../context/useCart'

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta', label: 'Tarjeta' },
]

function PaymentMethodSelector() {
  const { metodoPago, setMetodoPago } = useCart()
  const [copied, setCopied] = useState(false)

  async function copyAlias() {
    await navigator.clipboard.writeText(ALIAS_TRANSFERENCIA)
    setCopied(true)
  }

  return (
    <fieldset className="payment-method-selector">
      <legend>Método de pago</legend>
      <div className="payment-method-options" role="group" aria-label="Método de pago">
        {paymentMethods.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={metodoPago === value ? 'tip-option is-selected' : 'tip-option'}
            aria-pressed={metodoPago === value}
            onClick={() => setMetodoPago(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {metodoPago === 'transferencia' && (
        <div className="transfer-alias">
          <span>Alias para transferir: <strong>{ALIAS_TRANSFERENCIA}</strong></span>
          <button type="button" onClick={copyAlias}>{copied ? 'Copiado' : 'Copiar'}</button>
        </div>
      )}
    </fieldset>
  )
}

export default PaymentMethodSelector