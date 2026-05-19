import DashboardCard from './DashboardCard'

function ProfileSummaryCard({ profile }) {
  return (
    <DashboardCard title="Profil Özeti">
      {profile ? (
        <dl className="dashboard-stat-list">
          <div>
            <dt>Ad Soyad</dt>
            <dd>{profile.fullName}</dd>
          </div>
          <div>
            <dt>Hedef</dt>
            <dd>{profile.goal}</dd>
          </div>
        </dl>
      ) : (
        <p className="dashboard-empty">Profil bilgisi eklenmedi. Profil sayfasından kayıt oluşturun.</p>
      )}
    </DashboardCard>
  )
}

export default ProfileSummaryCard
