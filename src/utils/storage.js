const STORAGE_PREFIX = 'fittrack'

export const FITTRACK_DATA_UPDATED = 'fittrack-data-updated'

function notifyDataUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(FITTRACK_DATA_UPDATED))
  }
}

export function getStorageItem(key) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value))
    notifyDataUpdated()
    return true
  } catch {
    return false
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}:${key}`)
    notifyDataUpdated()
    return true
  } catch {
    return false
  }
}
