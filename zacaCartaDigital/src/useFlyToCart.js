import { useCallback, useEffect, useRef, useState } from 'react'

function useFlyToCart(cartElementRef) {
  const [flights, setFlights] = useState([])
  const nextFlightId = useRef(0)
  const arrivals = useRef(new Map())

  useEffect(() => () => arrivals.current.clear(), [])

  const bounceCounter = useCallback((isReducedMotion) => {
    const counter = cartElementRef.current?.querySelector('.cart-count')
    if (!counter || typeof counter.animate !== 'function') return

    counter.getAnimations().forEach((animation) => animation.cancel())
    counter.animate(
      isReducedMotion
        ? [
          { transform: 'scale(1)', backgroundColor: '#e71417' },
          { transform: 'scale(1.08)', backgroundColor: '#30bcf9' },
          { transform: 'scale(1)', backgroundColor: '#e71417' },
        ]
        : [
          { transform: 'scale(1)' },
          { transform: 'scale(1.35)' },
          { transform: 'scale(1)' },
        ],
      { duration: isReducedMotion ? 240 : 300, easing: 'ease-out' },
    )
  }, [cartElementRef])

  const finishFlight = useCallback((flightId) => {
    const onArrival = arrivals.current.get(flightId)
    if (!onArrival) return
    arrivals.current.delete(flightId)
    onArrival()
    setFlights((currentFlights) => currentFlights.filter((flight) => flight.id !== flightId))
    bounceCounter(false)
  }, [bounceCounter])

  const flyToCart = useCallback((originElement, onArrival) => {
    const cartElement = cartElementRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    if (reducedMotion) {
      onArrival()
      bounceCounter(true)
      return
    }

    if (!originElement?.isConnected || !cartElement?.isConnected) {
      onArrival()
      return
    }

    const originRect = originElement.getBoundingClientRect()
    const cartRect = cartElement.getBoundingClientRect()
    const cartStyle = window.getComputedStyle(cartElement)
    if (
      originRect.width === 0 || originRect.height === 0
      || cartRect.width === 0 || cartRect.height === 0
      || cartStyle.visibility === 'hidden' || cartStyle.display === 'none'
    ) {
      onArrival()
      return
    }

    const id = nextFlightId.current + 1
    nextFlightId.current = id
    arrivals.current.set(id, onArrival)
    setFlights((currentFlights) => [...currentFlights, {
      id,
      startX: originRect.left + originRect.width / 2,
      startY: originRect.top + originRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    }])
  }, [bounceCounter, cartElementRef])

  return { flyToCart, flights, finishFlight }
}

export default useFlyToCart