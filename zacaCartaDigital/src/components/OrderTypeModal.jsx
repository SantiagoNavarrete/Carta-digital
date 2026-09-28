function CornerRibbons() {
  return (
    <>
      <div className="corner-ribbon corner-ribbon-top" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-top-right" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom-left" aria-hidden="true" />
    </>
  )
}

function OrderTypeModal({ onSelect }) {
  return (
    <div className="order-type-overlay">
      <CornerRibbons />
      <div className="order-type-composition">
        <div className="order-type-logo">
          <p>EntreNos</p>
        </div>
        <section className="order-type-modal" role="dialog" aria-modal="true" aria-labelledby="order-type-title">
          <div className="order-type-brand-mark" aria-hidden="true">
            <span />
            <svg className="order-type-chef-hat" viewBox="0 0 64 64">
              <path d="M14 31a12 12 0 0 1 6-22 13 13 0 0 1 24 0 12 12 0 0 1 6 22v22H14V31Z" fill="currentColor" />
              <path d="M13 35h38v9H13zM19 54h26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M26 16c-3 3-4 7-3 10m15-10c3 3 4 7 3 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
            </svg>
            <span />
          </div>
          <p className="header-kicker">ENTRENOS · COCINA PARA COMPARTIR</p>
          <h1 id="order-type-title">¿Cómo gusta su pedido?</h1>
          <p className="order-type-subtitle">Elija una opción para ver la carta</p>
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
                <path d="M16 36h7l7-12h6l6 12h-6M23 36l-5-10h-6M28 24h10l4 5h-9M25 20h8v4" />
                <circle cx="16" cy="36" r="5" />
                <circle cx="36" cy="36" r="5" />
              </svg>
              <span>Delivery</span>
              <small>Te lo llevamos</small>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OrderTypeModal