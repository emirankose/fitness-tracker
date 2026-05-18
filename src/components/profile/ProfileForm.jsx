import FormField from '../forms/FormField'
import FormSelect from '../forms/FormSelect'
import { PROFILE_GOALS } from '../../constants/profileGoals'

function ProfileForm({ form, errors, isUpdate, onChange, onSubmit }) {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value)
  }

  return (
    <form className="profile-form" onSubmit={onSubmit} noValidate>
      <div className="profile-form__grid">
        <FormField
          id="fullName"
          label="Ad Soyad"
          value={form.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          placeholder="Örn. Ali Yılmaz"
        />
        <FormField
          id="age"
          label="Yaş"
          type="number"
          min={1}
          step={1}
          value={form.age}
          onChange={handleChange('age')}
          error={errors.age}
          placeholder="Örn. 28"
        />
        <FormField
          id="height"
          label="Boy (cm)"
          type="number"
          min={1}
          step={1}
          value={form.height}
          onChange={handleChange('height')}
          error={errors.height}
          placeholder="Örn. 175"
        />
        <FormField
          id="weight"
          label="Kilo (kg)"
          type="number"
          min={1}
          step={0.1}
          value={form.weight}
          onChange={handleChange('weight')}
          error={errors.weight}
          placeholder="Örn. 72"
        />
        <FormSelect
          id="goal"
          label="Hedef"
          value={form.goal}
          onChange={handleChange('goal')}
          error={errors.goal}
          options={PROFILE_GOALS}
          placeholder="Hedef seçin"
        />
      </div>

      <button type="submit" className="profile-form__submit">
        {isUpdate ? 'Profili Güncelle' : 'Kaydet'}
      </button>
    </form>
  )
}

export default ProfileForm
