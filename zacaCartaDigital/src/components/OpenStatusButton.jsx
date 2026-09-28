import { useState } from 'react'
import { HORARIOS } from '../config'
import useOpenStatus, { formatNextOpening } from '../useOpenStatus'
import InfoModal from './InfoModal'

function OpenStatusButton({ branches }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const schedule = branches[0]?.horarios ?? HORARIOS
  const status = useOpenStatus(schedule)

  return (
    <>
      <button
        type="button"
        className={`open-status-button ${status.isOpen ? 'is-open' : 'is-closed'}`}
        onClick={() => setIsModalOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
      >
        <span className="status-indicator" aria-hidden="true" />
        <span className="status-copy">
          <span>{status.isOpen ? 'Abierto ahora' : '¡Abrimos pronto!'}</span>
          {!status.isOpen && <span className="status-next-open">{formatNextOpening(status.nextOpening, status.now)}</span>}
        </span>
      </button>
      {isModalOpen && <InfoModal branches={branches} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default OpenStatusButton