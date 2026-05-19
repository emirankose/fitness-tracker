import DashboardCard from './DashboardCard'

function ProfileSummaryCard({ profile }) {
  return (
    <DashboardCard title="Profil Özeti" icon="👤" accent="purple">
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
        <div className="ui-empty dashboard-empty">
          <span className="ui-empty__icon" aria-hidden="true">
            👤
          </span>
          <p className="ui-empty__text">Profil henüz oluşturulmadı</p>
          <p className="ui-empty__hint">Profil sayfasından bilgilerinizi kaydedin.</p>
        </div>
      )}
    </DashboardCard>
  )
}

export default ProfileSummaryCard
