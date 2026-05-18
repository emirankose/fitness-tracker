import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../utils/storage'
import './Admin.css'

const SESSION_KEY = 'fittrack_admin_session'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']
const PROFILE_GOALS = ['lose_weight', 'gain_muscle', 'maintain']
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isAdminAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}

function setAdminAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, 'true')
}

function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonNegativeNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && value >= 0
}

function isPositiveNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0
}

function isValidDateString(value) {
  return typeof value === 'string' && DATE_PATTERN.test(value)
}

function validateProfile(profile) {
  if (profile === null) return null
  if (!isObject(profile)) return 'profile alanı null veya geçerli bir nesne olmalıdır'
  if (typeof profile.fullName !== 'string' || !profile.fullName.trim()) {
    return 'profile.fullName geçerli bir metin olmalıdır'
  }
  if (!isPositiveNumber(profile.age)) return 'profile.age pozitif bir sayı olmalıdır'
  if (!isPositiveNumber(profile.height)) return 'profile.height pozitif bir sayı olmalıdır'
  if (!isPositiveNumber(profile.weight)) return 'profile.weight pozitif bir sayı olmalıdır'
  if (typeof profile.goal !== 'string' || !PROFILE_GOALS.includes(profile.goal)) {
    return 'profile.goal geçerli bir hedef değeri olmalıdır'
  }
  return null
}

function validateWorkout(item, index) {
  if (!isObject(item)) return `workouts[${index}] geçerli bir nesne olmalıdır`
  if (typeof item.id !== 'string' || !item.id) return `workouts[${index}].id zorunludur`
  if (typeof item.exerciseName !== 'string' || !item.exerciseName.trim()) {
    return `workouts[${index}].exerciseName geçerli bir metin olmalıdır`
  }
  if (!isNonNegativeNumber(item.sets)) return `workouts[${index}].sets negatif olmayan bir sayı olmalıdır`
  if (!isNonNegativeNumber(item.reps)) return `workouts[${index}].reps negatif olmayan bir sayı olmalıdır`
  if (!isNonNegativeNumber(item.duration)) {
    return `workouts[${index}].duration negatif olmayan bir sayı olmalıdır`
  }
  if (!isValidDateString(item.date)) return `workouts[${index}].date YYYY-MM-DD formatında olmalıdır`
  if (typeof item.createdAt !== 'string' || !item.createdAt) {
    return `workouts[${index}].createdAt zorunludur`
  }
  return null
}

function validateMeal(item, index) {
  if (!isObject(item)) return `nutrition[${index}] geçerli bir nesne olmalıdır`
  if (typeof item.id !== 'string' || !item.id) return `nutrition[${index}].id zorunludur`
  if (typeof item.mealType !== 'string' || !MEAL_TYPES.includes(item.mealType)) {
    return `nutrition[${index}].mealType geçerli bir öğün tipi olmalıdır`
  }
  if (!isNonNegativeNumber(item.calories)) {
    return `nutrition[${index}].calories negatif olmayan bir sayı olmalıdır`
  }
  if (!isNonNegativeNumber(item.protein)) {
    return `nutrition[${index}].protein negatif olmayan bir sayı olmalıdır`
  }
  if (!isNonNegativeNumber(item.carbs)) {
    return `nutrition[${index}].carbs negatif olmayan bir sayı olmalıdır`
  }
  if (!isNonNegativeNumber(item.fat)) {
    return `nutrition[${index}].fat negatif olmayan bir sayı olmalıdır`
  }
  if (!isValidDateString(item.date)) return `nutrition[${index}].date YYYY-MM-DD formatında olmalıdır`
  if (typeof item.createdAt !== 'string' || !item.createdAt) {
    return `nutrition[${index}].createdAt zorunludur`
  }
  return null
}

function validateProgressRecord(item, index) {
  if (!isObject(item)) return `progress[${index}] geçerli bir nesne olmalıdır`
  if (typeof item.id !== 'string' || !item.id) return `progress[${index}].id zorunludur`
  if (!isPositiveNumber(item.weight)) return `progress[${index}].weight pozitif bir sayı olmalıdır`
  if (!isValidDateString(item.date)) return `progress[${index}].date YYYY-MM-DD formatında olmalıdır`
  if (typeof item.createdAt !== 'string' || !item.createdAt) {
    return `progress[${index}].createdAt zorunludur`
  }
  return null
}

function validateFitnessExport(data) {
  if (!isObject(data)) return { ok: false, error: 'JSON kök değeri bir nesne olmalıdır.' }
  if (!('profile' in data)) return { ok: false, error: 'Eksik alan: profile' }
  if (!('workouts' in data)) return { ok: false, error: 'Eksik alan: workouts' }
  if (!('nutrition' in data)) return { ok: false, error: 'Eksik alan: nutrition' }
  if (!('progress' in data)) return { ok: false, error: 'Eksik alan: progress' }

  const profileError = validateProfile(data.profile)
  if (profileError) return { ok: false, error: profileError }
  if (!Array.isArray(data.workouts)) return { ok: false, error: 'workouts bir dizi olmalıdır' }
  if (!Array.isArray(data.nutrition)) return { ok: false, error: 'nutrition bir dizi olmalıdır' }
  if (!Array.isArray(data.progress)) return { ok: false, error: 'progress bir dizi olmalıdır' }

  for (let i = 0; i < data.workouts.length; i += 1) {
    const err = validateWorkout(data.workouts[i], i)
    if (err) return { ok: false, error: err }
  }
  for (let i = 0; i < data.nutrition.length; i += 1) {
    const err = validateMeal(data.nutrition[i], i)
    if (err) return { ok: false, error: err }
  }
  for (let i = 0; i < data.progress.length; i += 1) {
    const err = validateProgressRecord(data.progress[i], i)
    if (err) return { ok: false, error: err }
  }

  return { ok: true, data }
}

function parseFitnessExportJson(raw) {
  if (!raw?.trim()) return { ok: false, error: 'JSON metni boş olamaz.' }
  try {
    return validateFitnessExport(JSON.parse(raw))
  } catch {
    return {
      ok: false,
      error: 'Geçersiz JSON formatı. Dosyanın doğru biçimlendirildiğinden emin olun.',
    }
  }
}

function loadArray(key) {
  const data = getStorageItem(key)
  return Array.isArray(data) ? data : []
}

function buildExport() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: getStorageItem('profile'),
    workouts: loadArray('workouts'),
    nutrition: loadArray('nutrition'),
    progress: loadArray('progress'),
  }
}

function downloadExport() {
  const data = buildExport()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `fittrack-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function importFitnessData(rawJson) {
  const result = parseFitnessExportJson(rawJson)
  if (!result.ok) return result

  const { data } = result

  try {
    if (data.profile === null) {
      removeStorageItem('profile')
    } else {
      setStorageItem('profile', {
        ...data.profile,
        updatedAt: new Date().toISOString(),
      })
    }
    setStorageItem('workouts', data.workouts)
    setStorageItem('nutrition', data.nutrition)
    setStorageItem('progress', data.progress)
    return { ok: true }
  } catch {
    return { ok: false, error: "Veriler localStorage'a yazılırken bir hata oluştu." }
  }
}

function Admin() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [importText, setImportText] = useState('')
  const [panelError, setPanelError] = useState('')
  const [panelSuccess, setPanelSuccess] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')

    if (!ADMIN_PASSWORD) {
      setLoginError(
        'Admin şifresi tanımlı değil. .env dosyasında VITE_ADMIN_PASSWORD ayarlayın ve sunucuyu yeniden başlatın.',
      )
      return
    }

    if (password !== ADMIN_PASSWORD) {
      setLoginError('Geçersiz şifre. Lütfen tekrar deneyin.')
      return
    }

    setAdminAuthenticated()
    setAuthenticated(true)
    setPassword('')
  }

  const handleLogout = () => {
    clearAdminSession()
    setAuthenticated(false)
    setImportText('')
    setPanelError('')
    setPanelSuccess('')
  }

  const handleExport = () => {
    downloadExport()
    const s = buildExport()
    setPanelSuccess(
      `Dışa aktarıldı: profil ${s.profile ? 'var' : 'yok'}, ${s.workouts.length} antrenman, ${s.nutrition.length} öğün, ${s.progress.length} progress.`,
    )
    setPanelError('')
  }

  const handleImport = () => {
    const result = importFitnessData(importText)
    if (!result.ok) {
      setPanelError(result.error)
      setPanelSuccess('')
      return
    }
    setImportText('')
    setPanelError('')
    setPanelSuccess('Veriler başarıyla içe aktarıldı. Dashboard güncel veriyi kullanacaktır.')
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImportText(String(ev.target?.result ?? ''))
      setPanelError('')
    }
    reader.onerror = () => setPanelError('Dosya okunamadı.')
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Admin</h1>
        <p>Sistem ve veri yönetimi</p>
      </header>

      {!authenticated ? (
        <div className="admin-login">
          <div className="admin-login__card">
            <h2>Admin Girişi</h2>
            <p className="admin-login__hint">Yönetim paneline erişmek için şifrenizi girin.</p>

            {!ADMIN_PASSWORD && (
              <p className="admin-alert admin-alert--warning" role="alert">
                VITE_ADMIN_PASSWORD tanımlı değil. .env dosyasını oluşturup sunucuyu yeniden
                başlatın.
              </p>
            )}

            <form className="admin-login__form" onSubmit={handleLogin}>
              <div className="admin-field">
                <label htmlFor="adminPassword">Şifre</label>
                <input
                  id="adminPassword"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setLoginError('')
                  }}
                  placeholder="Admin şifresi"
                  disabled={!ADMIN_PASSWORD}
                />
              </div>

              {loginError && (
                <p className="admin-alert admin-alert--error" role="alert">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={!ADMIN_PASSWORD}
              >
                Giriş Yap
              </button>
            </form>

            <Link to="/" className="admin-link-back">
              Ana uygulamaya dön
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-panel">
          <div className="admin-panel__toolbar">
            <Link to="/" className="admin-btn admin-btn--ghost">
              Ana uygulamaya dön
            </Link>
            <button type="button" className="admin-btn admin-btn--danger" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>

          {panelSuccess && (
            <p className="admin-alert admin-alert--success" role="status">
              {panelSuccess}
            </p>
          )}
          {panelError && (
            <p className="admin-alert admin-alert--error" role="alert">
              {panelError}
            </p>
          )}

          <section className="admin-section">
            <h3>Veri Dışa Aktar</h3>
            <p>profile, workouts, nutrition ve progress verilerini JSON olarak indirin.</p>
            <button type="button" className="admin-btn admin-btn--primary" onClick={handleExport}>
              JSON İndir
            </button>
          </section>

          <section className="admin-section">
            <h3>Veri İçe Aktar</h3>
            <p>JSON yapıştırın veya dosya seçin. Mevcut verilerin üzerine yazılır.</p>

            <div className="admin-field">
              <label htmlFor="importFile">JSON dosyası</label>
              <input
                id="importFile"
                type="file"
                accept="application/json,.json"
                onChange={handleFileSelect}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="importJson">JSON içeriği</label>
              <textarea
                id="importJson"
                rows={10}
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value)
                  setPanelError('')
                }}
                placeholder='{"profile":null,"workouts":[],"nutrition":[],"progress":[]}'
                spellCheck={false}
              />
            </div>

            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              İçe Aktar
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export default Admin
