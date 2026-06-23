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

  useSEO(SEO.profile) // noIndex: true — won't appear in Google

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--gold-pale)', border: '2px solid var(--gold-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
            }}>👤</div>
            <div>
              <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: '2rem', fontWeight: 400, color: 'var(--white)' }}>
                {user?.name}
              </h1>
              <p style={{ fontSize: '.82rem', color: 'var(--white-60)', marginTop: 4 }}>
                {user?.email} · <span style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{user?.role}</span>
              </p>
            </div>
            <button onClick={handleLogout} style={{ marginLeft: 'auto', color: '#ff8a8a', fontSize: '.82rem', padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(224,85,85,.25)', background: 'rgba(224,85,85,.1)', cursor: 'pointer' }}>
              🚪 Logout
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { n: liked.length,     l: 'Saved Properties' },
              { n: contacted.length, l: 'Properties Contacted' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 24px', minWidth: 140 }}>
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
          <div style={{ display: 'flex', gap: 6, background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 5, width: 'fit-content', marginBottom: 40 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 22px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--ff-b)', fontSize: '.82rem', fontWeight: 600,
                background: tab === t.id ? 'var(--gold)' : 'transparent',
                color: tab === t.id ? 'var(--black)' : 'var(--white-60)',
                transition: 'all .25s',
              }}>{t.label}</button>
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
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email',     value: user?.email },
                  { label: 'Role',      value: user?.role },
                  { label: 'Phone',     value: user?.phone || 'Not provided' },
                  { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) : 'N/A' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--white-30)' }}>{f.label}</span>
                    <span style={{ fontSize: '.88rem', color: 'var(--white)', fontWeight: 500, textTransform: 'capitalize' }}>{f.value}</span>
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
    </div>
  )
}