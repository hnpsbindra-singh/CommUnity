import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCommunities, createCommunity, joinCommunity } from '../api'
import { Button, Input, Modal, Card, EmptyState, Spinner } from '../components/UI'

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    try {
      const res = await getAllCommunities()
      setCommunities(res.data)
      setFiltered(res.data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(communities.filter(c => c.name.toLowerCase().includes(q) || c.adminName.toLowerCase().includes(q)))
  }, [search, communities])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!newName.trim()) return
    setActionLoading(true)
    try {
      await createCommunity(newName.trim())
      showToast(`Community "${newName}" created!`)
      setCreateOpen(false)
      setNewName('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to create community')
    } finally { setActionLoading(false) }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    if (!joinCode.trim()) return
    setActionLoading(true)
    try {
      await joinCommunity(joinCode.trim())
      showToast('Joined community!')
      setJoinOpen(false)
      setJoinCode('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid join code')
    } finally { setActionLoading(false) }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Discover Communities
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Find and join communities that matter to you</p>
      </div>

      {/* Actions bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <input
          placeholder="Search communities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text)', fontFamily: 'var(--font-body)',
            fontSize: '0.9rem', padding: '10px 14px', outline: 'none'
          }}
        />
        <Button variant="ghost" onClick={() => { setError(''); setJoinOpen(true) }}>Join with Code</Button>
        <Button onClick={() => { setError(''); setCreateOpen(true) }}>+ Create Community</Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="◉" title="No communities found" subtitle={search ? 'Try a different search' : 'Be the first to create one!'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((c, i) => (
            <Link key={c.id} to={`/communities/${c.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                transition: 'all 0.25s ease', cursor: 'pointer',
                animation: `fadeIn 0.4s ease ${i * 0.04}s both`
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Cover */}
                <div style={{
                  height: 80,
                  background: `linear-gradient(135deg, hsl(${c.name.charCodeAt(0) * 7 % 360}, 50%, 18%) 0%, hsl(${(c.name.charCodeAt(0) * 7 + 40) % 360}, 50%, 12%) 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem',
                    color: `hsl(${c.name.charCodeAt(0) * 7 % 360}, 70%, 70%)`
                  }}>{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>Admin · {c.adminName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Community">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input label="Community Name" placeholder="e.g. Sunrise Towers Block A"
            value={newName} onChange={e => setNewName(e.target.value)} required />
          {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Join Modal */}
      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join Community">
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input label="Join Code" placeholder="e.g. ABC123"
            value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
            style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem', fontWeight: 700 }}
            required />
          {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => setJoinOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Join</Button>
          </div>
        </form>
      </Modal>

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
