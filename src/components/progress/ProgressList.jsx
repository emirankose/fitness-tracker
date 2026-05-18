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
      <p className="progress-list__empty">Henüz progress kaydı eklenmedi</p>
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
