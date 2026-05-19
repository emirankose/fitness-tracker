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

function NutritionList({ meals, onDelete, onEdit, editingId }) {
  if (meals.length === 0) {
    return (
      <div className="ui-empty nutrition-list__empty">
        <span className="ui-empty__icon" aria-hidden="true">
          🥗
        </span>
        <p className="ui-empty__text">Henüz öğün eklenmedi</p>
        <p className="ui-empty__hint">Formu doldurarak günlük beslenmenizi kaydedin.</p>
      </div>
    )
  }

  return (
    <ul className="nutrition-list">
      {meals.map((meal) => (
        <li
          key={meal.id}
          className={`nutrition-card${editingId === meal.id ? ' nutrition-card--editing' : ''}`}
        >
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
          <div className="nutrition-card__actions">
            <button type="button" className="ui-btn-edit nutrition-card__edit" onClick={() => onEdit(meal)}>
              Düzenle
            </button>
            <button
              type="button"
              className="ui-btn-danger nutrition-card__delete"
              onClick={() => onDelete(meal.id, getMealLabel(meal.mealType))}
            >
              Sil
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NutritionList
