import FormField from '../forms/FormField'
import FormSelect from '../forms/FormSelect'
import { MEAL_TYPES } from '../../constants/mealTypes'

function NutritionForm({ form, errors, onChange, onSubmit, isEditing, onCancel }) {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value)
  }

  return (
    <form className="nutrition-form" onSubmit={onSubmit} noValidate>
      <div className="nutrition-form__grid">
        <FormSelect
          id="mealType"
          label="Öğün adı"
          value={form.mealType}
          onChange={handleChange('mealType')}
          error={errors.mealType}
          options={MEAL_TYPES}
          placeholder="Öğün seçin"
        />
        <FormField
          id="calories"
          label="Kalori"
          type="number"
          min={0}
          step={1}
          value={form.calories}
          onChange={handleChange('calories')}
          error={errors.calories}
          placeholder="Örn. 450"
        />
        <FormField
          id="protein"
          label="Protein (g)"
          type="number"
          min={0}
          step={0.1}
          value={form.protein}
          onChange={handleChange('protein')}
          error={errors.protein}
          placeholder="Örn. 30"
        />
        <FormField
          id="carbs"
          label="Karbonhidrat (g)"
          type="number"
          min={0}
          step={0.1}
          value={form.carbs}
          onChange={handleChange('carbs')}
          error={errors.carbs}
          placeholder="Örn. 50"
        />
        <FormField
          id="fat"
          label="Yağ (g)"
          type="number"
          min={0}
          step={0.1}
          value={form.fat}
          onChange={handleChange('fat')}
          error={errors.fat}
          placeholder="Örn. 15"
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

      <div className="nutrition-form__actions">
        <button type="submit" className="nutrition-form__submit">
          {isEditing ? 'Güncelle' : 'Öğün Ekle'}
        </button>
        {isEditing && onCancel && (
          <button type="button" className="nutrition-form__cancel" onClick={onCancel}>
            İptal
          </button>
        )}
      </div>
    </form>
  )
}

export default NutritionForm
