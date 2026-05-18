import { useCallback, useEffect, useState } from 'react'
import WorkoutForm from '../components/workouts/WorkoutForm'
import WorkoutList from '../components/workouts/WorkoutList'
import {
  addWorkout,
  deleteWorkout,
  loadWorkouts,
  sortWorkoutsByDate,
} from '../utils/workoutStorage'
import { normalizeWorkout, validateWorkout } from '../utils/validateWorkout'
import './Workouts.css'

const EMPTY_FORM = {
  exerciseName: '',
  sets: '',
  reps: '',
  duration: '',
  date: new Date().toISOString().slice(0, 10),
}

function Workouts() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [workouts, setWorkouts] = useState(() => sortWorkoutsByDate(loadWorkouts()))
  const [successMessage, setSuccessMessage] = useState('')

  const refreshWorkouts = useCallback(() => {
    setWorkouts(sortWorkoutsByDate(loadWorkouts()))
  }, [])

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [successMessage])

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

    const { isValid, errors: validationErrors } = validateWorkout(form)
    setErrors(validationErrors)

    if (!isValid) return

    addWorkout(normalizeWorkout(form))
    refreshWorkouts()
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
    setSuccessMessage('Antrenman başarıyla eklendi.')
  }

  const handleDelete = (id, exerciseName) => {
    const confirmed = window.confirm(
      `"${exerciseName}" antrenmanını silmek istediğinize emin misiniz?`,
    )
    if (!confirmed) return

    deleteWorkout(id)
    refreshWorkouts()
  }

  return (
    <div className="workouts-page">
      <header className="workouts-page__header">
        <h1>Workouts</h1>
        <p>Antrenman planlarınızı görüntüleyin ve düzenleyin.</p>
      </header>

      {successMessage && (
        <div className="workouts-alert" role="status">
          {successMessage}
        </div>
      )}

      <section className="workouts-form-card" aria-labelledby="workout-form-title">
        <h2 id="workout-form-title">Yeni Antrenman</h2>
        <WorkoutForm
          form={form}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>

      <section className="workouts-list-card" aria-labelledby="workout-list-title">
        <h2 id="workout-list-title">Antrenman Geçmişi</h2>
        <WorkoutList workouts={workouts} onDelete={handleDelete} />
      </section>
    </div>
  )
}

export default Workouts
