import { useEffect, useState } from 'react'

function WelcomeSplash({ onComplete }) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsLeaving(true), 3000)
    const completeTimer = window.setTimeout(() => onComplete(false), 3450)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className={`welcome-splash${isLeaving ? ' is-leaving' : ''}`}>
      <div className="corner-ribbon corner-ribbon-top" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-top-right" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom-left" aria-hidden="true" />
      <main className="welcome-content" aria-label="Bienvenida a EntreNos">
        <div className="welcome-brand-mark" aria-hidden="true">
          <span />
          <div className="welcome-hat-circle">
            <svg className="welcome-chef-hat" viewBox="0 0 64 64">
              <path d="M14 31a12 12 0 0 1 6-22 13 13 0 0 1 24 0 12 12 0 0 1 6 22v22H14V31Z" fill="currentColor" />
              <path d="M13 35h38v9H13zM19 54h26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M26 16c-3 3-4 7-3 10m15-10c3 3 4 7 3 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
            </svg>
          </div>
          <span />
        </div>
        <h1>¡Bienvenida a EntreNos!</h1>
        <p className="welcome-message">Acá empieza una gran experiencia, ¡Directo hacia su puerta!</p>
        <svg className="welcome-scooter" viewBox="0 0 64 48" aria-hidden="true">
          <circle cx="16" cy="37" r="6" />
          <circle cx="49" cy="37" r="6" />
          <path d="M22 37h13l8-17h9l5 8M35 37l-8-16h-9M44 20h8l4 7H42M40 17h9v3" />
          <path d="M11 13h15l6 8H18M12 13l-3-4" />
        </svg>
        <p className="welcome-tagline">COCINA MEXICANA · ITALIANA · ARGENTINA</p>
      </main>
    </div>
  )
}

export default WelcomeSplash