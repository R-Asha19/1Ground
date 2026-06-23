import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import api from '../api/axios'
import { useSEO } from '../hooks/useSEO'
import { SEO, SCHEMA } from '../seo/seoConfig'

export default function Home() {
  useSEO({
    ...SEO.home,
    schema: SCHEMA.organization,
  })

  const navigate = useNavigate()
  const [buyProps,  setBuyProps]  = useState([])
  const [rentProps, setRentProps] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [animated,  setAnimated]  = useState(false)
  const statsRef = useRef(null)

  const [city,   setCity]   = useState('')
  const [type,   setType]   = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [buyRes, rentRes] = await Promise.all([
          api.get('/properties?listingType=buy&status=available'),
          api.get('/properties?listingType=rent&status=available'),
        ])
        setBuyProps(buyRes.data.properties?.slice(0,8)  || [])
        setRentProps(rentRes.data.properties?.slice(0,8) || [])
      } catch {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setAnimated(true)
    }, { threshold: .3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city)   params.set('city', city)
    if (type)   params.set('type', type)
    if (budget) {
      const [min, max] = budget.split('-')
      if (min) params.set('minPrice', min)
      if (max) params.set('maxPrice', max)
    }
    navigate(`/buy?${params}`)
  }

  return (
  <div>
    <Helmet>
      <title>1Ground | Buy, Rent & Sell Properties in India</title>

      <meta
        name="description"
        content="Find verified apartments, villas, plots and commercial properties for sale and rent across India on 1Ground."
      />

      <meta
        name="keywords"
        content="real estate, property in india, buy property, rent property, villa, apartment, plot, commercial property, chennai properties, 1ground"
      />

      <meta
        property="og:title"
        content="1Ground | Buy, Rent & Sell Properties in India"
      />

      <meta
        property="og:description"
        content="Buy, Rent and Sell premium properties across India with 1Ground."
      />

      <meta property="og:type" content="website" />

      <meta
        property="og:url"
        content="https://www.1ground.in/"
      />

      <meta
        property="og:image"
        content="https://www.1ground.in/logo.png"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="1Ground | Buy, Rent & Sell Properties"
      />

      <meta
        name="twitter:description"
        content="Discover thousands of verified properties across India with 1Ground."
      />

      <link
        rel="canonical"
        href="https://www.1ground.in/"
      />
    </Helmet>

    <Navbar />
      

      {/* ══════════════════════════════════════
          HERO — centered content
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* BG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1900&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,4,4,.88) 0%, rgba(8,8,8,.75) 60%, rgba(4,4,4,.92) 100%)',
        }}/>

        {/* Centered content */}
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center',
          padding: '130px 24px 100px',
          width: '100%', maxWidth: 1000,
          margin: '0 auto',
        }}>
          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.25)',
            borderRadius: 30, padding: '6px 18px', marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }}/>
            <span style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              India's #1 Property Platform
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--ff-d)',
            fontSize: 'clamp(3rem,7vw,6.5rem)',
            fontWeight: 300, lineHeight: 1.05, color: 'var(--white)',
            marginBottom: 20, letterSpacing: '-.01em',
          }}>
            Find Your Perfect<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>Dream Property</em>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 'clamp(.95rem,2vw,1.15rem)', color: 'rgba(255,255,255,.65)',
            fontWeight: 300, marginBottom: 50,
            maxWidth: 520, margin: '0 auto 50px',
            lineHeight: 1.75,
          }}>
            Buy, Rent, and Sell premium properties across India. 10,000+ verified listings waiting for you.
          </p>

          {/* ── 3 Glassmorphism Action Cards ── */}
          <div style={{
            display: 'flex', gap: 18, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 44,
          }}>
            {[
              { icon: '🏠', title: 'Buy Property',  desc: 'Browse thousands of verified properties.',          to: '/buy'  },
              { icon: '💼', title: 'Rent Property', desc: 'Discover homes and apartments for rent.',           to: '/rent' },
              { icon: '📢', title: 'List Property', desc: 'Post your property and reach thousands of buyers.', to: '/sell' },
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => navigate(card.to)}
                style={{
                  width: 220,
                  background: 'rgba(255,255,255,.07)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: 14,
                  padding: '26px 22px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'transform .3s ease, border-color .3s, box-shadow .3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform     = 'translateY(-8px)'
                  e.currentTarget.style.borderColor   = 'rgba(201,168,76,.5)'
                  e.currentTarget.style.boxShadow     = '0 20px 50px rgba(0,0,0,.5), 0 0 20px rgba(201,168,76,.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform   = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'
                  e.currentTarget.style.boxShadow   = 'none'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: 12, display: 'inline-block', transition: 'transform .3s' }}>{card.icon}</div>
                <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--white)', marginBottom: 7 }}>{card.title}</h3>
                <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.55, marginBottom: 14 }}>{card.desc}</p>
                <span style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  Explore <span style={{ fontSize: '1rem' }}>→</span>
                </span>
              </div>
            ))}
          </div>

          {/* ── Search Bar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap',
            background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,.12)', borderRadius: 12,
            overflow: 'hidden', maxWidth: 820, margin: '0 auto',
          }}>
            {/* City */}
            <div style={{ flex: 1, padding: '16px 20px', minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Location</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--white)', fontSize: '.88rem', width: '100%', cursor: 'pointer', fontFamily: 'var(--ff-b)' }}>
                <option value="" style={{ background: '#111' }}>Any City</option>
                {['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad'].map(c => (
                  <option key={c} value={c} style={{ background: '#111' }}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.1)', flexShrink: 0 }}/>
            {/* Type */}
            <div style={{ flex: 1, padding: '16px 20px', minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Property Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--white)', fontSize: '.88rem', width: '100%', cursor: 'pointer', fontFamily: 'var(--ff-b)' }}>
                <option value="" style={{ background: '#111' }}>Any Type</option>
                {['Apartment','Villa','Studio','Penthouse','Plot','Commercial'].map(t => (
                  <option key={t} value={t.toLowerCase()} style={{ background: '#111' }}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.1)', flexShrink: 0 }}/>
            {/* Budget */}
            <div style={{ flex: 1, padding: '16px 20px', minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Budget</label>
              <select value={budget} onChange={e => setBudget(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--white)', fontSize: '.88rem', width: '100%', cursor: 'pointer', fontFamily: 'var(--ff-b)' }}>
                <option value="" style={{ background: '#111' }}>Any Budget</option>
                <option value="0-5000000"          style={{ background: '#111' }}>Under ₹50 Lakh</option>
                <option value="0-10000000"         style={{ background: '#111' }}>Under ₹1 Crore</option>
                <option value="0-30000000"         style={{ background: '#111' }}>Under ₹3 Crore</option>
                <option value="50000000-999999999" style={{ background: '#111' }}>Above ₹5 Crore</option>
              </select>
            </div>
            {/* Search Button */}
            <button onClick={handleSearch} style={{
              background: 'var(--gold)', color: 'var(--black)', border: 'none',
              padding: '0 32px', height: 76, fontSize: '.88rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background .2s', flexShrink: 0, fontFamily: 'var(--ff-b)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-lt)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 1 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto 8px', animation: 'scrollDrop 2s infinite' }}/>
          <span style={{ fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--white-30)' }}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED BUY PROPERTIES
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--black-soft)' }}>
        <div className="container">
          <div className="sec-header">
            <p className="eyebrow">Premium Listings</p>
            <h2 className="sec-title">Featured <em>Buy Properties</em></h2>
            <p className="sec-sub">Handpicked premium properties from verified owners across India</p>
            <div className="view-all" onClick={() => navigate('/buy')}>View All Buy Properties →</div>
          </div>
          {loading ? <div className="spinner"/> : buyProps.length === 0 ? (
            <EmptyState type="buy" navigate={navigate}/>
          ) : (
            <div className="prop-grid">
              {buyProps.map(p => <PropertyCard key={p._id} property={p}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          RENTAL PROPERTIES
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="sec-header">
            <p className="eyebrow">Rental Listings</p>
            <h2 className="sec-title">Properties <em>For Rent</em></h2>
            <p className="sec-sub">Discover comfortable homes and apartments available for rent near you</p>
            <div className="view-all" onClick={() => navigate('/rent')}>View All Rental Properties →</div>
          </div>
          {loading ? <div className="spinner"/> : rentProps.length === 0 ? (
            <EmptyState type="rent" navigate={navigate}/>
          ) : (
            <div className="prop-grid">
              {rentProps.map(p => <PropertyCard key={p._id} property={p}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section ref={statsRef} style={{
        padding: '80px 0', position: 'relative', overflow: 'hidden',
        backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.84)' }}/>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }}>
            {[
              { target: 10000, label: 'Properties Listed' },
              { target: 5000,  label: 'Happy Customers' },
              { target: 200,   label: 'Cities Covered' },
              { target: 1000,  label: 'Trusted Agents' },
            ].map((s, i) => <Counter key={i} {...s} run={animated}/>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--black-soft)' }}>
        <div className="container">
          <div className="sec-header">
            <p className="eyebrow">Why 1Ground</p>
            <h2 className="sec-title">Built on <em>Trust & Technology</em></h2>
            <p className="sec-sub">Everything you need for a stress-free property journey</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { icon: '✔', title: 'Verified Properties', desc: 'Every listing goes through a 12-point verification before it appears on 1Ground.' },
              { icon: '🤝', title: 'Trusted Agents',     desc: 'Background-verified agents with years of local expertise ready to assist you.' },
              { icon: '💬', title: '24/7 Support',       desc: 'Our support team is available round the clock to assist you at every step.' },
              { icon: '🔒', title: 'Secure Transactions',desc: 'Bank-grade security and escrow services keep every deal transparent and safe.' },
            ].map((w, i) => (
              <div key={i} className="card" style={{ padding: '32px 26px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{w.icon}</div>
                <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.15rem', color: 'var(--white)', marginBottom: 10 }}>{w.title}</h3>
                <p style={{ fontSize: '.8rem', color: 'var(--white-60)', lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{
        padding: '100px 0', position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.92) 0%,rgba(20,14,0,.88) 100%)' }}/>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p className="eyebrow">Get Started Today</p>
          <h2 style={{ fontFamily: 'var(--ff-d)', fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 300, color: 'var(--white)', margin: '14px 0', lineHeight: 1.15 }}>
            Ready to Find Your<br/><em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>Dream Property?</em>
          </h2>
          <p style={{ color: 'var(--white-60)', fontSize: '1rem', maxWidth: 500, margin: '0 auto 36px' }}>
            Join over 5,000 families who found their perfect home through 1Ground.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/buy')}  className="btn-primary"   style={{ padding: '15px 38px', fontSize: '.9rem' }}>Browse Properties</button>
            <button onClick={() => navigate('/sell')} className="btn-secondary" style={{ padding: '15px 38px', fontSize: '.9rem' }}>List Your Property</button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes scrollDrop {
          0%  { transform:scaleY(0); transform-origin:top; }
          50% { transform:scaleY(1); transform-origin:top; }
          51% { transform:scaleY(1); transform-origin:bottom; }
          100%{ transform:scaleY(0); transform-origin:bottom; }
        }
        @media(max-width:900px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:540px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>

      
    </div>
  )
}



function Counter({ target, label, run }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!run) return
    const dur = 2000; const start = performance.now()
    const step = now => {
      const p = Math.min((now - start) / dur, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [run, target])
  return (
    <div>
      <div style={{ fontFamily: 'var(--ff-d)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--gold-lt)', fontWeight: 300, lineHeight: 1 }}>
        {count.toLocaleString('en-IN')}+
      </div>
      <p style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--white-30)', marginTop: 8 }}>{label}</p>
    </div>
  )
}

function EmptyState({ type, navigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--white-60)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>{type === 'rent' ? '🏠' : '🏢'}</div>
      <p style={{ marginBottom: 18 }}>No {type} properties listed yet. Be the first to list!</p>
      <button onClick={() => navigate('/sell')} className="btn-primary">List a Property</button>
    </div>
  )
}