import DashboardCard from './DashboardCard'

function formatSummaryDate(dateStr) {
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

const MACROS = [
  { key: 'calories', label: 'Kalori', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Karbonhidrat', unit: 'g' },
  { key: 'fat', label: 'Yağ', unit: 'g' },
]

function NutritionTotalsCard({ nutrition, selectedDate, onDateChange }) {
  const { totals, hasMealsForDay } = nutrition

  return (
    <DashboardCard title="Beslenme Toplamı" className="dashboard-card--wide">
      <div className="dashboard-nutrition__header">
        <p className="dashboard-nutrition__date">{formatSummaryDate(selectedDate)}</p>
        <div className="dashboard-nutrition__date-field">
          <label htmlFor="dashboardNutritionDate">Gün seç</label>
          <input
            id="dashboardNutritionDate"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {!hasMealsForDay ? (
        <p className="dashboard-empty">
          Bu gün için öğün kaydı yok. Nutrition sayfasından ekleyin.
        </p>
      ) : (
        <div className="dashboard-macro-grid">
          {MACROS.map(({ key, label, unit }) => (
            <div key={key} className="dashboard-macro">
              <span>{label}</span>
              <strong>
                {Math.round(totals[key] * 10) / 10}
                <small>{unit}</small>
              </strong>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}

export default NutritionTotalsCard
