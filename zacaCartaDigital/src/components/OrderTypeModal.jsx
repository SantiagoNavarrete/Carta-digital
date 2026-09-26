function OrderTypeModal({ onSelect }) {
  return (
    <div className="order-type-overlay">
      <section className="order-type-modal" role="dialog" aria-modal="true" aria-labelledby="order-type-title">
        <div className="order-type-brand-mark" aria-hidden="true">E</div>
        <p className="header-kicker">ENTRENOS · COCINA PARA COMPARTIR</p>
        <h1 id="order-type-title">¿Cómo querés tu pedido?</h1>
        <p className="order-type-subtitle">Elegí una opción para ver la carta</p>
        <div className="order-type-options">
          <button type="button" className="order-type-option" onClick={() => onSelect('retiro')}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M7 20h34v22H7zM4 20l4-13h32l4 13M4 20a5 5 0 0 0 10 0 5 5 0 0 0 10 0 5 5 0 0 0 10 0 5 5 0 0 0 10 0M17 42V29h10v13" />
            </svg>
            <span>Retiro en sucursal</span>
            <small>Pasás a buscarlo</small>
          </button>
          <button type="button" className="order-type-option" onClick={() => onSelect('delivery')}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M4 23 24 6l11 9M10 20v21h14M20 41h16M27 27h10l6 8v6h-5M27 27v14M17 41a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm19 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M28 32h7l3 4" />
            </svg>
            <span>Delivery</span>
            <small>Te lo llevamos</small>
          </button>
        </div>
      </section>
    </div>
  )
}

export default OrderTypeModal