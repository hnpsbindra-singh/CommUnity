// src/pages/LoginPage.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, Input } from '../components/UI'

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const res = await login(form)

      localStorage.setItem('token', res.data)

      const { getProfile } = await import('../api')

      const profileRes = await getProfile()

      setUser(profileRes.data)

      navigate('/dashboard')

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid credentials'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,108,255,0.18), transparent 70%)',
          top: '-250px',
          right: '-150px',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(94,234,212,0.12), transparent 70%)',
          bottom: '-180px',
          left: '-120px',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* floating doodles */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 120,
          fontSize: '2rem',
          opacity: 0.15,
          animation: 'floaty 5s ease infinite',
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 120,
          right: 140,
          fontSize: '2.4rem',
          opacity: 0.12,
          animation: 'floaty 6s ease infinite',
        }}
      >
        ◎
      </div>

      {/* Main card */}
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          position: 'relative',
          zIndex: 2,
          animation: 'fadeIn 0.5s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 34,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              margin: '0 auto 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)',
              boxShadow:
                '0 14px 40px rgba(124,108,255,0.38)',
              fontSize: '1.7rem',
            }}
          >
            ✦
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.3rem',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              marginBottom: 10,
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: 'var(--text2)',
              fontSize: '0.95rem',
              maxWidth: 320,
              margin: '0 auto',
            }}
          >
            Continue your conversations, communities,
            ideas and chaos 🌌
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: 'var(--surface)',
            backdropFilter: 'blur(22px)',
            border: '1px solid var(--border)',
            borderRadius: 30,
            padding: 34,
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* top glow */}
          <div
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(124,108,255,0.16), transparent 70%)',
              top: -100,
              right: -100,
              pointerEvents: 'none',
            }}
          />

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative',
            }}
          >
            <Input
              label="Email / Username"
              type="text"
              placeholder="you@example.com"
              value={form.username}
              onChange={e =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />

            {error && (
              <div
                style={{
                  background:
                    'rgba(251,113,133,0.1)',
                  border:
                    '1px solid rgba(251,113,133,0.2)',
                  color: '#ffb8c4',
                  borderRadius: 16,
                  padding: '13px 15px',
                  fontSize: '0.88rem',
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: '0.96rem',
                marginTop: 6,
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                textDecoration: 'none',
                color: 'var(--accent2)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Forgot password?
            </Link>

            <p
              style={{
                color: 'var(--text3)',
                fontSize: '0.88rem',
              }}
            >
              Don’t have an account?{' '}

              <Link
                to="/register"
                style={{
                  color: 'var(--accent2)',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}