import DashboardCard from './DashboardCard'

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

function ProgressSummaryCard({ record }) {
  return (
    <DashboardCard title="Gelişim" icon="📈" accent="teal">
      {record ? (
        <dl className="dashboard-stat-list">
          <div>
            <dt>Son kilo</dt>
            <dd className="dashboard-highlight">
              {record.weight}
              <small>kg</small>
            </dd>
          </div>
          <div>
            <dt>Tarih</dt>
            <dd>
              <time dateTime={record.date}>{formatDate(record.date)}</time>
            </dd>
          </div>
        </dl>
      ) : (
        <div className="ui-empty dashboard-empty">
          <span className="ui-empty__icon" aria-hidden="true">
            📈
          </span>
          <p className="ui-empty__text">Henüz kilo kaydı yok</p>
          <p className="ui-empty__hint">Gelişim sayfasından haftalık ölçüm ekleyin.</p>
        </div>
      )}
    </DashboardCard>
  )
}

export default ProgressSummaryCard
