function validateNonNegativeNumber(value, label, allowZero = true) {
  if (value === '' || value === null || value === undefined) {
    return `${label} zorunludur`
  }

  const num = Number(value)

  if (Number.isNaN(num)) {
    return `${label} geçerli bir sayı olmalıdır`
  }

  if (num < 0) {
    return `${label} negatif olamaz`
  }

  if (!allowZero && num === 0) {
    return `${label} 0 olamaz`
  }

  return null
}

export function validateWorkout(form) {
  const errors = {}

  if (!form.exerciseName?.trim()) {
    errors.exerciseName = 'Egzersiz adı zorunludur'
  }

  const setsError = validateNonNegativeNumber(form.sets, 'Set sayısı')
  if (setsError) errors.sets = setsError

  const repsError = validateNonNegativeNumber(form.reps, 'Tekrar sayısı')
  if (repsError) errors.reps = repsError

  const durationError = validateNonNegativeNumber(form.duration, 'Süre')
  if (durationError) errors.duration = durationError

  if (!form.date?.trim()) {
    errors.date = 'Tarih zorunludur'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function normalizeWorkout(form) {
  return {
    exerciseName: form.exerciseName.trim(),
    sets: Number(form.sets),
    reps: Number(form.reps),
    duration: Number(form.duration),
    date: form.date,
  }
}
