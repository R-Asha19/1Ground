import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

// ── Google Client ID ──────────────────────────────────────────
// Replace this with your actual Google Client ID from
// https://console.cloud.google.com → APIs & Services → Credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '369414467594-335e8u4j61hr76lotdm8ord7kmhudj94.apps.googleusercontent.com'

export default function Login() {
  const { login, user } = useAuth()
  const navigate        = useNavigate()
  const [searchParams]  = useSearchParams()
  const defaultRole     = searchParams.get('role') || 'customer'

  const [tab,         setTab]         = useState('login')      // 'login' | 'register'
  const [role,        setRole]        = useState(defaultRole)
  const [emailMode,   setEmailMode]   = useState(false)        // show email form or Google buttons
  const [loading,     setLoading]     = useState(false)
  const [googleLoading,setGoogleLoading]=useState(false)
  const [msg,         setMsg]         = useState({ text:'', type:'' })

  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [regForm,   setRegForm]   = useState({ name:'', email:'', phone:'', password:'' })

  useSEO(SEO.login) // noIndex: true — won't appear in Google

  // Redirect if already logged in
  useEffect(() => {
    if (!user) return
    if (user.role === 'admin')  navigate('/admin-dashboard')
    else if (user.role === 'owner') navigate('/owner-dashboard')
    else navigate('/')
  }, [user])

  // ── Load Google Identity Services script ──────────
  useEffect(() => {
    const script = document.createElement('script')
    script.src   = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  // ── Handle Google credential response ─────────────
  const handleGoogleResponse = useCallback(async (response) => {
    setGoogleLoading(true)
    setMsg({ text:'', type:'' })
    try {
      const res = await api.post('/auth/google', {
        credential: response.credential,
        role: role,   // pass selected role so new Google users get correct role
      })
      login(res.data.user, res.data.token)
      const r = res.data.user.role
      if (r === 'admin')  navigate('/admin-dashboard')
      else if (r === 'owner') navigate('/owner-dashboard')
      else navigate('/')
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Google sign-in failed. Try again.', type:'error' })
    } finally { setGoogleLoading(false) }
  }, [role])

  // ── Trigger Google One-Tap / Sign-In ──────────────
  const handleGoogleSignIn = () => {
    if (!window.google) {
      setMsg({ text:'Google Sign-In is loading, please wait a moment and try again.', type:'error' })
      return
    }
    window.google.accounts.id.initialize({
      client_id:         GOOGLE_CLIENT_ID,
      callback:          handleGoogleResponse,
      auto_select:       false,
      cancel_on_tap_outside: true,
    })
    window.google.accounts.id.prompt()
  }

  const showMsg = (text, type) => setMsg({ text, type })

  // ── Email Login ───────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg({ text:'', type:'' })
    try {
      const res = await api.post('/auth/login', loginForm)
      login(res.data.user, res.data.token)
      showMsg('Login successful! Redirecting...', 'success')
      setTimeout(() => {
        const r = res.data.user.role
        if (r === 'admin')  navigate('/admin-dashboard')
        else if (r === 'owner') navigate('/owner-dashboard')
        else navigate('/')
      }, 600)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Invalid email or password', 'error')
    } finally { setLoading(false) }
  }

  // ── Email Register ────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    if (role === 'owner' && !regForm.phone) {
      showMsg('WhatsApp number is required for property owners', 'error'); return
    }
    setLoading(true); setMsg({ text:'', type:'' })
    try {
      const body = { ...regForm, role }
      if (role !== 'owner') delete body.phone
      const res = await api.post('/auth/register', body)
      login(res.data.user, res.data.token)
      showMsg('Account created! Redirecting...', 'success')
      setTimeout(() => navigate(role === 'owner' ? '/owner-dashboard' : '/'), 600)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Registration failed. Try again.', 'error')
    } finally { setLoading(false) }
  }

  // ── Shared styles ─────────────────────────────────
  const inp = {
    background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)',
    borderRadius:8, padding:'12px 14px', color:'var(--white)',
    fontFamily:'var(--ff-b)', fontSize:'.88rem', outline:'none', width:'100%',
    transition:'border-color .2s',
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      backgroundImage:'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80)',
      backgroundSize:'cover', backgroundPosition:'center', position:'relative',
    }}>
      {/* Dark overlay */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.84)', backdropFilter:'blur(6px)' }}/>

      {/* Card */}
      <div style={{
        position:'relative', zIndex:1,
        background:'rgba(20,20,20,.95)',
        backdropFilter:'blur(24px)',
        border:'1px solid rgba(255,255,255,.1)',
        borderRadius:22,
        padding:'44px 40px',
        width:'100%', maxWidth:440, margin:24,
        boxShadow:'0 32px 80px rgba(0,0,0,.6)',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display:'block', fontFamily:'var(--ff-d)', fontSize:'1.9rem', color:'var(--white)', textAlign:'center', marginBottom:4, textDecoration:'none' }}>
          <span style={{ color:'var(--gold)' }}>1</span>Ground
        </Link>
        <p style={{ textAlign:'center', fontSize:'.78rem', color:'var(--white-60)', marginBottom:28 }}>
          India's #1 Property Platform
        </p>

        {/* Login / Register Tabs */}
        <div style={{ display:'flex', background:'rgba(255,255,255,.05)', borderRadius:10, padding:4, marginBottom:28 }}>
          {[['login','Login'],['register','Register']].map(([t,l]) => (
            <button key={t} onClick={() => { setTab(t); setEmailMode(false); setMsg({ text:'', type:'' }) }} style={{
              flex:1, padding:'10px', borderRadius:8, border:'none', cursor:'pointer',
              fontFamily:'var(--ff-b)', fontSize:'.8rem', fontWeight:600,
              letterSpacing:'.06em', textTransform:'uppercase',
              background: tab===t ? 'var(--gold)' : 'transparent',
              color:      tab===t ? 'var(--black)' : 'var(--white-60)',
              transition:'all .25s',
            }}>{l}</button>
          ))}
        </div>

        {/* ── REGISTER: Role picker (always visible in register tab) ── */}
        {tab === 'register' && (
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:'.67rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:8 }}>I want to</label>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { value:'customer', label:'🏠 Buy / Rent', desc:'Find properties' },
                { value:'owner',    label:'🔑 Sell / List', desc:'List my property' },
              ].map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{
                  flex:1, padding:'12px 10px', borderRadius:9, cursor:'pointer',
                  fontFamily:'var(--ff-b)', textAlign:'center',
                  border:      role===r.value ? '1.5px solid var(--gold)'           : '1.5px solid rgba(255,255,255,.12)',
                  background:  role===r.value ? 'rgba(201,168,76,.1)'               : 'rgba(255,255,255,.04)',
                  color:       role===r.value ? 'var(--gold-lt)'                    : 'var(--white-60)',
                  transition:'all .2s',
                }}>
                  <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:'.7rem', opacity:.7 }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR / SUCCESS MESSAGE ── */}
        {msg.text && (
          <div style={{
            padding:'11px 14px', borderRadius:9, marginBottom:16,
            fontSize:'.8rem', lineHeight:1.5,
            background: msg.type==='error' ? 'rgba(224,85,85,.12)' : 'rgba(76,175,125,.12)',
            border:     msg.type==='error' ? '1px solid rgba(224,85,85,.28)' : '1px solid rgba(76,175,125,.28)',
            color:      msg.type==='error' ? '#ff8a8a' : '#7de0a8',
          }}>
            {msg.text}
          </div>
        )}

        {/* ══════════════════════════════════════
            DEFAULT VIEW — Google + Email buttons
        ══════════════════════════════════════ */}
        {!emailMode && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {/* ── Continue with Google ── */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                width:'100%', padding:'13px 20px', borderRadius:10,
                background:'var(--white)', color:'#1f1f1f',
                border:'none', cursor: googleLoading ? 'not-allowed' : 'pointer',
                fontFamily:'var(--ff-b)', fontSize:'.9rem', fontWeight:600,
                transition:'background .2s, transform .15s, box-shadow .2s',
                boxShadow:'0 2px 12px rgba(0,0,0,.3)',
                opacity: googleLoading ? .7 : 1,
              }}
              onMouseEnter={e => { if (!googleLoading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.4)' }}}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,.3)' }}
            >
              {googleLoading ? (
                <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid #ccc', borderTopColor:'#333', animation:'spin .7s linear infinite' }}/>
              ) : (
                /* Official Google G logo SVG */
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : `${tab === 'login' ? 'Continue' : 'Sign up'} with Google`}
            </button>

            {/* ── Divider ── */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'4px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,.1)' }}/>
              <span style={{ fontSize:'.75rem', color:'var(--white-30)', fontWeight:500 }}>or</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,.1)' }}/>
            </div>

            {/* ── Continue with Email ── */}
            <button
              onClick={() => setEmailMode(true)}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                width:'100%', padding:'13px 20px', borderRadius:10,
                background:'transparent', color:'var(--white)',
                border:'1.5px solid rgba(255,255,255,.18)', cursor:'pointer',
                fontFamily:'var(--ff-b)', fontSize:'.9rem', fontWeight:600,
                transition:'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold-lt)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.18)'; e.currentTarget.style.color='var(--white)' }}
            >
              ✉️ Continue with Email
            </button>

            {/* Note for owners */}
            {tab === 'register' && role === 'owner' && (
              <p style={{ fontSize:'.72rem', color:'rgba(201,168,76,.7)', textAlign:'center', padding:'8px 12px', background:'rgba(201,168,76,.06)', borderRadius:8, border:'1px solid rgba(201,168,76,.15)' }}>
                💡 After signing in with Google, add your WhatsApp number in your profile so buyers can contact you.
              </p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            EMAIL MODE — Login or Register form
        ══════════════════════════════════════ */}
        {emailMode && (
          <>
            {/* Back to options */}
            <button
              onClick={() => { setEmailMode(false); setMsg({ text:'', type:'' }) }}
              style={{ display:'flex', alignItems:'center', gap:6, color:'var(--white-60)', fontSize:'.8rem', background:'none', border:'none', cursor:'pointer', marginBottom:18, padding:0 }}
            >
              ← Back
            </button>

            {/* LOGIN form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:'.67rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:6 }}>Email</label>
                  <input
                    type="email" required placeholder="you@email.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email:e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor='var(--gold)'}
                    onBlur={e  => e.target.style.borderColor='rgba(255,255,255,.12)'}
                  />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'.67rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:6 }}>Password</label>
                  <input
                    type="password" required placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password:e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor='var(--gold)'}
                    onBlur={e  => e.target.style.borderColor='rgba(255,255,255,.12)'}
                  />
                </div>
                <p style={{ fontSize:'.72rem', color:'var(--white-30)', textAlign:'center' }}>
                  Admins, owners and customers all login here
                </p>
                <button type="submit" disabled={loading} className="btn-primary" style={{
                  width:'100%', justifyContent:'center', padding:'13px',
                  opacity: loading ? .7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4,
                }}>
                  {loading ? '⏳ Logging in...' : 'Login →'}
                </button>
              </form>
            )}

            {/* REGISTER form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { label:'Full Name', key:'name',     type:'text',     placeholder:'Your full name' },
                  { label:'Email',     key:'email',    type:'email',    placeholder:'you@email.com' },
                  ...(role === 'owner' ? [{ label:'WhatsApp Number', key:'phone', type:'tel', placeholder:'91XXXXXXXXXX (with country code)' }] : []),
                  { label:'Password',  key:'password', type:'password', placeholder:'Min 6 characters' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:'.67rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:6 }}>{f.label}</label>
                    <input
                      type={f.type} required placeholder={f.placeholder}
                      value={regForm[f.key] || ''}
                      onChange={e => setRegForm(p => ({ ...p, [f.key]:e.target.value }))}
                      style={inp}
                      onFocus={e => e.target.style.borderColor='var(--gold)'}
                      onBlur={e  => e.target.style.borderColor='rgba(255,255,255,.12)'}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading} className="btn-primary" style={{
                  width:'100%', justifyContent:'center', padding:'13px',
                  opacity: loading ? .7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4,
                }}>
                  {loading ? '⏳ Creating account...' : 'Create Account →'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Back to home link */}
        <p style={{ textAlign:'center', marginTop:22, fontSize:'.74rem', color:'var(--white-30)' }}>
          <Link to="/" style={{ color:'var(--gold)', textDecoration:'none' }}>← Back to Home</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}