import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useScrollReveal } from '../animation/useScrollReveal'

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useScrollReveal(location.pathname)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="K-Typingホーム">
            <span className="brand-mark">한</span>
            <span>
              <strong>K-Typing</strong>
            </span>
          </Link>

          <button
            type="button"
            className={`menu-trigger ${isMenuOpen ? 'open' : ''}`}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isMenuOpen}
            aria-controls="app-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <aside
            id="app-menu"
            className="menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="メニュー"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="menu-drawer-head">
              <span>Menu</span>
              <button
                type="button"
                className="menu-close"
                aria-label="メニューを閉じる"
                onClick={() => setIsMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="menu-nav" aria-label="メニュー">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <span>01</span>
                <strong>Home</strong>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <span>02</span>
                <strong>Sign up</strong>
              </Link>
              <Link to="/lessons/lesson-1/typing" onClick={() => setIsMenuOpen(false)}>
                <span>03</span>
                <strong>Typing</strong>
              </Link>
              <Link to="/sessions/mock-session/result" onClick={() => setIsMenuOpen(false)}>
                <span>04</span>
                <strong>Result</strong>
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}

      <main className="main-panel">{children}</main>
    </div>
  )
}
