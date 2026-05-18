import FormField from '../forms/FormField'

function WorkoutForm({ form, errors, onChange, onSubmit }) {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value)
  }

  return (
    <form className="workout-form" onSubmit={onSubmit} noValidate>
      <div className="workout-form__grid">
        <FormField
          id="exerciseName"
          label="Egzersiz adı"
          value={form.exerciseName}
          onChange={handleChange('exerciseName')}
          error={errors.exerciseName}
          placeholder="Örn. Bench Press"
        />
        <FormField
          id="sets"
          label="Set sayısı"
          type="number"
          min={0}
          step={1}
          value={form.sets}
          onChange={handleChange('sets')}
          error={errors.sets}
          placeholder="Örn. 4"
        />
        <FormField
          id="reps"
          label="Tekrar sayısı"
          type="number"
          min={0}
          step={1}
          value={form.reps}
          onChange={handleChange('reps')}
          error={errors.reps}
          placeholder="Örn. 10"
        />
        <FormField
          id="duration"
          label="Süre (dk)"
          type="number"
          min={0}
          step={1}
          value={form.duration}
          onChange={handleChange('duration')}
          error={errors.duration}
          placeholder="Örn. 45"
        />
        <FormField
          id="date"
          label="Tarih"
          type="date"
          value={form.date}
          onChange={handleChange('date')}
          error={errors.date}
        />
      </div>

      <button type="submit" className="workout-form__submit">
        Antrenman Ekle
      </button>
    </form>
  )
}

export default WorkoutForm
