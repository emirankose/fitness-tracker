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
    <DashboardCard title="Son Antrenman">
      {workout ? (
        <dl className="dashboard-stat-list">
          <div>
            <dt>Tarih</dt>
            <dd>
              <time dateTime={workout.date}>{formatDate(workout.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Egzersiz adı</dt>
            <dd>{workout.exerciseName}</dd>
          </div>
        </dl>
      ) : (
        <p className="dashboard-empty">Henüz antrenman kaydı yok. Workouts sayfasından ekleyin.</p>
      )}
    </DashboardCard>
  )
}

export default LastWorkoutCard
