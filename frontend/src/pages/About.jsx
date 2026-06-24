import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'
import { SEO, SCHEMA } from '../seo/seoConfig'

export default function About() {
  useSEO({
    ...SEO.about,
    schema: SCHEMA.organization,
  })

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="about-hero" style={{
        height: 360, position: 'relative', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.78)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
          <p style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Our Story</p>
          <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 300, color: 'var(--white)' }}>
            About <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>1Ground</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.95rem', marginTop: 12, maxWidth: 500 }}>
            Built with a mission to make property buying, renting, and selling simple and transparent for every Indian.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="mission-grid">
            <div>
              <p className="eyebrow">Our Mission</p>
              <h2 className="sec-title">Making Real Estate <em>Simple for Everyone</em></h2>
              <p className="sec-sub" style={{ marginBottom: 20 }}>
                1Ground was founded with a single goal — to remove the complexity and mistrust from India's real estate market.
              </p>
              <p style={{ fontSize: '.88rem', color: 'var(--white-60)', lineHeight: 1.8, marginBottom: 20 }}>
                We connect verified property owners directly with genuine buyers and renters through technology, transparency, and trust. No middlemen, no hidden fees.
              </p>
              <p style={{ fontSize: '.88rem', color: 'var(--white-60)', lineHeight: 1.8 }}>
                From a 1 BHK studio in Bangalore to a luxury penthouse in Mumbai — every property deserves the right audience, and every buyer deserves a home they can trust.
              </p>
            </div>
            <div className="stats-grid">
              {[
                { n: '10,000+', l: 'Properties Listed' },
                { n: '5,000+',  l: 'Happy Customers' },
                { n: '200+',    l: 'Cities Covered' },
                { n: '1,000+',  l: 'Trusted Agents' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                  <div className="stat-n">{s.n}</div>
                  <div className="stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--black-soft)' }}>
        <div className="container">
          <div className="sec-header">
            <p className="eyebrow">Our Values</p>
            <h2 className="sec-title">What We <em>Stand For</em></h2>
          </div>
          <div className="values-grid">
            {[
              { icon: '🔍', title: 'Transparency',  desc: 'No hidden charges, no fake listings. Every detail verified before it goes live.' },
              { icon: '🤝', title: 'Trust',         desc: 'Every owner, agent, and listing on 1Ground is background verified.' },
              { icon: '💡', title: 'Innovation',    desc: 'We constantly improve our platform using feedback from real users.' },
              { icon: '🏠', title: 'Accessibility', desc: 'From affordable homes to luxury villas — we serve every budget.' },
              { icon: '📱', title: 'Simplicity',    desc: 'Finding and listing a property should be as simple as a WhatsApp message.' },
              { icon: '🌍', title: 'Coverage',      desc: 'Expanding to 200+ cities so every Indian can find their dream home.' },
            ].map((v, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.1rem', color: 'var(--white)', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: '.8rem', color: 'var(--white-60)', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 900px) {
          .mission-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        @media (max-width: 600px) {
          .about-hero {
            height: 300px !important;
          }

          .mission-grid {
            gap: 32px;
          }

          .stats-grid {
            gap: 12px;
          }

          .stat-card {
            padding: 20px 12px !important;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  )
}