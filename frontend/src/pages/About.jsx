import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
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

      {/* Team */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="sec-header">
            <p className="eyebrow">Leadership</p>
            <h2 className="sec-title">Meet the <em>Team</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { name: 'Chez IT Solutions',   role: 'CEO & Founder',      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
              { name: 'Asha R',  role: 'Web Developer',  img: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=200&q=80' },
              { name: 'Sarumathi E',   role: 'Web Developer',                 img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
              { name: 'Janani',  role: 'Web Developer',   img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
            ].map((m, i) => (
              <div key={i} className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 14px', border: '2px solid var(--gold-dim)' }}>
                  <img src={m.img} alt={m.name} />
                </div>
                <h4 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.05rem', color: 'var(--white)', marginBottom: 4 }}>{m.name}</h4>
                <p style={{ fontSize: '.75rem', color: 'var(--gold)', letterSpacing: '.06em' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
