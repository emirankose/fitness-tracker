import FormField from '../forms/FormField'

function ProgressForm({ form, errors, onChange, onSubmit }) {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value)
  }

  return (
    <form className="progress-form" onSubmit={onSubmit} noValidate>
      <div className="progress-form__grid">
        <FormField
          id="date"
          label="Tarih"
          type="date"
          value={form.date}
          onChange={handleChange('date')}
          error={errors.date}
        />
        <FormField
          id="weight"
          label="Kilo (kg)"
          type="number"
          min={0.1}
          step={0.1}
          value={form.weight}
          onChange={handleChange('weight')}
          error={errors.weight}
          placeholder="Örn. 72.5"
        />
      </div>

      <button type="submit" className="progress-form__submit">
        Kilo Kaydı Ekle
      </button>
    </form>
  )
}

export default ProgressForm
