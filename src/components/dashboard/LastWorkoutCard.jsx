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

function LastWorkoutCard({ workout }) {
  return (
    <DashboardCard title="Son Antrenman" icon="🏋️" accent="green">
      {workout ? (
        <dl className="dashboard-stat-list">
          <div>
            <dt>Tarih</dt>
            <dd>
              <time dateTime={workout.date}>{formatDate(workout.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Egzersiz</dt>
            <dd>{workout.exerciseName}</dd>
          </div>
        </dl>
      ) : (
        <div className="ui-empty dashboard-empty">
          <span className="ui-empty__icon" aria-hidden="true">
            🏋️
          </span>
          <p className="ui-empty__text">Henüz antrenman yok</p>
          <p className="ui-empty__hint">Antrenmanlar sayfasından ilk kaydınızı ekleyin.</p>
        </div>
      )}
    </DashboardCard>
  )
}

export default LastWorkoutCard
