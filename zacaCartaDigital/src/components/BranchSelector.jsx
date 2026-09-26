import { useEffect } from 'react'
import { branches } from '../data/branches'
import CoverageBanner from './CoverageBanner'

function distanceInKm(first, second) {
  const radians = (degrees) => degrees * Math.PI / 180
  const latitudeDelta = radians(second.latitude - first.latitude)
  const longitudeDelta = radians(second.longitude - first.longitude)
  const latitudeOne = radians(first.latitude)
  const latitudeTwo = radians(second.latitude)
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.sin(longitudeDelta / 2) ** 2

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function findCoveredBranches(location) {
  if (!location) return []

  return branches
    .map((branch) => ({
      branch,
      distance: distanceInKm(location, branch),
    }))
    .filter(({ branch, distance }) => distance <= branch.coverageKm)
    .sort((first, second) => first.distance - second.distance)
}

function BranchSelector({
  mode = 'delivery',
  location,
  preferredBranchId,
  onPreferredBranchChange,
  onAssignmentChange,
  pickupBranchId,
  onPickupBranchChange,
}) {
  const coveredBranches = findCoveredBranches(location)
  const preferredMatch = coveredBranches.find(({ branch }) => branch.id === preferredBranchId)
  const assignedBranch = preferredMatch?.branch ?? coveredBranches[0]?.branch ?? null
  const pickupBranch = branches.find((branch) => branch.id === pickupBranchId) ?? null

  useEffect(() => {
    if (mode === 'delivery') onAssignmentChange(assignedBranch)
  }, [mode, assignedBranch, onAssignmentChange])

  const isPickup = mode === 'pickup'
  const selectedBranch = isPickup ? pickupBranch : assignedBranch
  const selectedValue = isPickup ? pickupBranchId : preferredBranchId

  function handleBranchChange(event) {
    if (isPickup) onPickupBranchChange(event.target.value)
    else onPreferredBranchChange(event.target.value)
  }

  return (
    <div className="branch-selector">
      <label htmlFor={isPickup ? 'pickup-branch' : 'branch-preference'}>
        {isPickup ? 'Sucursal para retirar' : 'Sucursal o zona'}
      </label>
      <select
        id={isPickup ? 'pickup-branch' : 'branch-preference'}
        value={selectedValue}
        onChange={handleBranchChange}
      >
        {isPickup
          ? <option value="">Elegí una sucursal</option>
          : <option value="">Asignar automáticamente</option>}
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {isPickup ? branch.name : `${branch.name} · radio ${branch.coverageKm} km`}
          </option>
        ))}
      </select>
      {isPickup ? (
        selectedBranch ? (
          <div className="pickup-branch-details" aria-live="polite">
            <strong>{selectedBranch.name}</strong>
            <span>{selectedBranch.address}</span>
            <span>Horario: {selectedBranch.hours}</span>
          </div>
        ) : <p className="branch-hint">Elegí la sucursal donde vas a retirar tu pedido.</p>
      ) : (
        <>
          <p className="branch-hint">Zonas de ejemplo: editá nombres, coordenadas y radios en <code>src/data/branches.js</code>.</p>
          <CoverageBanner branch={assignedBranch} hasLocation={Boolean(location)} />
        </>
      )}
    </div>
  )
}

export default BranchSelector