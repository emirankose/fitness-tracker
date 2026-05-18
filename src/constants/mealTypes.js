export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Kahvaltı' },
  { value: 'lunch', label: 'Öğle' },
  { value: 'dinner', label: 'Akşam' },
]

export function getMealLabel(value) {
  return MEAL_TYPES.find((m) => m.value === value)?.label ?? value
}
