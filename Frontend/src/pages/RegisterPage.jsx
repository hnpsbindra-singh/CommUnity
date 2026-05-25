// src/pages/RegisterPage.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, sendOtp, verifyOtp } from '../api'
import { Button, Input } from '../components/UI'

const STEPS = ['register', 'verify']

export default function RegisterPage() {
  const [step, setStep] = useState(0)

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    mobile: '',
  })

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await register(form)

      setOtpLoading(true)

      await sendOtp(form.username)

      setOtpLoading(false)

      setStep(1)

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed'
      )

    } finally {

      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await verifyOtp(form.username, otp)

      navigate('/login')

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid OTP'
      )

    } finally {

      setLoading(false)
    }
  }

  const resendOtp = async () => {
    setError('')
    setOtpLoading(true)

    try {

      await sendOtp(form.username)

    } catch {

      setError('Failed to resend OTP')

    } finally {

      setOtpLoading(false)
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
      {/* background blobs */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,108,255,0.18), transparent 70%)',
          top: '-320px',
          left: '-180px',
          filter: 'blur(30px)',
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
          right: '-100px',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* doodles */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          right: 120,
          fontSize: '2.4rem',
          opacity: 0.1,
          animation: 'floaty 6s ease infinite',
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 100,
          fontSize: '2rem',
          opacity: 0.12,
          animation: 'floaty 5s ease infinite',
        }}
      >
        ◈
      </div>

      {/* Main container */}
      <div
        style={{
          width: '100%',
          maxWidth: 500,
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
              width: 78,
              height: 78,
              borderRadius: 28,
              margin: '0 auto 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)',
              boxShadow:
                '0 14px 40px rgba(124,108,255,0.38)',
              fontSize: '1.8rem',
            }}
          >
            ✦
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              marginBottom: 10,
            }}
          >
            {step === 0
              ? 'Join CommUnity'
              : 'Verify your vibe'}
          </h1>

          <p
            style={{
              color: 'var(--text2)',
              fontSize: '0.95rem',
              maxWidth: 360,
              margin: '0 auto',
            }}
          >
            {step === 0
              ? 'Create your digital corner of the universe 🌌'
              : `We sent a verification code to ${form.username}`}
          </p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 30,
          }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 70 : 34,
                height: 6,
                borderRadius: 999,
                transition: 'all 0.3s ease',
                background:
                  i <= step
                    ? 'linear-gradient(90deg, var(--accent), var(--accent3))'
                    : 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </div>

        {/* Card */}
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
              width: 240,
              height: 240,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(124,108,255,0.15), transparent 70%)',
              top: -120,
              right: -120,
              pointerEvents: 'none',
            }}
          />

          {/* REGISTER */}
          {step === 0 ? (
            <form
              onSubmit={handleRegister}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                position: 'relative',
              }}
            >
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="jane@example.com"
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

              <Input
                label="Mobile"
                type="tel"
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={e =>
                  setForm({
                    ...form,
                    mobile: e.target.value,
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
                loading={loading || otpLoading}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  fontSize: '0.96rem',
                  marginTop: 6,
                }}
              >
                Create Account
              </Button>
            </form>
          ) : (
            /* VERIFY */
            <form
              onSubmit={handleVerify}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
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
                maxLength={6}
                required
                style={{
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  letterSpacing: '0.3em',
                  fontWeight: 700,
                }}
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
                Verify OTP
              </Button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={otpLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent2)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                }}
              >
                {otpLoading
                  ? 'Sending...'
                  : 'Resend code'}
              </button>
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
            Already have an account?{' '}

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