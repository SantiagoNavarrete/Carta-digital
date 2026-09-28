import { useEffect } from 'react'
import { HORARIOS } from '../config'
import useOpenStatus, { formatNextOpening } from '../useOpenStatus'

const dayKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function intervalsFor(schedule, day) {
  const value = schedule[day]
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function formatDayHours(schedule, day) {
  const intervals = intervalsFor(schedule, day)
  if (intervals.length === 0) return 'Cerrado'
  return intervals.map(({ abre, cierra }) => `${abre}–${cierra}`).join(' · ')
}

function BranchInfo({ branch, index }) {
  const schedule = branch.horarios ?? HORARIOS
  const status = useOpenStatus(schedule)
  const currentDay = dayKeys[status.now.getDay() === 0 ? 6 : status.now.getDay() - 1]
  const mapUrl = new URL('https://www.openstreetmap.org/export/embed.html')
  mapUrl.searchParams.set('bbox', `${branch.longitude - 0.012},${branch.latitude - 0.008},${branch.longitude + 0.012},${branch.latitude + 0.008}`)
  mapUrl.searchParams.set('layer', 'mapnik')
  mapUrl.searchParams.set('marker', `${branch.latitude},${branch.longitude}`)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`

  return (
    <section className="info-branch" aria-labelledby={`branch-title-${branch.id}`}>
      <div className="info-branch-heading">
        <div>
          <p className="info-eyebrow">Sucursal {index + 1}</p>
          <h3 id={`branch-title-${branch.id}`}>{branch.name}</h3>
        </div>
        <span className={`info-status ${status.isOpen ? 'is-open' : 'is-closed'}`}>
          <span aria-hidden="true" />{status.isOpen ? 'Abierto' : 'Cerrado'}
        </span>
      </div>
      {!status.isOpen && <p className="next-opening">{formatNextOpening(status.nextOpening, status.now)}</p>}
      <div className="info-details-grid">
        <div>
          <h4>Horarios</h4>
          <ul className="hours-list">
            {dayKeys.map((day, dayIndex) => (
              <li key={day} className={day === currentDay ? 'is-today' : ''}>
                <span>{dayLabels[dayIndex]}</span>
                <span>{formatDayHours(schedule, day)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="branch-location">
          <h4>Ubicación</h4>
          <p>{branch.address}</p>
          <iframe
            title={`Mapa de ${branch.name}`}
            src={mapUrl.toString()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="directions-link" href={directionsUrl} target="_blank" rel="noopener noreferrer">
            Cómo llegar <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function InfoModal({ branches, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="info-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="info-modal" role="dialog" aria-modal="true" aria-labelledby="info-title">
        <header className="info-modal-header">
          <div>
            <p className="info-eyebrow">Información</p>
            <h2 id="info-title">EntreNos</h2>
          </div>
          <button type="button" className="info-close" onClick={onClose} aria-label="Cerrar horarios y ubicación">×</button>
        </header>
        {branches.map((branch, index) => <BranchInfo key={branch.id} branch={branch} index={index} />)}
      </section>
    </div>
  )
}

export default InfoModal