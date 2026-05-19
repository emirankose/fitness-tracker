import { getStorageItem, setStorageItem } from './storage'

const PROGRESS_KEY = 'progress'

export function loadProgressRecords() {
  const data = getStorageItem(PROGRESS_KEY)
  return Array.isArray(data) ? data : []
}

export function saveProgressRecords(records) {
  return setStorageItem(PROGRESS_KEY, records)
}

export function addProgressRecord(record) {
  const list = loadProgressRecords()
  const entry = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  saveProgressRecords([entry, ...list])
  return entry
}

export function deleteProgressRecord(id) {
  const list = loadProgressRecords().filter((r) => r.id !== id)
  return saveProgressRecords(list)
}

export function sortRecordsByDateDesc(records) {
  return [...records].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date)
    if (dateDiff !== 0) return dateDiff
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function sortRecordsByDateAsc(records) {
  return [...records].sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date)
    if (dateDiff !== 0) return dateDiff
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
}

export function getLatestRecord(records) {
  const sorted = sortRecordsByDateDesc(records)
  return sorted[0] ?? null
}

export function toChartData(records) {
  return sortRecordsByDateAsc(records).map((record) => ({
    date: formatChartDate(record.date),
    weight: record.weight,
    fullDate: record.date,
  }))
}

function formatChartDate(dateStr) {
  try {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return dateStr
  }
}
