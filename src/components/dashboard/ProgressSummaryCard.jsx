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
    <DashboardCard title="Gelişim">
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
        <p className="dashboard-empty">Henüz kilo kaydı yok. Gelişim sayfasından ekleyin.</p>
      )}
    </DashboardCard>
  )
}

export default ProgressSummaryCard
