import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { branches } from '../data/branches'

const defaultCenter = [-34.6177, -68.3301]
const locationIcon = L.divIcon({
  className: 'location-marker',
  html: '<span></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

function LocationPicker({ location, onLocationChange }) {
  const mapElement = useRef(null)
  const mapInstance = useRef(null)
  const marker = useRef(null)
  const [addressStatus, setAddressStatus] = useState('')
  const [geolocationError, setGeolocationError] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const latitude = location?.latitude
  const longitude = location?.longitude

  useEffect(() => {
    const map = L.map(mapElement.current).setView(defaultCenter, 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    branches.forEach((branch) => {
      L.circle([branch.latitude, branch.longitude], {
        radius: branch.coverageKm * 1000,
        color: '#07563b',
        fillColor: '#30bcf9',
        fillOpacity: 0.08,
        weight: 1,
      }).addTo(map)
    })
    map.on('click', (event) => {
      setAddressStatus('')
      onLocationChange({ latitude: event.latlng.lat, longitude: event.latlng.lng, address: '' })
      setGeolocationError('')
    })
    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
      marker.current = null
    }
  }, [onLocationChange])

  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    if (latitude == null || longitude == null) {
      marker.current?.remove()
      marker.current = null
      return
    }

    const point = [latitude, longitude]
    if (!marker.current) {
      marker.current = L.marker(point, { icon: locationIcon, draggable: true }).addTo(map)
      marker.current.on('dragend', (event) => {
        const selected = event.target.getLatLng()
        setAddressStatus('')
        onLocationChange({ latitude: selected.lat, longitude: selected.lng, address: '' })
      })
    } else {
      marker.current.setLatLng(point)
    }
    map.flyTo(point, 15, { duration: 0.7 })
  }, [latitude, longitude, onLocationChange])

  useEffect(() => {
    if (latitude == null || longitude == null) return undefined

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setAddressStatus('Buscando dirección aproximada…')
      try {
        const query = new URLSearchParams({
          format: 'jsonv2',
          lat: String(latitude),
          lon: String(longitude),
        })
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('No se pudo consultar la dirección.')
        const result = await response.json()
        const address = result.display_name || 'No encontramos una dirección para este punto.'
        onLocationChange({ latitude, longitude, address })
        setAddressStatus(address)
      } catch (error) {
        if (error.name !== 'AbortError') setAddressStatus('No pudimos obtener la dirección. La ubicación sigue guardada en el mapa.')
      }
    }, 900)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [latitude, longitude, onLocationChange])

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeolocationError('Este navegador no permite obtener la ubicación automáticamente.')
      return
    }

    setIsLocating(true)
    setGeolocationError('')
    setAddressStatus('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationChange({ latitude: coords.latitude, longitude: coords.longitude, address: '' })
        setIsLocating(false)
      },
      (error) => {
        setGeolocationError(error.code === error.PERMISSION_DENIED
          ? 'No tenemos permiso para acceder a tu ubicación. Podés elegir el punto en el mapa.'
          : 'No pudimos obtener tu ubicación. Probá marcando el punto en el mapa.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <div className="location-picker">
      <div className="location-map-heading">
        <p>Marcá dónde recibís tu pedido</p>
        <button type="button" className="location-button" onClick={useCurrentLocation} disabled={isLocating}>
          <span aria-hidden="true">⌖</span>{isLocating ? 'Buscando…' : 'Usar mi ubicación actual'}
        </button>
      </div>
      <div ref={mapElement} className="delivery-map" role="application" aria-label="Mapa para seleccionar la ubicación de entrega" />
      <p className="address-line" aria-live="polite">
        <span aria-hidden="true">⌖</span>{addressStatus || (location?.address ?? 'La dirección aproximada aparecerá acá.')}
      </p>
      {geolocationError && <p className="location-error" role="alert">{geolocationError}</p>}
    </div>
  )
}

export default LocationPicker