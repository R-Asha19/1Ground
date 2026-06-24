import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

export default function Sell() {
  useSEO(SEO.sell)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'owner') navigate('/owner-dashboard')
    if (user?.role === 'admin') navigate('/admin-dashboard')
  }, [user])

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="sell-hero" style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.82)' }} />
        <div className="container sell-hero-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sell-grid">

            {/* Left - text */}
            <div>
              <p style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                List on 1Ground
              </p>
              <h1 style={{
                fontFamily: 'var(--ff-d)', fontSize: 'clamp(2.4rem,5vw,4rem)',
                fontWeight: 300, color: 'var(--white)', lineHeight: 1.1, marginBottom: 20,
              }}>
                Sell or Rent Your<br />
                <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>Property Fast</em>
              </h1>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.6)', marginBottom: 36, lineHeight: 1.75 }}>
                Reach thousands of verified buyers and renters. List for free and get enquiries directly on WhatsApp.
              </p>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
                {[
                  '✅ Free listing for owners',
                  '✅ Reach 50,000+ monthly visitors',
                  '✅ Direct WhatsApp enquiries',
                  '✅ Manage & edit listings anytime',
                  '✅ Choose to Sell or Rent',
                ].map(b => (
                  <p key={b} style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.75)' }}>{b}</p>
                ))}
              </div>

              <div className="sell-cta-row">
                <button
                  onClick={() => navigate('/login?role=owner')}
                  className="btn-primary"
                  style={{ padding: '14px 36px', fontSize: '.92rem' }}
                >
                  Register as Owner →
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                  style={{ padding: '14px 28px', fontSize: '.92rem' }}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Right - steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.4rem', color: 'var(--white)', marginBottom: 8 }}>
                How it <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>Works</em>
              </h3>
              {[
                { step: '01', title: 'Create an Owner Account', desc: 'Register for free with your name, email and WhatsApp number.' },
                { step: '02', title: 'Post Your Property',       desc: 'Add details, photos, price and choose Sell or Rent.' },
                { step: '03', title: 'Get Enquiries',            desc: 'Buyers and renters contact you directly via WhatsApp.' },
                { step: '04', title: 'Close the Deal',           desc: 'Update your listing status once it is sold or rented.' },
              ].map(s => (
                <div key={s.step} style={{
                  background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,.1)', borderRadius: 12,
                  padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: 'var(--ff-d)', fontSize: '1.6rem', color: 'var(--gold)',
                    fontWeight: 600, lineHeight: 1, flexShrink: 0, minWidth: 36,
                  }}>{s.step}</div>
                  <div>
                    <h4 style={{ color: 'var(--white)', fontSize: '.9rem', fontWeight: 600, marginBottom: 4 }}>{s.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem', lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .sell-hero {
          min-height: 100vh;
        }
        .sell-hero-inner {
          padding-top: 100px;
          padding-bottom: 60px;
        }
        .sell-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 860px) {
          .sell-hero {
            min-height: auto;
          }
          .sell-hero-inner {
            padding-top: 110px;
            padding-bottom: 50px;
          }
          .sell-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }

        @media (max-width: 480px) {
          .sell-cta-row {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .sell-cta-row button {
            width: 100%;
            padding: 14px 0 !important;
          }
        }

        @media (min-width: 481px) {
          .sell-cta-row {
            display: flex;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  )
}