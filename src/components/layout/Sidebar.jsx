import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'

function Sidebar({ isOpen, isHidden, showBackdrop, onClose }) {
  return (
    <>
      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-hidden={isHidden || undefined}
        aria-label="Ana menü"
      >
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            F
          </span>
          <div>
            <strong>FitTrack</strong>
            <span>Fitness Paneli</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-dot" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <button
        type="button"
        className={`sidebar-backdrop ${showBackdrop ? 'sidebar-backdrop--visible' : ''}`}
        aria-label="Menüyü kapat"
        onClick={onClose}
        tabIndex={showBackdrop ? 0 : -1}
      />
    </>
  )
}

export default Sidebar
