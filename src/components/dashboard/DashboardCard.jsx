function DashboardCard({ title, children, className = '' }) {
  return (
    <article className={`dashboard-card ${className}`.trim()}>
      <h2 className="dashboard-card__title">{title}</h2>
      <div className="dashboard-card__body">{children}</div>
    </article>
  )
}

export default DashboardCard
