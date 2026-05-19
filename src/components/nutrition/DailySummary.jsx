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

const SUMMARY_ITEMS = [
  { key: 'calories', label: 'Kalori', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Karbonhidrat', unit: 'g' },
  { key: 'fat', label: 'Yağ', unit: 'g' },
]

function DailySummary({ selectedDate, onDateChange, totals }) {
  return (
    <section className="nutrition-summary ui-section-card" aria-labelledby="nutrition-summary-title">
      <div className="nutrition-summary__header">
        <div>
          <h2 id="nutrition-summary-title">Günlük Özet</h2>
          <p>{formatSummaryDate(selectedDate)}</p>
        </div>
        <div className="nutrition-summary__date-field">
          <label htmlFor="summaryDate">Gün seç</label>
          <input
            id="summaryDate"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="nutrition-summary__grid">
        {SUMMARY_ITEMS.map(({ key, label, unit }) => (
          <article key={key} className="nutrition-summary__card">
            <span className="nutrition-summary__label">{label}</span>
            <strong className="nutrition-summary__value">
              {Math.round(totals[key] * 10) / 10}
              <small>{unit}</small>
            </strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DailySummary
