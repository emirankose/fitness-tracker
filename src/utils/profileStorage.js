import { getStorageItem, setStorageItem } from './storage'

const PROFILE_KEY = 'profile'

export function loadProfile() {
  return getStorageItem(PROFILE_KEY)
}

export function saveProfile(profile) {
  return setStorageItem(PROFILE_KEY, {
    ...profile,
    updatedAt: new Date().toISOString(),
  })
}
