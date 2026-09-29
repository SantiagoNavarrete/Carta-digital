import { useMemo, useRef, useState } from 'react'
import { WHATSAPP_NUMBER } from '../config'
import { ZONAS_DELIVERY } from '../data/zonasDelivery'
import { formatARS } from '../utils/currency'

function DeliveryZoneSelector({ zonaSeleccionada, onSelectZone }) {
  const [query, setQuery] = useState(zonaSeleccionada ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const normalizedQuery = query.trim().toLocaleLowerCase('es')
  const filteredZones = useMemo(() => ZONAS_DELIVERY.filter(({ zona }) =>
    zona.toLocaleLowerCase('es').includes(normalizedQuery),
  ), [normalizedQuery])
  const whatsappMessage = encodeURIComponent('Hola, no encuentro mi zona en la lista. ¿Me confirman el costo de envío?')
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  function selectZone(zone) {
    setQuery(zone.zona)
    setIsOpen(false)
    setActiveIndex(0)
    onSelectZone(zone)
  }

  function handleChange(event) {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    setIsOpen(true)
    setActiveIndex(0)
    if (zonaSeleccionada) onSelectZone(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' && filteredZones.length > 0) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((index) => Math.min(index + 1, filteredZones.length - 1))
    }

    if (event.key === 'ArrowUp' && filteredZones.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    }

    if (event.key === 'Enter' && isOpen && filteredZones[activeIndex]) {
      event.preventDefault()
      selectZone(filteredZones[activeIndex])
    }
  }

  return (
    <div className="delivery-zone-selector">
      <label htmlFor="delivery-zone-search">Zona de entrega</label>
      <div className="delivery-zone-search-wrap">
        <svg className="delivery-zone-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          ref={inputRef}
          id="delivery-zone-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="delivery-zone-options"
          aria-activedescendant={isOpen && filteredZones[activeIndex] ? `delivery-zone-${activeIndex}` : undefined}
          autoComplete="off"
          placeholder="Buscá tu colonia o zona"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            className="delivery-zone-clear"
            aria-label="Limpiar zona"
            onClick={() => {
              setQuery('')
              setIsOpen(true)
              inputRef.current?.focus()
              if (zonaSeleccionada) onSelectZone(null)
            }}
          >
            ×
          </button>
        )}
        {isOpen && (
          <ul className="delivery-zone-options" id="delivery-zone-options" role="listbox">
            {filteredZones.length > 0 ? filteredZones.map((zone, index) => (
              <li
                id={`delivery-zone-${index}`}
                key={zone.zona}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectZone(zone)}
              >
                <span>{zone.zona}</span>
                <strong>{formatARS(zone.costo)}</strong>
              </li>
            )) : (
              <li className="delivery-zone-empty" role="status">
                No encontramos una zona con “{query}”.
              </li>
            )}
          </ul>
        )}
      </div>
      {zonaSeleccionada && (
        <p className="delivery-zone-selected" role="status">
          <span>Zona seleccionada</span>
          <strong>{zonaSeleccionada}</strong>
          <b>{formatARS(ZONAS_DELIVERY.find(({ zona }) => zona === zonaSeleccionada)?.costo)}</b>
        </p>
      )}
      <a className="delivery-zone-help" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        ¿No encontrás tu zona? Escribinos por WhatsApp para confirmar el costo de envío
      </a>
    </div>
  )
}

export default DeliveryZoneSelector