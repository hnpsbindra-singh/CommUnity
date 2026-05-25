// src/pages/DashboardPage.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCommunities, getCommunityPosts } from '../api'
import { useAuth } from '../context/AuthContext'
import { Card, Badge, Spinner, EmptyState } from '../components/UI'

export default function DashboardPage() {
  const { user } = useAuth()

  const [communities, setCommunities] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyCommunities()

        setCommunities(res.data)

        const postPromises = res.data
          .slice(0, 3)
          .map(c =>
            getCommunityPosts(c.id).catch(() => ({
              data: [],
            }))
          )

        const postResults = await Promise.all(postPromises)

        const allPosts = postResults.flatMap(r => r.data || [])

        setRecentPosts(allPosts.slice(0, 6))

      } catch {

      } finally {

        setLoading(false)
      }
    }

    load()
  }, [])

  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening'

  return (
    <div
      style={{
        maxWidth: 1250,
        margin: '0 auto',
        padding: '42px 24px 80px',
      }}
    >
      {/* HERO */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 34,
          padding: '44px 42px',
          marginBottom: 34,
          background:
            'linear-gradient(135deg, rgba(124,108,255,0.18), rgba(94,234,212,0.08))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow)',
          animation: 'fadeIn 0.5s ease',
        }}
      >
        {/* blobs */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,108,255,0.2), transparent 70%)',
            top: -160,
            right: -120,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 30,
            right: 80,
            fontSize: '4rem',
            opacity: 0.08,
            animation: 'floaty 5s ease infinite',
            pointerEvents: 'none',
          }}
        >
          ✦
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p
            style={{
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.76rem',
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            {greeting}
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '3rem',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              marginBottom: 14,
            }}
          >
            {user?.name} 👋
          </h1>

          <p
            style={{
              color: 'var(--text2)',
              maxWidth: 520,
              fontSize: '1rem',
              marginBottom: 28,
            }}
          >
            Your digital campus of conversations, people,
            memes, ideas and late night engineering thoughts 🌌
          </p>

          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}
              >
                {communities.length}
              </div>

              <div
                style={{
                  color: 'var(--text3)',
                  fontSize: '0.82rem',
                }}
              >
                Communities
              </div>
            </div>

            <div
              style={{
                padding: '12px 18px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}
              >
                {recentPosts.length}
              </div>

              <div
                style={{
                  color: 'var(--text3)',
                  fontSize: '0.82rem',
                }}
              >
                Recent Posts
              </div>
            </div>

            <div
              style={{
                padding: '12px 18px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}
              >
                {user?.role || 'USER'}
              </div>

              <div
                style={{
                  color: 'var(--text3)',
                  fontSize: '0.82rem',
                }}
              >
                Role
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 24,
        }}
      >
        {/* LEFT */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  marginBottom: 4,
                }}
              >
                Your Communities
              </h2>

              <p
                style={{
                  color: 'var(--text3)',
                  fontSize: '0.88rem',
                }}
              >
                Places where your people exist
              </p>
            </div>

            <Link
              to="/my-communities"
              style={{
                color: 'var(--accent2)',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 80,
              }}
            >
              <Spinner size={34} />
            </div>
          ) : communities.length === 0 ? (
            <Card>
              <EmptyState
                icon="◈"
                title="No communities yet"
                subtitle="Join or create one to begin your little internet empire."
              />
            </Card>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {communities.slice(0, 5).map((c, i) => (
                <Link
                  key={c.id}
                  to={`/communities/${c.id}`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <div
                    className="hover-lift"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 24,
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 18,
                      animation:
                        `fadeIn 0.4s ease ${i * 0.05}s both`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          background:
                            'linear-gradient(135deg, rgba(124,108,255,0.3), rgba(94,234,212,0.2))',
                          border:
                            '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3
                          style={{
                            fontSize: '1rem',
                            marginBottom: 4,
                          }}
                        >
                          {c.name}
                        </h3>

                        <p
                          style={{
                            color: 'var(--text3)',
                            fontSize: '0.82rem',
                          }}
                        >
                          Admin · {c.adminName}
                        </p>
                      </div>
                    </div>

                    {c.adminName === user?.name && (
                      <Badge color="yellow">
                        Admin
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                marginBottom: 4,
              }}
            >
              Recent Activity
            </h2>

            <p
              style={{
                color: 'var(--text3)',
                fontSize: '0.88rem',
              }}
            >
              Tiny echoes from your communities
            </p>
          </div>

          {recentPosts.length === 0 ? (
            <Card>
              <EmptyState
                icon="✦"
                title="No posts yet"
                subtitle="The silence before the memes."
              />
            </Card>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {recentPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="hover-lift"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 24,
                    padding: '20px',
                    animation:
                      `fadeIn 0.4s ease ${i * 0.05}s both`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          marginBottom: 4,
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        style={{
                          color: 'var(--text3)',
                          fontSize: '0.8rem',
                        }}
                      >
                        by {post.authorName}
                      </p>
                    </div>

                    <Badge color="accent">
                      ♥ {post.feelsGood || 0}
                    </Badge>
                  </div>

                  <p
                    style={{
                      color: 'var(--text2)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {post.description?.length > 120
                      ? post.description.slice(0, 120) + '...'
                      : post.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}