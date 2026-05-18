import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const DESKTOP_QUERY = '(min-width: 1024px)'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches,
  )
  const location = useLocation()

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Route değişince mobil menüyü kapat (geri tuşu dahil)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route sync
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isDesktop || sidebarOpen}
        isHidden={!isDesktop && !sidebarOpen}
        showBackdrop={!isDesktop && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">
          <div className="page-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
