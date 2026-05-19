import { getGoalLabel } from '../../constants/profileGoals'

function ProfileSummary({ profile }) {
  if (!profile) return null

  const items = [
    { label: 'Ad Soyad', value: profile.fullName },
    { label: 'Yaş', value: `${profile.age} yaş` },
    { label: 'Boy', value: `${profile.height} cm` },
    { label: 'Kilo', value: `${profile.weight} kg` },
    { label: 'Hedef', value: getGoalLabel(profile.goal) },
  ]

  return (
    <section className="profile-summary ui-section-card" aria-labelledby="profile-summary-title">
      <h2 id="profile-summary-title">Kayıtlı Profil Özeti</h2>
      <div className="profile-summary__grid">
        {items.map((item) => (
          <div key={item.label} className="profile-summary__item">
            <span className="profile-summary__label">{item.label}</span>
            <span className="profile-summary__value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProfileSummary
