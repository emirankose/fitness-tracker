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

function WorkoutList({ workouts, onDelete }) {
  if (workouts.length === 0) {
    return (
      <p className="workout-list__empty">Henüz antrenman eklenmedi</p>
    )
  }

  return (
    <ul className="workout-list">
      {workouts.map((workout) => (
        <li key={workout.id} className="workout-card">
          <div className="workout-card__header">
            <h3>{workout.exerciseName}</h3>
            <time dateTime={workout.date}>{formatDate(workout.date)}</time>
          </div>
          <dl className="workout-card__stats">
            <div>
              <dt>Set</dt>
              <dd>{workout.sets}</dd>
            </div>
            <div>
              <dt>Tekrar</dt>
              <dd>{workout.reps}</dd>
            </div>
            <div>
              <dt>Süre</dt>
              <dd>{workout.duration} dk</dd>
            </div>
          </dl>
          <button
            type="button"
            className="workout-card__delete"
            onClick={() => onDelete(workout.id, workout.exerciseName)}
          >
            Sil
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WorkoutList
