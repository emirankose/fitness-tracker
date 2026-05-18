export function validateProgress(form) {
  const errors = {}

  if (!form.date?.trim()) {
    errors.date = 'Tarih zorunludur'
  }

  if (form.weight === '' || form.weight === null || form.weight === undefined) {
    errors.weight = 'Kilo zorunludur'
  } else {
    const weight = Number(form.weight)

    if (Number.isNaN(weight)) {
      errors.weight = 'Kilo geçerli bir sayı olmalıdır'
    } else if (weight <= 0) {
      errors.weight = 'Kilo 0\'dan büyük olmalıdır'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function normalizeProgress(form) {
  return {
    date: form.date,
    weight: Number(form.weight),
  }
}
