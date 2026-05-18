import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LastWorkoutCard from '../components/dashboard/LastWorkoutCard'
import NutritionTotalsCard from '../components/dashboard/NutritionTotalsCard'
import ProfileSummaryCard from '../components/dashboard/ProfileSummaryCard'
import ProgressSummaryCard from '../components/dashboard/ProgressSummaryCard'
import { FITTRACK_DATA_UPDATED } from '../utils/storage'
import { getDashboardData, todayISO } from '../utils/dashboardData'
import './Dashboard.css'

function Dashboard() {
  const location = useLocation()
  const [selectedDate, setSelectedDate] = useState(todayISO)
  const [dataTick, setDataTick] = useState(0)

  const data = useMemo(
    () => getDashboardData(selectedDate),
    // dataTick: localStorage güncellemeleri; pathname: sayfa geçişleri
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDate, dataTick, location.pathname],
  )

  useEffect(() => {
    const bump = () => setDataTick((n) => n + 1)
    const onVisible = () => {
      if (document.visibilityState === 'visible') bump()
    }

    window.addEventListener(FITTRACK_DATA_UPDATED, bump)
    window.addEventListener('focus', bump)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener(FITTRACK_DATA_UPDATED, bump)
      window.removeEventListener('focus', bump)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <h1>Dashboard</h1>
        <p>Genel fitness özetinizi buradan takip edin.</p>
      </header>

      <div className="dashboard-grid">
        <ProfileSummaryCard profile={data.profile} />
        <LastWorkoutCard workout={data.lastWorkout} />
        <NutritionTotalsCard
          nutrition={data.nutrition}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <ProgressSummaryCard record={data.latestProgress} />
      </div>
    </div>
  )
}

export default Dashboard
