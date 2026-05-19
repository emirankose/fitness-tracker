import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMealLabel } from '../constants/mealTypes'
import { getGoalLabel } from '../constants/profileGoals'
import { deleteProfile, loadProfile } from '../utils/profileStorage'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../utils/storage'
import { deleteMeal, loadMeals, sortMealsByDate } from '../utils/nutritionStorage'
import { deleteProgressRecord, loadProgressRecords, sortRecordsByDateDesc } from '../utils/progressStorage'
import { deleteWorkout, loadWorkouts, sortWorkoutsByDate } from '../utils/workoutStorage'
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

function formatDate(dateStr) {
  try {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function AdminStatCard({ label, value, hint }) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-card__label">{label}</span>
      <strong className="admin-stat-card__value">{value}</strong>
      {hint && <span className="admin-stat-card__hint">{hint}</span>}
    </article>
  )
}

function AdminDataDashboard({ dataVersion, onDataChange, setPanelSuccess, setPanelError }) {
  const profile = useMemo(() => loadProfile(), [dataVersion])
  const workouts = useMemo(() => sortWorkoutsByDate(loadWorkouts()), [dataVersion])
  const meals = useMemo(() => sortMealsByDate(loadMeals()), [dataVersion])
  const progressRecords = useMemo(
    () => sortRecordsByDateDesc(loadProgressRecords()),
    [dataVersion],
  )

  const confirmDelete = useCallback((message) => window.confirm(message), [])

  const handleDeleteProfile = () => {
    if (!profile) return
    if (
      !confirmDelete(
        `${profile.fullName} adlı profil kaydını silmek istediğinize emin misiniz?`,
      )
    ) {
      return
    }
    deleteProfile()
    onDataChange()
    setPanelError('')
    setPanelSuccess('Profil kaydı silindi.')
  }

  const handleDeleteWorkout = (workout) => {
    if (
      !confirmDelete(
        `"${workout.exerciseName}" antrenman kaydını silmek istediğinize emin misiniz?`,
      )
    ) {
      return
    }
    deleteWorkout(workout.id)
    onDataChange()
    setPanelError('')
    setPanelSuccess('Antrenman kaydı silindi.')
  }

  const handleDeleteMeal = (meal) => {
    if (
      !confirmDelete(
        `${getMealLabel(meal.mealType)} öğün kaydını silmek istediğinize emin misiniz?`,
      )
    ) {
      return
    }
    deleteMeal(meal.id)
    onDataChange()
    setPanelError('')
    setPanelSuccess('Öğün kaydı silindi.')
  }

  const handleDeleteProgress = (record) => {
    if (
      !confirmDelete(
        `${record.weight} kg kaydını (${formatDate(record.date)}) silmek istediğinize emin misiniz?`,
      )
    ) {
      return
    }
    deleteProgressRecord(record.id)
    onDataChange()
    setPanelError('')
    setPanelSuccess('Kilo kaydı silindi.')
  }

  return (
    <>
      <div className="admin-stats">
        <AdminStatCard
          label="Profil"
          value={profile ? '1 kayıt' : 'Kayıt yok'}
          hint={profile ? profile.fullName : 'Henüz profil oluşturulmadı'}
        />
        <AdminStatCard label="Antrenman" value={workouts.length} hint="Toplam antrenman kaydı" />
        <AdminStatCard label="Öğün" value={meals.length} hint="Toplam öğün kaydı" />
        <AdminStatCard label="Kilo" value={progressRecords.length} hint="Toplam kilo kaydı" />
      </div>

      <section className="admin-section admin-section--data">
        <div className="admin-section__head">
          <h3>Profil Kaydı</h3>
          {profile && (
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={handleDeleteProfile}
            >
              Sil
            </button>
          )}
        </div>
        {profile ? (
          <dl className="admin-profile-card">
            <div>
              <dt>Ad Soyad</dt>
              <dd>{profile.fullName}</dd>
            </div>
            <div>
              <dt>Yaş</dt>
              <dd>{profile.age}</dd>
            </div>
            <div>
              <dt>Boy</dt>
              <dd>{profile.height} cm</dd>
            </div>
            <div>
              <dt>Kilo</dt>
              <dd>{profile.weight} kg</dd>
            </div>
            <div>
              <dt>Hedef</dt>
              <dd>{getGoalLabel(profile.goal)}</dd>
            </div>
          </dl>
        ) : (
          <p className="admin-empty">Kayıtlı profil bulunmuyor.</p>
        )}
      </section>

      <section className="admin-section admin-section--data">
        <div className="admin-section__head">
          <h3>Antrenman Kayıtları</h3>
          <span className="admin-badge">{workouts.length}</span>
        </div>
        {workouts.length === 0 ? (
          <p className="admin-empty">Antrenman kaydı yok.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Egzersiz</th>
                  <th>Tarih</th>
                  <th>Set</th>
                  <th>Tekrar</th>
                  <th>Süre</th>
                  <th aria-label="İşlemler" />
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.exerciseName}</td>
                    <td>{formatDate(workout.date)}</td>
                    <td>{workout.sets}</td>
                    <td>{workout.reps}</td>
                    <td>{workout.duration} dk</td>
                    <td className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => handleDeleteWorkout(workout)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section admin-section--data">
        <div className="admin-section__head">
          <h3>Öğün Kayıtları</h3>
          <span className="admin-badge">{meals.length}</span>
        </div>
        {meals.length === 0 ? (
          <p className="admin-empty">Öğün kaydı yok.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Öğün</th>
                  <th>Tarih</th>
                  <th>Kalori</th>
                  <th>Protein</th>
                  <th>Karb.</th>
                  <th>Yağ</th>
                  <th aria-label="İşlemler" />
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal.id}>
                    <td>{getMealLabel(meal.mealType)}</td>
                    <td>{formatDate(meal.date)}</td>
                    <td>{meal.calories}</td>
                    <td>{meal.protein} g</td>
                    <td>{meal.carbs} g</td>
                    <td>{meal.fat} g</td>
                    <td className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => handleDeleteMeal(meal)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section admin-section--data">
        <div className="admin-section__head">
          <h3>Kilo / Gelişim Kayıtları</h3>
          <span className="admin-badge">{progressRecords.length}</span>
        </div>
        {progressRecords.length === 0 ? (
          <p className="admin-empty">Kilo kaydı yok.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Kilo</th>
                  <th aria-label="İşlemler" />
                </tr>
              </thead>
              <tbody>
                {progressRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.weight} kg</td>
                    <td className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => handleDeleteProgress(record)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

function Admin() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [importText, setImportText] = useState('')
  const [panelError, setPanelError] = useState('')
  const [panelSuccess, setPanelSuccess] = useState('')
  const [dataVersion, setDataVersion] = useState(0)

  const refreshData = useCallback(() => {
    setDataVersion((v) => v + 1)
  }, [])

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
      `Dışa aktarıldı: profil ${s.profile ? 'var' : 'yok'}, ${s.workouts.length} antrenman, ${s.nutrition.length} öğün, ${s.progress.length} kilo kaydı.`,
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
    refreshData()
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
        <h1>Yönetim Paneli</h1>
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

          <AdminDataDashboard
            dataVersion={dataVersion}
            onDataChange={refreshData}
            setPanelSuccess={setPanelSuccess}
            setPanelError={setPanelError}
          />

          <section className="admin-section admin-section--tools">
            <h3>Yedekleme</h3>
            <p>Tüm verileri JSON dosyası olarak indirin veya geri yükleyin.</p>

            <div className="admin-tools-row">
              <button type="button" className="admin-btn admin-btn--primary" onClick={handleExport}>
                JSON İndir
              </button>
            </div>

            <div className="admin-field admin-field--file">
              <label htmlFor="importFile">JSON dosyası seç</label>
              <input
                id="importFile"
                type="file"
                accept="application/json,.json"
                onChange={handleFileSelect}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="importJson">JSON içeriği (gelişmiş)</label>
              <textarea
                id="importJson"
                rows={6}
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value)
                  setPanelError('')
                }}
                placeholder="Yedek JSON dosyasının içeriğini buraya yapıştırın"
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
