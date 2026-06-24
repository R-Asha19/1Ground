import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

export default function Profile() {
  const { user, logout, getLiked, getContacted } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('info')

  useSEO(SEO.profile)

  const liked     = getLiked()
  const contacted = getContacted()

  const handleLogout = () => { logout(); navigate('/') }

  const tabs = [
    { id: 'info',      label: '👤 My Info' },
    { id: 'liked',     label: `❤️ Saved (${liked.length})` },
    { id: 'contacted', label: `💬 Contacted (${contacted.length})` },
  ]

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: 100, paddingBottom: 48,
        background: 'linear-gradient(180deg, var(--black-soft) 0%, var(--black) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">

          {/* Avatar + Info row */}
          <div className="profile-hero-row">
            <div className="profile-avatar">👤</div>
            <div className="profile-hero-info">
              <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--white)', margin: 0 }}>
                {user?.name}
              </h1>
              <p style={{ fontSize: '.82rem', color: 'var(--white-60)', marginTop: 4, wordBreak: 'break-all' }}>
                {user?.email} · <span style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{user?.role}</span>
              </p>
            </div>
            <button onClick={handleLogout} className="profile-logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Quick stats */}
          <div className="profile-stats-row">
            {[
              { n: liked.length,     l: 'Saved Properties' },
              { n: contacted.length, l: 'Properties Contacted' },
            ].map((s, i) => (
              <div key={i} className="profile-stat-card">
                <div style={{ fontFamily: 'var(--ff-d)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>{s.n}</div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white-30)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--black)', paddingTop: 48 }}>
        <div className="container">

          {/* Tab bar */}
          <div className="profile-tab-bar">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`profile-tab-btn ${tab === t.id ? 'active' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── INFO TAB ── */}
          {tab === 'info' && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px' }}>
                <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.3rem', color: 'var(--white)', marginBottom: 24 }}>
                  Account <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>Details</em>
                </h3>
                {[
                  { label: 'Full Name',    value: user?.name },
                  { label: 'Email',        value: user?.email },
                  { label: 'Role',         value: user?.role },
                  { label: 'Phone',        value: user?.phone || 'Not provided' },
                  { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) : 'N/A' },
                ].map(f => (
                  <div key={f.label} className="profile-detail-row">
                    <span className="profile-detail-label">{f.label}</span>
                    <span className="profile-detail-value">{f.value}</span>
                  </div>
                ))}
                {user?.role === 'owner' && (
                  <button onClick={() => navigate('/owner-dashboard')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 20 }}>
                    Go to Owner Dashboard →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── LIKED TAB ── */}
          {tab === 'liked' && (
            liked.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--white-60)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤍</div>
                <p style={{ marginBottom: 16 }}>You haven't saved any properties yet.</p>
                <button onClick={() => navigate('/buy')} className="btn-primary">Browse Properties</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '.82rem', color: 'var(--white-30)', marginBottom: 24 }}>
                  {liked.length} saved {liked.length === 1 ? 'property' : 'properties'}
                </p>
                <div className="prop-grid">
                  {liked.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </>
            )
          )}

          {/* ── CONTACTED TAB ── */}
          {tab === 'contacted' && (
            contacted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--white-60)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
                <p style={{ marginBottom: 16 }}>You haven't contacted any owners yet.</p>
                <button onClick={() => navigate('/buy')} className="btn-primary">Browse Properties</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '.82rem', color: 'var(--white-30)', marginBottom: 24 }}>
                  {contacted.length} {contacted.length === 1 ? 'property' : 'properties'} you contacted via WhatsApp
                </p>
                <div className="prop-grid">
                  {contacted.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </>
            )
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        /* ── Hero row ── */
        .profile-hero-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .profile-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: var(--gold-pale);
          border: 2px solid var(--gold-dim);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }
        .profile-hero-info {
          flex: 1;
          min-width: 0;
        }
        .profile-logout-btn {
          color: #ff8a8a;
          font-size: .82rem;
          padding: 9px 18px;
          border-radius: 8px;
          border: 1px solid rgba(224,85,85,.25);
          background: rgba(224,85,85,.1);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Stats row ── */
        .profile-stats-row {
          display: flex;
          gap: 16px;
          margin-top: 28px;
          flex-wrap: nowrap;
        }
        .profile-stat-card {
          background: var(--black-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 24px;
          flex: 1;
          min-width: 0;
        }

        /* ── Tab bar ── */
        .profile-tab-bar {
          display: flex;
          gap: 6px;
          background: var(--black-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 5px;
          width: 100%;
          margin-bottom: 40px;
          box-sizing: border-box;
        }
        .profile-tab-btn {
          flex: 1;
          padding: 10px 8px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          font-family: var(--ff-b);
          font-size: .82rem;
          font-weight: 600;
          background: transparent;
          color: var(--white-60);
          transition: all .25s;
          white-space: nowrap;
          text-align: center;
        }
        .profile-tab-btn.active {
          background: var(--gold);
          color: var(--black);
        }

        /* ── Detail rows ── */
        .profile-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .profile-detail-label {
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--white-30);
          flex-shrink: 0;
        }
        .profile-detail-value {
          font-size: .88rem;
          color: var(--white);
          font-weight: 500;
          text-transform: capitalize;
          text-align: right;
          word-break: break-all;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 480px) {
          .profile-hero-row {
            gap: 14px;
          }
          .profile-avatar {
            width: 58px; height: 58px;
            font-size: 1.5rem;
          }
          .profile-hero-info h1 {
            font-size: 1.4rem !important;
          }
          .profile-logout-btn {
            font-size: .75rem;
            padding: 7px 12px;
          }
          .profile-stats-row {
            gap: 10px;
          }
          .profile-stat-card {
            padding: 14px 16px;
          }
          .profile-tab-btn {
            font-size: .72rem;
            padding: 9px 4px;
          }
          .profile-detail-row {
            flex-direction: column;
            gap: 4px;
          }
          .profile-detail-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  )
}