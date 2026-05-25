import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getCommunityDetails, getCommunityPosts, createPost,
  deletePost, feelGood, getComments, createComment,
  deleteComment, leaveCommunity, joinCommunity
} from '../api'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Textarea, Modal, Card, EmptyState, Spinner, Badge } from '../components/UI'

export default function CommunityDetailPage() {
  const { communityId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [details, setDetails] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')

  // Post modal
  const [postOpen, setPostOpen] = useState(false)
  const [postForm, setPostForm] = useState({ title: '', description: '' })
  const [postLoading, setPostLoading] = useState(false)
  const [postError, setPostError] = useState('')

  // Comments
  const [expandedPost, setExpandedPost] = useState(null)
  const [comments, setComments] = useState({})
  const [commentForm, setCommentForm] = useState({})
  const [commentLoading, setCommentLoading] = useState({})

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const load = async () => {

  try {

    const detRes =
      await getCommunityDetails(
        communityId
      )

    setDetails(detRes.data)

    try {

      const postRes =
        await getCommunityPosts(
          communityId
        )

      setPosts(postRes.data)

    } catch(err) {

     if(err.response?.status === 403) {

  const code =
    prompt(
      "Enter community join code"
    )

  if(!code) {

    navigate('/communities')

    return
  }

  try {

    await joinCommunity(code)

    window.location.reload()

  } catch(joinErr) {

    alert(
      joinErr.response?.data
    )

    navigate('/communities')
  }
}
    }

  } catch {

    navigate('/communities')
  }

  finally {

    setLoading(false)
  }
}

  useEffect(() => { load() }, [communityId])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    setPostError('')
    setPostLoading(true)
    try {
      const res = await createPost(communityId, postForm)
      setPosts(prev => [res.data, ...prev])
      setPostOpen(false)
      setPostForm({ title: '', description: '' })
      showToast('Post created!')
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to create post')
    } finally { setPostLoading(false) }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId)
      setPosts(prev => prev.filter(p => p.id !== postId))
      showToast('Post deleted')
    } catch { showToast('Failed to delete', 'error') }
  }
const handleFeelGood = async (postId) => {

  try {

    const res =
      await feelGood(postId)

    console.log("SUCCESS:", res.data)

    setPosts(prev => prev.map(p => {

      if (p.id !== postId) return p

      const alreadyLiked =
  p.feelGoodUserIds?.includes(
    user?.id
  )

      return {

        ...p,

        feelsGood: alreadyLiked
          ? p.feelsGood - 1
          : p.feelsGood + 1,

        _liked: !alreadyLiked
      }
    }))

  } catch(err) {

    console.log("ERROR:", err)

    console.log("RESPONSE:", err.response)

    console.log("DATA:", err.response?.data)

    alert(err.response?.data)
  }
}

  const loadComments = async (postId) => {
    if (expandedPost === postId) { setExpandedPost(null); return }
    setExpandedPost(postId)
    try {
      const res = await getComments(postId)
      setComments(prev => ({ ...prev, [postId]: res.data }))
    } catch {}
  }

  const handleAddComment = async (postId) => {
    const text = commentForm[postId]?.trim()
    if (!text) return
    setCommentLoading(prev => ({ ...prev, [postId]: true }))
    try {
      const res = await createComment(postId, { description: text })
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), res.data] }))
      setCommentForm(prev => ({ ...prev, [postId]: '' }))
    } catch { showToast('Failed to add comment', 'error') }
    finally { setCommentLoading(prev => ({ ...prev, [postId]: false })) }
  }

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId)
      setComments(prev => ({ ...prev, [postId]: prev[postId].filter(c => c.id !== commentId) }))
    } catch { showToast('Failed to delete comment', 'error') }
  }

  const handleLeave = async () => {
    if (!confirm('Leave this community?')) return
    try {
      await leaveCommunity(communityId)
      navigate('/my-communities')
    } catch (err) { showToast(err.response?.data?.message || 'Cannot leave', 'error') }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spinner size={40} />
    </div>
  )

  const isAdmin = details?.adminName === user?.name

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Community Header */}
      <div style={{
        background: `linear-gradient(135deg, hsl(${details?.name?.charCodeAt(0) * 7 % 360}, 40%, 14%) 0%, var(--surface) 100%)`,
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '32px 36px', marginBottom: 28, animation: 'fadeIn 0.4s ease',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
          fontSize: '5rem', opacity: 0.06, fontFamily: 'var(--font-display)', fontWeight: 800,
          pointerEvents: 'none'
        }}>{details?.name?.charAt(0)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{details?.name}</h1>
              {isAdmin && <Badge color="yellow">Admin</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Admin: <span style={{ color: 'var(--text2)' }}>{details?.adminName}</span></span>
              <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{details?.memberCount} members</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
                color: 'var(--accent2)', background: 'rgba(108,99,255,0.1)',
                border: '1px solid rgba(108,99,255,0.3)', borderRadius: 6,
                padding: '2px 8px', letterSpacing: '0.1em'
              }}>{details?.joinCode}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => { setPostError(''); setPostOpen(true) }}>+ New Post</Button>
            {!isAdmin && <Button variant="danger" onClick={handleLeave}>Leave</Button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {['posts', 'members'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem',
            padding: '10px 16px',
            color: activeTab === tab ? 'var(--accent2)' : 'var(--text3)',
            borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
            transition: 'all 0.2s', textTransform: 'capitalize'
          }}>{tab}</button>
        ))}
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <Card><EmptyState icon="◉" title="No posts yet" subtitle="Be the first to share something!" /></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {posts.map((post, i) => (
                <div key={post.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  animation: `fadeIn 0.4s ease ${i * 0.05}s both`
                }}>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{post.title}</h3>
                        <p style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>by {post.authorName}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <button onClick={() => handleFeelGood(post.id)} style={{
                          background: post._liked ? 'rgba(108,99,255,0.15)' : 'var(--surface2)',
                          border: `1px solid ${post._liked ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                          color: post._liked ? 'var(--accent2)' : 'var(--text2)',
                          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem',
                          display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s'
                        }}>
                          ♥ {post.feelsGood}
                        </button>
                        {post.authorName === user?.name && (
                          <button onClick={() => handleDeletePost(post.id)} style={{
                            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                            borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                            color: 'var(--red)', fontSize: '0.8rem', transition: 'all 0.2s'
                          }}>✕</button>
                        )}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.description}</p>
                  </div>

                  {/* Comments toggle */}
                  <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px' }}>
                    <button onClick={() => loadComments(post.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text3)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {expandedPost === post.id ? '▲ Hide' : '▼ Comments'}
                    </button>
                  </div>

                  {expandedPost === post.id && (
                    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '16px 24px' }}>
                      {(comments[post.id] || []).length === 0 ? (
                        <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: 12 }}>No comments yet</p>
                      ) : (
                        <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(comments[post.id] || []).map((c, idx) => (
                            <div key={idx} style={{
                              background: 'var(--surface)', border: '1px solid var(--border)',
                              borderRadius: 10, padding: '10px 14px',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                            }}>
                              <div>
                                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.78rem', color: 'var(--accent2)', marginBottom: 3 }}>{c.commentatorName}</p>
                                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{c.description}</p>
                              </div>
                              {c.commentatorName === user?.name && (
                                <button onClick={() => handleDeleteComment(post.id, c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '0.75rem', padding: '2px 4px' }}>✕</button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          placeholder="Write a comment..."
                          value={commentForm[post.id] || ''}
                          onChange={e => setCommentForm(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                          style={{
                            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem', padding: '8px 12px', outline: 'none'
                          }}
                        />
                        <Button
                          onClick={() => handleAddComment(post.id)}
                          loading={commentLoading[post.id]}
                          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                        >Post</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {(details?.members || []).map((m, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              animation: `fadeIn 0.3s ease ${i * 0.04}s both`
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `hsl(${m.name?.charCodeAt(0) * 13 % 360}, 50%, 25%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem',
                color: `hsl(${m.name?.charCodeAt(0) * 13 % 360}, 70%, 70%)`
              }}>{m.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</p>
                <p style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>{m.username}</p>
              </div>
              {m.name === details?.adminName && <Badge color="yellow">Admin</Badge>}
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal open={postOpen} onClose={() => setPostOpen(false)} title="Create Post">
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="Title" placeholder="What's on your mind?"
            value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} required />
          <Textarea label="Description" placeholder="Share details..."
            value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} required />
          {postError && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: '0.85rem' }}>{postError}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => setPostOpen(false)}>Cancel</Button>
            <Button type="submit" loading={postLoading}>Publish</Button>
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
