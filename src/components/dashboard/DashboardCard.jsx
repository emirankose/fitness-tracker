function DashboardCard({ title, children, className = '', icon, accent = 'green' }) {
  const accentClass = accent ? `dashboard-card--${accent}` : ''

  return (
    <article className={`dashboard-card ${accentClass} ${className}`.trim()}>
      <h2 className="dashboard-card__title">
        {icon && (
          <span className="dashboard-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {title}
      </h2>
      <div className="dashboard-card__body">{children}</div>
    </article>
  )
}

export default DashboardCard
