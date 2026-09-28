import { useEffect, useState } from 'react'

const dayKeys = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function normalizeIntervals(daySchedule) {
  if (!daySchedule) return []
  return Array.isArray(daySchedule) ? daySchedule : [daySchedule]
}

function getIntervalMinutes(interval) {
  const [openHour, openMinute] = interval.abre.split(':').map(Number)
  const [closeHour, closeMinute] = interval.cierra.split(':').map(Number)
  const opensAt = openHour * 60 + openMinute
  let closesAt = closeHour * 60 + closeMinute
  if (closesAt <= opensAt) closesAt += 24 * 60
  return { opensAt, closesAt }
}

export function calculateOpenStatus(schedule, now = new Date()) {
  const todayMinutes = now.getHours() * 60 + now.getMinutes()
  const todayKey = dayKeys[now.getDay()]

  const isOpenToday = normalizeIntervals(schedule[todayKey]).some((interval) => {
    const { opensAt, closesAt } = getIntervalMinutes(interval)
    return todayMinutes >= opensAt && todayMinutes < closesAt
  })
  const yesterdayKey = dayKeys[(now.getDay() + 6) % 7]
  const isOpenFromYesterday = normalizeIntervals(schedule[yesterdayKey]).some((interval) => {
    const { closesAt } = getIntervalMinutes(interval)
    return closesAt > 24 * 60 && todayMinutes < closesAt - 24 * 60
  })

  if (isOpenToday || isOpenFromYesterday) {
    return { isOpen: true, todayKey, nextOpening: null }
  }

  const nowMinutes = now.getTime()
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidateDate = new Date(now)
    candidateDate.setDate(now.getDate() + offset)
    const candidateKey = dayKeys[candidateDate.getDay()]
    const intervals = normalizeIntervals(schedule[candidateKey])
      .map((interval) => ({ interval, ...getIntervalMinutes(interval) }))
      .sort((first, second) => first.opensAt - second.opensAt)

    for (const { opensAt } of intervals) {
      const openingDate = new Date(candidateDate)
      openingDate.setHours(Math.floor(opensAt / 60), opensAt % 60, 0, 0)
      if (openingDate.getTime() > nowMinutes) {
        return { isOpen: false, todayKey, nextOpening: openingDate }
      }
    }
  }

  return { isOpen: false, todayKey, nextOpening: null }
}

export function formatNextOpening(date, now = new Date()) {
  if (!date) return 'No hay próximos horarios disponibles'
  const daysAway = Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate())
    - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  if (daysAway === 0) return `Abre hoy a las ${time}`
  if (daysAway === 1) return `Abre mañana a las ${time}`
  return `Abre el ${dayNames[date.getDay()]} a las ${time}`
}

export default function useOpenStatus(schedule) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return { ...calculateOpenStatus(schedule, now), now }
}