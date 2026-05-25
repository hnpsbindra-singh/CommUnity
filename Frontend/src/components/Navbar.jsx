// src/components/Navbar.jsx

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: '✦' },
    { to: '/communities', label: 'Discover', icon: '◎' },
    { to: '/my-communities', label: 'Communities', icon: '◈' },
    { to: '/profile', label: 'Profile', icon: '◌' },
  ]

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backdropFilter: 'blur(24px)',
        background: 'rgba(10,10,18,0.72)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 1250,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 18,
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 35px rgba(124,108,255,0.45)',
              fontSize: '1.2rem',
            }}
          >
            ✦
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.04em',
                color: 'var(--text)',
              }}
            >
              CommUnity
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              people • ideas • vibes
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {navLinks.map(link => {
              const active = location.pathname.startsWith(link.to)

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#fff' : 'var(--text2)',
                    background: active
                      ? 'linear-gradient(135deg, rgba(124,108,255,0.18), rgba(94,234,212,0.12))'
                      : 'transparent',
                    border: active
                      ? '1px solid rgba(124,108,255,0.35)'
                      : '1px solid transparent',
                    padding: '10px 16px',
                    borderRadius: 14,
                    transition: 'all 0.22s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.04)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}

            <div
              style={{
                width: 1,
                height: 28,
                background: 'var(--border)',
                margin: '0 6px',
              }}
            />

            {/* User */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, rgba(124,108,255,0.45), rgba(94,234,212,0.28))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}
                >
                  {user?.name}
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text3)',
                  }}
                >
                  @{user?.username?.split('@')[0]}
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(251,113,133,0.14), rgba(251,113,133,0.08))',
                  border: '1px solid rgba(251,113,133,0.25)',
                  color: '#ffb4c0',
                  borderRadius: 14,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Mobile Button */}
        {user && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={!user ? 'hide-mobile' : ''}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              width: 42,
              height: 42,
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        )}
      </div>
    </nav>
  )
}