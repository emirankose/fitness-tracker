import { useCallback, useEffect, useState } from 'react'
import ProfileForm from '../components/profile/ProfileForm'
import ProfileSummary from '../components/profile/ProfileSummary'
import { loadProfile, saveProfile } from '../utils/profileStorage'
import { normalizeProfile, validateProfile } from '../utils/validateProfile'
import './Profile.css'

const EMPTY_FORM = {
  fullName: '',
  age: '',
  height: '',
  weight: '',
  goal: '',
}

function profileToForm(profile) {
  if (!profile) return { ...EMPTY_FORM }
  return {
    fullName: profile.fullName ?? '',
    age: String(profile.age ?? ''),
    height: String(profile.height ?? ''),
    weight: String(profile.weight ?? ''),
    goal: profile.goal ?? '',
  }
}

function Profile() {
  const [form, setForm] = useState(() => profileToForm(loadProfile()))
  const [errors, setErrors] = useState({})
  const [savedProfile, setSavedProfile] = useState(() => loadProfile())
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateProfile(form)
    setErrors(validationErrors)

    if (!isValid) return

    const normalized = normalizeProfile(form)
    const wasUpdate = Boolean(savedProfile)
    const ok = saveProfile(normalized)

    if (!ok) {
      setSuccessMessage('')
      setErrors({
        fullName: 'Profil kaydedilemedi. Tarayıcı depolamasını kontrol edin.',
      })
      return
    }

    const stored = loadProfile()
    setSavedProfile(stored)
    setSuccessMessage(
      wasUpdate ? 'Profil başarıyla güncellendi.' : 'Profil başarıyla kaydedildi.',
    )
  }

  const isUpdate = Boolean(savedProfile)

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <span className="page-eyebrow">👤 Kişisel bilgiler</span>
        <h1>Profil</h1>
        <p>Boy, kilo ve fitness hedefinizi kaydederek takibinizi kişiselleştirin.</p>
      </header>

      {successMessage && (
        <div className="profile-alert" role="status">
          {successMessage}
        </div>
      )}

      <section className="profile-form-card ui-section-card" aria-labelledby="profile-form-title">
        <h2 id="profile-form-title">
          {isUpdate ? 'Profili Düzenle' : 'Profil Oluştur'}
        </h2>
        <ProfileForm
          form={form}
          errors={errors}
          isUpdate={isUpdate}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>

      <ProfileSummary profile={savedProfile} />
    </div>
  )
}

export default Profile
