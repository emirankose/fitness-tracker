import { getStorageItem, setStorageItem } from './storage'

const WORKOUTS_KEY = 'workouts'

export function loadWorkouts() {
  const data = getStorageItem(WORKOUTS_KEY)
  return Array.isArray(data) ? data : []
}

export function saveWorkouts(workouts) {
  return setStorageItem(WORKOUTS_KEY, workouts)
}

export function addWorkout(workout) {
  const list = loadWorkouts()
  const entry = {
    ...workout,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  saveWorkouts([entry, ...list])
  return entry
}

export function deleteWorkout(id) {
  const list = loadWorkouts().filter((w) => w.id !== id)
  return saveWorkouts(list)
}

export function sortWorkoutsByDate(workouts) {
  return [...workouts].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date)
    if (dateDiff !== 0) return dateDiff
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}
