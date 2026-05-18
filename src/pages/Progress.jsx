import { useCallback, useEffect, useMemo, useState } from 'react'
import LatestWeightSummary from '../components/progress/LatestWeightSummary'
import ProgressForm from '../components/progress/ProgressForm'
import ProgressList from '../components/progress/ProgressList'
import WeightChart from '../components/progress/WeightChart'
import {
  addProgressRecord,
  getLatestRecord,
  loadProgressRecords,
  sortRecordsByDateDesc,
  toChartData,
} from '../utils/progressStorage'
import { normalizeProgress, validateProgress } from '../utils/validateProgress'
import './Progress.css'

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  weight: '',
}

function Progress() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [records, setRecords] = useState(() =>
    sortRecordsByDateDesc(loadProgressRecords()),
  )
  const [successMessage, setSuccessMessage] = useState('')

  const refreshRecords = useCallback(() => {
    setRecords(sortRecordsByDateDesc(loadProgressRecords()))
  }, [])

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const latestRecord = useMemo(() => getLatestRecord(records), [records])
  const chartData = useMemo(() => toChartData(records), [records])

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

    const { isValid, errors: validationErrors } = validateProgress(form)
    setErrors(validationErrors)

    if (!isValid) return

    addProgressRecord(normalizeProgress(form))
    refreshRecords()
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
    setSuccessMessage('Kilo kaydı başarıyla eklendi.')
  }

  return (
    <div className="progress-page">
      <header className="progress-page__header">
        <h1>Progress</h1>
        <p>Gelişiminizi grafikler ve istatistiklerle izleyin.</p>
      </header>

      {successMessage && (
        <div className="progress-alert" role="status">
          {successMessage}
        </div>
      )}

      <LatestWeightSummary record={latestRecord} />

      <section className="progress-chart-card" aria-labelledby="progress-chart-title">
        <h2 id="progress-chart-title">Kilo Grafiği</h2>
        <WeightChart data={chartData} />
      </section>

      <section className="progress-form-card" aria-labelledby="progress-form-title">
        <h2 id="progress-form-title">Haftalık Kilo Kaydı</h2>
        <ProgressForm
          form={form}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>

      <section className="progress-list-card" aria-labelledby="progress-list-title">
        <h2 id="progress-list-title">Kayıt Geçmişi</h2>
        <ProgressList records={records} />
      </section>
    </div>
  )
}

export default Progress
