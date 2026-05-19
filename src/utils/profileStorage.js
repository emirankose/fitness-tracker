import { getStorageItem, removeStorageItem, setStorageItem } from './storage'

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

export function deleteProfile() {
  return removeStorageItem(PROFILE_KEY)
}
