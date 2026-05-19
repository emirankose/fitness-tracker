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
  { key: 'calories', label: 'Kalori', unit: 'kcal', icon: '🔥' },
  { key: 'protein', label: 'Protein', unit: 'g', icon: '🥩' },
  { key: 'carbs', label: 'Karbonhidrat', unit: 'g', icon: '🍞' },
  { key: 'fat', label: 'Yağ', unit: 'g', icon: '🥑' },
]

function NutritionTotalsCard({ nutrition, selectedDate, onDateChange }) {
  const { totals, hasMealsForDay } = nutrition

  return (
    <DashboardCard title="Beslenme Toplamı" icon="🥗" accent="blue" className="dashboard-card--wide">
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
        <div className="ui-empty dashboard-empty">
          <span className="ui-empty__icon" aria-hidden="true">
            🥗
          </span>
          <p className="ui-empty__text">Bu gün için öğün yok</p>
          <p className="ui-empty__hint">Beslenme sayfasından kalori ve makro kaydı ekleyin.</p>
        </div>
      ) : (
        <div className="dashboard-macro-grid">
          {MACROS.map(({ key, label, unit, icon }) => (
            <div key={key} className="dashboard-macro">
              <span>
                {icon} {label}
              </span>
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
