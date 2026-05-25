import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCommunities, leaveCommunity } from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, EmptyState, Spinner, Badge } from '../components/UI'

export default function MyCommunitiesPage() {
  const { user } = useAuth()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const load = async () => {
    try {
      const res = await getMyCommunities()
      setCommunities(res.data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleLeave = async (e, communityId, communityName, adminName) => {
    e.preventDefault()
    e.stopPropagation()
    if (adminName === user?.name) { showToast('Admin cannot leave', 'error'); return }
    if (!confirm(`Leave "${communityName}"?`)) return
    try {
      await leaveCommunity(communityId)
      setCommunities(prev => prev.filter(c => c.id !== communityId))
      showToast('Left community')
    } catch (err) { showToast(err.response?.data?.message || 'Cannot leave', 'error') }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8 }}>
          My Communities
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Communities you've joined or created</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={32} /></div>
      ) : communities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <EmptyState icon="⊞" title="No communities yet" subtitle="Browse and join communities that interest you" />
          <Link to="/communities">
            <Button style={{ marginTop: 24 }}>Discover Communities</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {communities.map((c, i) => (
            <Link key={c.id} to={`/communities/${c.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                transition: 'all 0.25s ease',
                animation: `fadeIn 0.4s ease ${i * 0.05}s both`
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  height: 70,
                  background: `linear-gradient(135deg, hsl(${c.name.charCodeAt(0) * 7 % 360}, 45%, 16%) 0%, hsl(${(c.name.charCodeAt(0) * 7 + 60) % 360}, 45%, 10%) 100%)`,
                  display: 'flex', alignItems: 'center', paddingLeft: 24
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem',
                    color: `hsl(${c.name.charCodeAt(0) * 7 % 360}, 70%, 65%)`
                  }}>{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{c.name}</h3>
                        {c.adminName === user?.name && <Badge color="yellow">Admin</Badge>}
                      </div>
                      <p style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>Admin: {c.adminName}</p>
                    </div>
                  </div>
                  {c.adminName !== user?.name && (
                    <button
                      onClick={(e) => handleLeave(e, c.id, c.name, c.adminName)}
                      style={{
                        marginTop: 8, background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)',
                        borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                        color: 'var(--red)', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >Leave</button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

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
