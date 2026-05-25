// src/pages/ForgotPasswordPage.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendResetOtp, resetPassword } from '../api'
import { Button, Input } from '../components/UI'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0)

  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      await sendResetOtp(username)

      setStep(1)

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to send OTP'
      )

    } finally {

      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      await resetPassword({
        username,
        otp,
        newPassword,
      })

      navigate('/login')

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Reset failed'
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
      {/* blobs */}
      <div
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,108,255,0.18), transparent 70%)',
          top: '-260px',
          right: '-140px',
          filter: 'blur(25px)',
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
            'radial-gradient(circle, rgba(94,234,212,0.1), transparent 70%)',
          bottom: '-140px',
          left: '-120px',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* doodles */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 120,
          fontSize: '2rem',
          opacity: 0.1,
          animation: 'floaty 5s ease infinite',
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 120,
          right: 130,
          fontSize: '2.3rem',
          opacity: 0.12,
          animation: 'floaty 6s ease infinite',
        }}
      >
        ◎
      </div>

      {/* main */}
      <div
        style={{
          width: '100%',
          maxWidth: 470,
          position: 'relative',
          zIndex: 2,
          animation: 'fadeIn 0.5s ease',
        }}
      >
        {/* header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 34,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 28,
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
            🔐
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '2.2rem',
              letterSpacing: '-0.05em',
              marginBottom: 10,
            }}
          >
            {step === 0
              ? 'Forgot password?'
              : 'Create new password'}
          </h1>

          <p
            style={{
              color: 'var(--text2)',
              fontSize: '0.94rem',
              maxWidth: 340,
              margin: '0 auto',
            }}
          >
            {step === 0
              ? 'No stress. We’ll help you get back into your digital cave 🪐'
              : `Verification code sent to ${username}`}
          </p>
        </div>

        {/* card */}
        <div
          style={{
            background: 'var(--surface)',
            backdropFilter: 'blur(22px)',
            border: '1px solid var(--border)',
            borderRadius: 34,
            padding: 34,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* glow */}
          <div
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(124,108,255,0.14), transparent 70%)',
              top: -100,
              right: -100,
              pointerEvents: 'none',
            }}
          />

          {/* STEP 1 */}
          {step === 0 ? (
            <form
              onSubmit={handleSendOtp}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
              }}
            >
              <Input
                label="Email / Username"
                type="email"
                placeholder="you@example.com"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                }}
              >
                Send Reset Code
              </Button>
            </form>
          ) : (
            /* STEP 2 */
            <form
              onSubmit={handleReset}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
              }}
            >
              <Input
                label="OTP Code"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={e =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                required
                maxLength={6}
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.3em',
                  fontWeight: 700,
                }}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e =>
                  setNewPassword(e.target.value)
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
                }}
              >
                Reset Password
              </Button>
            </form>
          )}

          {/* footer */}
          <div
            style={{
              marginTop: 28,
              textAlign: 'center',
              color: 'var(--text3)',
              fontSize: '0.9rem',
            }}
          >
            Remember your password?{' '}

            <Link
              to="/login"
              style={{
                color: 'var(--accent2)',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}