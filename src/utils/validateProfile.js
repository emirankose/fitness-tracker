const MIN_NUMERIC = 1

function validateNumericField(value, label) {
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

  if (num < MIN_NUMERIC) {
    return `${label} en az ${MIN_NUMERIC} olmalıdır`
  }

  return null
}

export function validateProfile(form) {
  const errors = {}

  if (!form.fullName?.trim()) {
    errors.fullName = 'Ad soyad zorunludur'
  }

  const ageError = validateNumericField(form.age, 'Yaş')
  if (ageError) errors.age = ageError

  const heightError = validateNumericField(form.height, 'Boy')
  if (heightError) errors.height = heightError

  const weightError = validateNumericField(form.weight, 'Kilo')
  if (weightError) errors.weight = weightError

  if (!form.goal?.trim()) {
    errors.goal = 'Hedef seçimi zorunludur'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function normalizeProfile(form) {
  return {
    fullName: form.fullName.trim(),
    age: Number(form.age),
    height: Number(form.height),
    weight: Number(form.weight),
    goal: form.goal,
  }
}
