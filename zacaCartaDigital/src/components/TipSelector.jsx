import { tipPercentages } from '../data/cartConfig'
import { useCart } from '../context/useCart'
import { formatMXN } from '../utils/currency'

function TipSelector() {
  const { tipPercentage, setTipPercentage, tipAmount } = useCart()

  return (
    <fieldset className="tip-selector">
      <legend>¿Querés agregar propina?</legend>
      <div className="tip-options" role="group" aria-label="Porcentaje de propina">
        {tipPercentages.map((percentage) => (
          <button
            key={percentage}
            type="button"
            className={tipPercentage === percentage ? 'tip-option is-selected' : 'tip-option'}
            aria-pressed={tipPercentage === percentage}
            onClick={() => setTipPercentage(percentage)}
          >
            {percentage}%
          </button>
        ))}
      </div>
      <p className="tip-amount">Propina ({tipPercentage}%): <strong>{formatMXN(tipAmount)}</strong></p>
    </fieldset>
  )
}

export default TipSelector