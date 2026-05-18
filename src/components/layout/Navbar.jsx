import { useLocation } from 'react-router-dom'
import { navItems } from './navItems'

function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const currentPage =
    navItems.find((item) =>
      item.end ? pathname === item.to : pathname.startsWith(item.to),
    )?.label ?? 'Dashboard'

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Menüyü aç"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="navbar__title">
          <h1>{currentPage}</h1>
          <p>Fitness takip paneli</p>
        </div>
      </div>

      <div className="navbar__actions">
        <span className="navbar__badge">Aktif</span>
        <div className="navbar__avatar" aria-hidden="true">
          FT
        </div>
      </div>
    </header>
  )
}

export default Navbar
