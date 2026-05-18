import { useCallback, useEffect, useMemo, useState } from 'react'
import DailySummary from '../components/nutrition/DailySummary'
import NutritionForm from '../components/nutrition/NutritionForm'
import NutritionList from '../components/nutrition/NutritionList'
import {
  addMeal,
  getDailyTotals,
  loadMeals,
  sortMealsByDate,
} from '../utils/nutritionStorage'
import { normalizeMeal, validateMeal } from '../utils/validateNutrition'
import './Nutrition.css'

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  mealType: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  date: today(),
}

function Nutrition() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [meals, setMeals] = useState(() => sortMealsByDate(loadMeals()))
  const [selectedDate, setSelectedDate] = useState(today())
  const [successMessage, setSuccessMessage] = useState('')

  const refreshMeals = useCallback(() => {
    setMeals(sortMealsByDate(loadMeals()))
  }, [])

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const dailyTotals = useMemo(
    () => getDailyTotals(meals, selectedDate),
    [meals, selectedDate],
  )

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateMeal(form)
    setErrors(validationErrors)

    if (!isValid) return

    addMeal(normalizeMeal(form))
    refreshMeals()
    setSelectedDate(form.date)
    setForm({ ...EMPTY_FORM, date: today() })
    setSuccessMessage('Öğün başarıyla eklendi.')
  }

  return (
    <div className="nutrition-page">
      <header className="nutrition-page__header">
        <h1>Nutrition</h1>
        <p>Beslenme kayıtlarınızı ve kalori takibinizi yönetin.</p>
      </header>

      {successMessage && (
        <div className="nutrition-alert" role="status">
          {successMessage}
        </div>
      )}

      <DailySummary
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        totals={dailyTotals}
      />

      <section className="nutrition-form-card" aria-labelledby="nutrition-form-title">
        <h2 id="nutrition-form-title">Yeni Öğün</h2>
        <NutritionForm
          form={form}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>

      <section className="nutrition-list-card" aria-labelledby="nutrition-list-title">
        <h2 id="nutrition-list-title">Öğün Kayıtları</h2>
        <NutritionList meals={meals} />
      </section>
    </div>
  )
}

export default Nutrition
