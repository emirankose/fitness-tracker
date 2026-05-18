import { getGoalLabel } from '../constants/profileGoals'
import { getDailyTotals, loadMeals } from './nutritionStorage'
import { loadProfile } from './profileStorage'
import {
  getLatestRecord,
  loadProgressRecords,
} from './progressStorage'
import { loadWorkouts, sortWorkoutsByDate } from './workoutStorage'

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function getDashboardData(selectedDate = todayISO()) {
  const profile = loadProfile()
  const workouts = sortWorkoutsByDate(loadWorkouts())
  const meals = loadMeals()
  const progressRecords = loadProgressRecords()

  const lastWorkout = workouts[0] ?? null
  const nutritionTotals = getDailyTotals(meals, selectedDate)
  const hasMealsForDay = meals.some((m) => m.date === selectedDate)
  const latestProgress = getLatestRecord(progressRecords)

  return {
    profile: profile
      ? {
          fullName: profile.fullName,
          goal: getGoalLabel(profile.goal),
        }
      : null,
    lastWorkout,
    nutrition: {
      date: selectedDate,
      totals: nutritionTotals,
      hasMealsForDay,
    },
    latestProgress,
  }
}
