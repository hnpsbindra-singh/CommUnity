import { useState } from 'react'
import { updateProfile } from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Card, Badge } from '../components/UI'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', mobile: user?.mobile || '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await updateProfile(form)
      await refreshUser()
      setEditing(false)
      showToast('Profile updated!')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  const handleCancel = () => {
    setForm({ name: user?.name || '', mobile: user?.mobile || '' })
    setEditing(false)
    setError('')
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Profile
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Manage your account details</p>
      </div>

      {/* Avatar Section */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 24,
        animation: 'fadeIn 0.5s ease'
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(${user?.name?.charCodeAt(0) * 13 % 360}, 55%, 30%), hsl(${(user?.name?.charCodeAt(0) * 13 + 60) % 360}, 55%, 20%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem',
          color: `hsl(${user?.name?.charCodeAt(0) * 13 % 360}, 70%, 75%)`,
          flexShrink: 0, border: '2px solid var(--border2)'
        }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 8 }}>{user?.username}</p>
          <Badge color="accent">{user?.role}</Badge>
        </div>
      </div>

      {/* Details Card */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px',
        animation: 'fadeIn 0.6s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Account Info</h3>
          {!editing && (
            <Button variant="ghost" onClick={() => setEditing(true)} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>Edit</Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Mobile" type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />

            {/* Read-only */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text2)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '11px 14px', color: 'var(--text3)', fontSize: '0.9rem' }}>{user?.username}</div>
            </div>

            {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <Button variant="ghost" type="button" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" loading={loading}>Save Changes</Button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.username },
              { label: 'Mobile', value: user?.mobile || '—' },
              { label: 'Role', value: user?.role },
              { label: 'User ID', value: user?.id },
            ].map(field => (
              <div key={field.label}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text3)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{field.label}</p>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontFamily: field.label === 'User ID' ? 'monospace' : 'var(--font-body)' }}>{field.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
          background: toast.type === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.4)' : 'rgba(74,222,128,0.4)'}`,
          color: toast.type === 'error' ? 'var(--red)' : 'var(--green)',
          borderRadius: 'var(--radius)', padding: '12px 20px',
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem',
          animation: 'fadeIn 0.3s ease', boxShadow: 'var(--shadow)'
        }}>
          {toast.type === 'error' ? '✗' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  )
}
