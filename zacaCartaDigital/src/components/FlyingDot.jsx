import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function FlyingDot({ flight, onFinish }) {
  const dotRef = useRef(null)

  useEffect(() => {
    const element = dotRef.current
    if (!element || typeof element.animate !== 'function') {
      onFinish(flight.id)
      return undefined
    }

    const midpointX = (flight.startX + flight.endX) / 2
    const midpointY = Math.min(flight.startY, flight.endY) - 76
    const animation = element.animate(
      [
        {
          transform: 'translate3d(var(--start-x), var(--start-y), 0) translate(-50%, -50%) scale(1)',
          opacity: 1,
        },
        {
          transform: `translate3d(${midpointX}px, ${midpointY}px, 0) translate(-50%, -50%) scale(.8)`,
          opacity: 0.88,
        },
        {
          transform: 'translate3d(var(--end-x), var(--end-y), 0) translate(-50%, -50%) scale(.16)',
          opacity: 0,
        },
      ],
      { duration: 1300, easing: 'cubic-bezier(.34,.86,.64,1)', fill: 'forwards' },
    )
    animation.onfinish = () => onFinish(flight.id)

    return () => animation.cancel()
  }, [flight, onFinish])

  return createPortal(
    <span
      ref={dotRef}
      className="flying-dot"
      style={{
        '--start-x': `${flight.startX}px`,
        '--start-y': `${flight.startY}px`,
        '--end-x': `${flight.endX}px`,
        '--end-y': `${flight.endY}px`,
      }}
      aria-hidden="true"
    >
      +1
    </span>,
    document.body,
  )
}

export default FlyingDot