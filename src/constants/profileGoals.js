export const PROFILE_GOALS = [
  { value: 'lose_weight', label: 'Kilo Vermek' },
  { value: 'gain_muscle', label: 'Kas Kazanmak' },
  { value: 'maintain', label: 'Form Koruma' },
]

export function getGoalLabel(value) {
  return PROFILE_GOALS.find((g) => g.value === value)?.label ?? value
}
