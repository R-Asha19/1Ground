import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png';

const NAV_LINKS = [
  { label: 'Home',    to: '/' },
  { label: 'Buy',     to: '/buy' },
  { label: 'Rent',    to: '/rent' },
  { label: 'Sell',    to: '/sell' },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { user, logout }    = useAuth()
  const location            = useLocation()
  const navigate            = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menu on route change
  useEffect(() => setOpen(false), [location])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLogout = () => { logout(); navigate('/') }

  const getDashLink = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin-dashboard'
    if (user.role === 'owner') return '/owner-dashboard'
    return '/profile'
  }

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? '10px 0' : '18px 0',
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'rgba(8,8,8,0.35)',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all .35s ease',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 }}>

          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--white)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="1Ground Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />

            <span
              style={{
                fontFamily: 'var(--ff-d)',
                fontSize: '1.65rem',
                fontWeight: 600,
                letterSpacing: '-.01em',
              }}
            >
              <span style={{ color: 'var(--gold)' }}>1</span>Ground
            </span>
          </Link>

          {/* Desktop Links */}
          <ul style={{ display:'flex', alignItems:'center', gap:6, listStyle:'none' }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{
                  fontSize: '.78rem', fontWeight: 500, letterSpacing: '.07em',
                  textTransform: 'uppercase', padding: '7px 14px', borderRadius: 7,
                  color: isActive(l.to) ? 'var(--gold-lt)' : 'var(--white-60)',
                  background: isActive(l.to) ? 'var(--gold-pale)' : 'transparent',
                  transition: 'all .2s', display: 'block',
                }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            {/* Desktop-only auth controls */}
            <div className="nav-desktop-auth" style={{ display:'flex', alignItems:'center', gap:10 }}>
              {user ? (
                <>
                  <Link to={getDashLink()} style={{
                    fontSize: '.78rem', fontWeight: 600, padding: '9px 18px',
                    borderRadius: 7, border: '1px solid var(--gold-dim)',
                    color: 'var(--gold-lt)', transition: 'all .2s', display: 'flex',
                    alignItems: 'center', gap: 6,
                  }}>
                    {user.role === 'admin'  ? '🛡️ Admin'
                    : user.role === 'owner' ? '🔑 Dashboard'
                    : '👤 ' + user.name.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} style={{
                    fontSize: '.75rem', fontWeight: 500, padding: '9px 16px',
                    borderRadius: 7, border: '1px solid rgba(255,255,255,.1)',
                    color: 'var(--white-60)', transition: 'all .2s',
                  }}>Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn-primary" style={{ padding:'9px 24px', fontSize:'.78rem' }}>
                  Login / Register
                </Link>
              )}
            </div>

            {/* Hamburger - always rendered, visibility controlled by CSS, sized as a real tap target */}
            <button
              onClick={() => setOpen(o => !o)}
              className="ham-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              style={{
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                width: 44,
                height: 44,
                borderRadius: 9,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                flexShrink: 0,
              }}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display:'block', width:20, height:2,
                  background: 'var(--white)', borderRadius:2,
                  transition: 'all .3s',
                  transform: open ? (i===0?'translateY(7px) rotate(45deg)':i===2?'translateY(-7px) rotate(-45deg)':'none') : 'none',
                  opacity: open && i===1 ? 0 : 1,
                }}/>
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position:'fixed', inset:0, zIndex:199,
          background:'rgba(8,8,8,.97)', backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:6, overflowY:'auto', padding:'90px 20px 40px',
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontSize:'1.1rem', fontWeight:500, letterSpacing:'.1em',
              textTransform:'uppercase', padding:'14px 40px', borderRadius:10,
              color: isActive(l.to) ? 'var(--gold-lt)' : 'var(--white-60)',
              background: isActive(l.to) ? 'var(--gold-pale)' : 'transparent',
              width:'100%', maxWidth:280, textAlign:'center',
            }}>{l.label}</Link>
          ))}
          <div style={{ height:1, width:200, background:'var(--border)', margin:'12px 0' }}/>
          {user ? (
            <>
              <Link to={getDashLink()} className="btn-primary" style={{ width:200, justifyContent:'center' }}>
                {user.role === 'admin' ? '🛡️ Admin Panel' : user.role === 'owner' ? '🔑 Dashboard' : '👤 My Profile'}
              </Link>
              <button onClick={handleLogout} style={{ color:'#ff8a8a', fontSize:'.88rem', marginTop:8 }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ width:200, justifyContent:'center' }}>Login / Register</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-desktop-auth { display: none !important; }
          .ham-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}