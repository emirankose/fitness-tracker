import { getStorageItem, setStorageItem } from './storage'

const NUTRITION_KEY = 'nutrition'

export function loadMeals() {
  const data = getStorageItem(NUTRITION_KEY)
  return Array.isArray(data) ? data : []
}

export function saveMeals(meals) {
  return setStorageItem(NUTRITION_KEY, meals)
}

export function addMeal(meal) {
  const list = loadMeals()
  const entry = {
    ...meal,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  saveMeals([entry, ...list])
  return entry
}

export function sortMealsByDate(meals) {
  return [...meals].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date)
    if (dateDiff !== 0) return dateDiff
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function getMealsByDate(meals, date) {
  return meals.filter((m) => m.date === date)
}

export function getDailyTotals(meals, date) {
  const dayMeals = getMealsByDate(meals, date)

  return dayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
