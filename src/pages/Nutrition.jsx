import { useCallback, useEffect, useMemo, useState } from 'react'
import DailySummary from '../components/nutrition/DailySummary'
import NutritionForm from '../components/nutrition/NutritionForm'
import NutritionList from '../components/nutrition/NutritionList'
import {
  addMeal,
  deleteMeal,
  getDailyTotals,
  loadMeals,
  sortMealsByDate,
  updateMeal,
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

function mealToForm(meal) {
  return {
    mealType: meal.mealType ?? '',
    calories: String(meal.calories ?? ''),
    protein: String(meal.protein ?? ''),
    carbs: String(meal.carbs ?? ''),
    fat: String(meal.fat ?? ''),
    date: meal.date ?? today(),
  }
}

function Nutrition() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [meals, setMeals] = useState(() => sortMealsByDate(loadMeals()))
  const [selectedDate, setSelectedDate] = useState(today())
  const [editingId, setEditingId] = useState(null)
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

  const resetForm = useCallback(() => {
    setForm({ ...EMPTY_FORM, date: today() })
    setEditingId(null)
    setErrors({})
  }, [])

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

    const normalized = normalizeMeal(form)

    if (editingId) {
      updateMeal(editingId, normalized)
      refreshMeals()
      setSelectedDate(normalized.date)
      resetForm()
      setSuccessMessage('Öğün başarıyla güncellendi.')
      return
    }

    addMeal(normalized)
    refreshMeals()
    setSelectedDate(normalized.date)
    resetForm()
    setSuccessMessage('Öğün başarıyla eklendi.')
  }

  const handleEdit = (meal) => {
    setEditingId(meal.id)
    setForm(mealToForm(meal))
    setSelectedDate(meal.date)
    setErrors({})
    setSuccessMessage('')
  }

  const handleDelete = (id, mealLabel) => {
    const confirmed = window.confirm(
      `"${mealLabel}" öğününü silmek istediğinize emin misiniz?`,
    )
    if (!confirmed) return

    deleteMeal(id)
    if (editingId === id) resetForm()
    refreshMeals()
    setSuccessMessage('Öğün silindi.')
  }

  return (
    <div className="nutrition-page">
      <header className="nutrition-page__header">
        <h1>Beslenme</h1>
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
        <h2 id="nutrition-form-title">{editingId ? 'Öğünü Düzenle' : 'Yeni Öğün'}</h2>
        <NutritionForm
          form={form}
          errors={errors}
          isEditing={Boolean(editingId)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </section>

      <section className="nutrition-list-card" aria-labelledby="nutrition-list-title">
        <h2 id="nutrition-list-title">Öğün Kayıtları</h2>
        <NutritionList
          meals={meals}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </div>
  )
}

export default Nutrition
