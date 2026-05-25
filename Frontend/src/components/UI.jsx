// src/components/UI.jsx

import { useState } from 'react'

/* Spinner */
export function Spinner({ size = 20 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        border: '2px solid rgba(255,255,255,0.12)',
        borderTop: '2px solid var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}

/* Button */
export function Button({
  children,
  variant = 'primary',
  loading,
  style,
  ...props
}) {
  const variants = {
    primary: {
      background:
        'linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 10px 30px rgba(124,108,255,0.28)',
    },

    secondary: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },

    ghost: {
      background: 'transparent',
      color: 'var(--text2)',
      border: '1px solid var(--border)',
    },

    danger: {
      background:
        'linear-gradient(135deg, rgba(251,113,133,0.16), rgba(251,113,133,0.08))',
      color: '#ffb3c2',
      border: '1px solid rgba(251,113,133,0.24)',
    },
  }

  return (
    <button
      disabled={loading}
      style={{
        padding: '12px 18px',
        borderRadius: 16,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 700,
        fontSize: '0.92rem',
        transition: 'all 0.22s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backdropFilter: 'blur(12px)',
        opacity: loading ? 0.7 : 1,
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0px)'
      }}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  )
}

/* Input */
export function Input({ label, error, style, ...props }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text3)',
            fontWeight: 700,
          }}
        >
          {label}
        </label>
      )}

      <input
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 16,
          padding: '14px 16px',
          color: 'var(--text)',
          outline: 'none',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(12px)',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(124,108,255,0.55)'
          e.target.style.boxShadow =
            '0 0 0 4px rgba(124,108,255,0.12)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error
            ? 'var(--red)'
            : 'var(--border)'

          e.target.style.boxShadow = 'none'
        }}
        {...props}
      />

      {error && (
        <span
          style={{
            color: 'var(--red)',
            fontSize: '0.82rem',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}

/* Textarea */
export function Textarea({ label, error, style, ...props }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text3)',
            fontWeight: 700,
          }}
        >
          {label}
        </label>
      )}

      <textarea
        rows={5}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 18,
          padding: '14px 16px',
          color: 'var(--text)',
          outline: 'none',
          fontSize: '0.95rem',
          resize: 'vertical',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(12px)',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(124,108,255,0.55)'
          e.target.style.boxShadow =
            '0 0 0 4px rgba(124,108,255,0.12)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error
            ? 'var(--red)'
            : 'var(--border)'

          e.target.style.boxShadow = 'none'
        }}
        {...props}
      />

      {error && (
        <span
          style={{
            color: 'var(--red)',
            fontSize: '0.82rem',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}

/* Card */
export function Card({
  children,
  style,
  hover = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: 'var(--surface)',
        backdropFilter: 'blur(18px)',
        border: `1px solid ${
          hovered ? 'rgba(124,108,255,0.3)' : 'var(--border)'
        }`,
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        transition: 'all 0.22s ease',
        boxShadow: hovered ? 'var(--shadow-accent)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0px)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* glow blob */}
      <div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,108,255,0.12), transparent 70%)',
          top: -100,
          right: -100,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

/* Badge */
export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent: {
      bg: 'rgba(124,108,255,0.14)',
      border: 'rgba(124,108,255,0.28)',
      text: '#b6aeff',
    },

    green: {
      bg: 'rgba(74,222,128,0.12)',
      border: 'rgba(74,222,128,0.24)',
      text: '#9ff3bd',
    },

    red: {
      bg: 'rgba(251,113,133,0.12)',
      border: 'rgba(251,113,133,0.24)',
      text: '#ffb5c2',
    },

    yellow: {
      bg: 'rgba(250,204,21,0.12)',
      border: 'rgba(250,204,21,0.24)',
      text: '#ffe680',
    },
  }

  const c = colors[color]

  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/* Empty State */
export function EmptyState({
  icon = '✦',
  title,
  subtitle,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: 18,
          animation: 'floaty 4s ease infinite',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          marginBottom: 10,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: 'var(--text2)',
          maxWidth: 420,
          margin: '0 auto',
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}

/* Modal */
export function Modal({
  open,
  onClose,
  title,
  children,
}) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'rgba(16,16,24,0.96)',
          border: '1px solid var(--border)',
          borderRadius: 28,
          padding: 28,
          boxShadow: 'var(--shadow-accent)',
          animation: 'scaleIn 0.25s ease',
        }}
      >
        {title && (
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              marginBottom: 20,
            }}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  )
}