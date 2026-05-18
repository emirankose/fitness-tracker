import { getMealLabel } from '../../constants/mealTypes'

function formatDate(dateStr) {
  try {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function NutritionList({ meals }) {
  if (meals.length === 0) {
    return <p className="nutrition-list__empty">Henüz öğün eklenmedi</p>
  }

  return (
    <ul className="nutrition-list">
      {meals.map((meal) => (
        <li key={meal.id} className="nutrition-card">
          <div className="nutrition-card__header">
            <h3>{getMealLabel(meal.mealType)}</h3>
            <time dateTime={meal.date}>{formatDate(meal.date)}</time>
          </div>
          <div className="nutrition-card__macros">
            <div>
              <span>Kalori</span>
              <strong>{meal.calories} kcal</strong>
            </div>
            <div>
              <span>Protein</span>
              <strong>{meal.protein} g</strong>
            </div>
            <div>
              <span>Karbonhidrat</span>
              <strong>{meal.carbs} g</strong>
            </div>
            <div>
              <span>Yağ</span>
              <strong>{meal.fat} g</strong>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NutritionList
