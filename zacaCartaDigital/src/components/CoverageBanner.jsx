function CoverageBanner({ branch, hasLocation }) {
  if (!hasLocation) {
    return <div className="coverage-banner coverage-banner-pending" role="status">Elegí un punto en el mapa para verificar la cobertura.</div>
  }

  if (!branch) {
    return <div className="coverage-banner coverage-banner-outside" role="alert">Lo sentimos, no llegamos a tu zona todavía.</div>
  }

  return <div className="coverage-banner coverage-banner-covered" role="status">Te atiende la sucursal {branch.name}.</div>
}

export default CoverageBanner