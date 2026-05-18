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

function LatestWeightSummary({ record }) {
  if (!record) {
    return (
      <section className="progress-latest progress-latest--empty">
        <span className="progress-latest__label">Son Kilo</span>
        <p>Henüz kayıt yok</p>
      </section>
    )
  }

  return (
    <section className="progress-latest" aria-labelledby="progress-latest-title">
      <span id="progress-latest-title" className="progress-latest__label">
        Son Kilo
      </span>
      <strong className="progress-latest__value">
        {record.weight}
        <small>kg</small>
      </strong>
      <time className="progress-latest__date" dateTime={record.date}>
        {formatDate(record.date)}
      </time>
    </section>
  )
}

export default LatestWeightSummary
