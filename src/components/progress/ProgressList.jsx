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

function ProgressList({ records }) {
  if (records.length === 0) {
    return (
      <div className="ui-empty progress-list__empty">
        <span className="ui-empty__icon" aria-hidden="true">
          📈
        </span>
        <p className="ui-empty__text">Henüz kilo kaydı eklenmedi</p>
        <p className="ui-empty__hint">Haftalık kilonuzu formdan ekleyerek grafiği oluşturun.</p>
      </div>
    )
  }

  return (
    <ul className="progress-list">
      {records.map((record) => (
        <li key={record.id} className="progress-card">
          <div>
            <span className="progress-card__label">Tarih</span>
            <time dateTime={record.date}>{formatDate(record.date)}</time>
          </div>
          <div>
            <span className="progress-card__label">Kilo</span>
            <strong>{record.weight} kg</strong>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProgressList
