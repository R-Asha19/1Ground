import { Link } from 'react-router-dom'

// ── SVG Social Icons ──────────────────────────────
const SOCIALS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/1ground.in/',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: 'https://twitter.com',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@chennaipropertylisting1gro970',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080808"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--black-soft)', borderTop: '1px solid var(--border)', padding: '64px 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.3fr', gap: 48, paddingBottom: 52, borderBottom: '1px solid var(--border)' }}>

          {/* ── Brand ── */}
          <div>
            <div style={{ fontFamily: 'var(--ff-d)', fontSize: '1.6rem', color: 'var(--white)', marginBottom: 14 }}>
              <span style={{ color: 'var(--gold)' }}>1</span>Ground
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--white-60)', lineHeight: 1.75, maxWidth: 250, marginBottom: 22 }}>
              India's trusted platform to buy, rent and sell premium properties across 200+ cities.
            </p>
            {/* Social icons with real SVG logos */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--white-10)',
                    color: 'var(--white-60)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.color       = 'var(--gold-lt)'
                    e.currentTarget.style.background  = 'var(--gold-pale)'
                    e.currentTarget.style.transform   = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color       = 'var(--white-60)'
                    e.currentTarget.style.background  = 'var(--white-10)'
                    e.currentTarget.style.transform   = 'translateY(0)'
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 18 }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Home',           '/'],
                ['Buy Property',   '/buy'],
                ['Rent Property',  '/rent'],
                ['Sell Property',  '/sell'],
                ['About Us',       '/about'],
                ['Contact',        '/contact'],
              ].map(([l, t]) => (
                <li key={l}>
                  <Link
                    to={t}
                    style={{ fontSize: '.82rem', color: 'var(--white-60)', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold-lt)'}
                    onMouseLeave={e => e.target.style.color = 'var(--white-60)'}
                  >{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 18 }}>Services</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Property Valuation','Home Loans','Legal Assistance','Interior Design','NRI Services'].map(s => (
                <li key={s}>
                  <a
                    href="#"
                    style={{ fontSize: '.82rem', color: 'var(--white-60)', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold-lt)'}
                    onMouseLeave={e => e.target.style.color = 'var(--white-60)'}
                  >{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 18 }}>Contact Us</h4>
            {[
              { icon: '📍', text: '14th Floor, One BKC Tower,\nBandra Kurla Complex, Mumbai 400051' },
              { icon: '📞', text: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: '✉️', text: 'hello@1ground.in', href: 'mailto:hello@1ground.in' },
            ].map(c => (
              <p key={c.icon} style={{ display: 'flex', gap: 10, fontSize: '.82rem', color: 'var(--white-60)', marginBottom: 13, lineHeight: 1.65, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>{c.icon}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    style={{ color: 'var(--white-60)', textDecoration: 'none', whiteSpace: 'pre-line', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold-lt)'}
                    onMouseLeave={e => e.target.style.color = 'var(--white-60)'}
                  >{c.text}</a>
                ) : (
                  <span style={{ whiteSpace: 'pre-line' }}>{c.text}</span>
                )}
              </p>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '.75rem', color: 'var(--white-30)' }}>
            © 2025 1Ground. All rights reserved. Crafted with ♥ in India.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a
                key={l} href="#"
                style={{ fontSize: '.72rem', color: 'var(--white-30)', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold-lt)'}
                onMouseLeave={e => e.target.style.color = 'var(--white-30)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}