import { useCallback, useEffect, useState } from 'react'
import WorkoutForm from '../components/workouts/WorkoutForm'
import WorkoutList from '../components/workouts/WorkoutList'
import {
  addWorkout,
  deleteWorkout,
  loadWorkouts,
  sortWorkoutsByDate,
  updateWorkout,
} from '../utils/workoutStorage'
import { normalizeWorkout, validateWorkout } from '../utils/validateWorkout'
import './Workouts.css'

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  exerciseName: '',
  sets: '',
  reps: '',
  duration: '',
  date: today(),
}

function workoutToForm(workout) {
  return {
    exerciseName: workout.exerciseName ?? '',
    sets: String(workout.sets ?? ''),
    reps: String(workout.reps ?? ''),
    duration: String(workout.duration ?? ''),
    date: workout.date ?? today(),
  }
}

function Workouts() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [workouts, setWorkouts] = useState(() => sortWorkoutsByDate(loadWorkouts()))
  const [editingId, setEditingId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const refreshWorkouts = useCallback(() => {
    setWorkouts(sortWorkoutsByDate(loadWorkouts()))
  }, [])

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [successMessage])

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

    const { isValid, errors: validationErrors } = validateWorkout(form)
    setErrors(validationErrors)

    if (!isValid) return

    const normalized = normalizeWorkout(form)

    if (editingId) {
      updateWorkout(editingId, normalized)
      refreshWorkouts()
      resetForm()
      setSuccessMessage('Antrenman başarıyla güncellendi.')
      return
    }

    addWorkout(normalized)
    refreshWorkouts()
    resetForm()
    setSuccessMessage('Antrenman başarıyla eklendi.')
  }

  const handleEdit = (workout) => {
    setEditingId(workout.id)
    setForm(workoutToForm(workout))
    setErrors({})
    setSuccessMessage('')
  }

  const handleDelete = (id, exerciseName) => {
    const confirmed = window.confirm(
      `"${exerciseName}" antrenmanını silmek istediğinize emin misiniz?`,
    )
    if (!confirmed) return

    deleteWorkout(id)
    if (editingId === id) resetForm()
    refreshWorkouts()
    setSuccessMessage('Antrenman silindi.')
  }

  return (
    <div className="workouts-page">
      <header className="workouts-page__header">
        <h1>Antrenmanlar</h1>
        <p>Antrenman planlarınızı görüntüleyin ve düzenleyin.</p>
      </header>

      {successMessage && (
        <div className="workouts-alert" role="status">
          {successMessage}
        </div>
      )}

      <section className="workouts-form-card" aria-labelledby="workout-form-title">
        <h2 id="workout-form-title">
          {editingId ? 'Antrenmanı Düzenle' : 'Yeni Antrenman'}
        </h2>
        <WorkoutForm
          form={form}
          errors={errors}
          isEditing={Boolean(editingId)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </section>

      <section className="workouts-list-card" aria-labelledby="workout-list-title">
        <h2 id="workout-list-title">Antrenman Geçmişi</h2>
        <WorkoutList
          workouts={workouts}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </div>
  )
}

export default Workouts
