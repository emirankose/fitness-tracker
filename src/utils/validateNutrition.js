function validateNonNegativeNumber(value, label) {
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

  return null
}

export function validateMeal(form) {
  const errors = {}

  if (!form.mealType?.trim()) {
    errors.mealType = 'Öğün seçimi zorunludur'
  }

  const caloriesError = validateNonNegativeNumber(form.calories, 'Kalori')
  if (caloriesError) errors.calories = caloriesError

  const proteinError = validateNonNegativeNumber(form.protein, 'Protein')
  if (proteinError) errors.protein = proteinError

  const carbsError = validateNonNegativeNumber(form.carbs, 'Karbonhidrat')
  if (carbsError) errors.carbs = carbsError

  const fatError = validateNonNegativeNumber(form.fat, 'Yağ')
  if (fatError) errors.fat = fatError

  if (!form.date?.trim()) {
    errors.date = 'Tarih zorunludur'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function normalizeMeal(form) {
  return {
    mealType: form.mealType,
    calories: Number(form.calories),
    protein: Number(form.protein),
    carbs: Number(form.carbs),
    fat: Number(form.fat),
    date: form.date,
  }
}
