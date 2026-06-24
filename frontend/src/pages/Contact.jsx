import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { useSEO } from '../hooks/useSEO'
import { SEO, SCHEMA } from '../seo/seoConfig'

export default function Contact() {
  useSEO({
    ...SEO.contact,
    schema: SCHEMA.localBusiness,
  })

  const [form, setForm]         = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [loading, setLoading]   = useState(false)
  const [msg,     setMsg]       = useState({ text:'', type:'' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ text:'', type:'' })
    try {
      await api.post('/contact', form)
      setMsg({ text:'✅ Message sent! We will get back to you within 24 hours.', type:'success' })
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    } catch (err) {
      setMsg({ text: err.response?.data?.message || '❌ Failed to send. Please try again.', type:'error' })
    } finally { setLoading(false) }
  }

  // ── Contact details with clickable links ──
  const contactDetails = [
    {
      icon: '📍',
      title: 'Our Office',
      text: 'Chez IT Solutions Pvt Ltd, 61/87, Station Rd, Radha Nagar,\n Chromepet, Chennai, Tamil Nadu 600044',
      link: 'https://www.google.com/maps/place/Chez+IT+Solutions+Pvt+Ltd/@12.950289,80.1427074,851m/data=!3m1!1e3!4m6!3m5!1s0x3a525fe6b14617b7:0x85c21eb34295f5cf!8m2!3d12.9506236!4d80.1447244!16s%2Fg%2F11x6plywmd?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D',
      linkLabel: 'View on Map',
    },
    {
      icon: '📞',
      title: 'Phone',
      lines: [
        { display: '+91 7094640322', href: 'tel:+917094640322' },
      ],
    },
    {
      icon: '✉️',
      title: 'Email',
      lines: [
        { display: 'enquiry1ground@gmail.com', href: 'https://mail.google.com/mail/?view=cm&to=enquiry1ground@gmail.com', external: true },
      ],
    },
    {
      icon: '🕐',
      title: 'Working Hours',
      text: 'Mon – Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 4:00 PM',
    },
  ]

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="contact-hero" style={{
        height: 340, position: 'relative', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.8)' }}/>
        <div className="container" style={{ position:'relative', zIndex:1, paddingTop:80 }}>
          <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:12 }}>Get In Touch</p>
          <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:300, color:'var(--white)' }}>
            Contact <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Us</em>
          </h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'.95rem', marginTop:12 }}>
            We'd love to hear from you. Our team responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ background:'var(--black)' }}>
        <div className="container">
          <div className="contact-grid">

            {/* ── Contact Info ── */}
            <div>
              <h2 style={{ fontFamily:'var(--ff-d)', fontSize:'1.8rem', fontWeight:300, color:'var(--white)', marginBottom:8 }}>
                Let's <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Talk</em>
              </h2>
              <p style={{ fontSize:'.88rem', color:'var(--white-60)', lineHeight:1.75, marginBottom:32 }}>
                Have a question about buying, renting, or listing? Our team of experts is here to help you every step of the way.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                {contactDetails.map((c, i) => (
                  <div key={i} className="contact-row" style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                    {/* Icon box */}
                    <div className="contact-icon" style={{
                      width:46, height:46, borderRadius:11, flexShrink:0,
                      background:'var(--gold-pale)', border:'1px solid var(--gold-dim)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem',
                    }}>{c.icon}</div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:5 }}>{c.title}</p>

                      {/* Lines with clickable links */}
                      {c.lines ? (
                        c.lines.map((l, j) => (
                          <a key={j} href={l.href}
                          target={l.external ? '_blank' : '_self'}
                          rel={l.external ? 'noopener noreferrer' : undefined}
                          style={{
                            display:'block', fontSize:'.86rem', color:'var(--white-60)',
                            lineHeight:1.7, transition:'color .2s', textDecoration:'none',
                            wordBreak:'break-word',
                          }}
                          onMouseEnter={e => e.target.style.color='var(--gold-lt)'}
                          onMouseLeave={e => e.target.style.color='var(--white-60)'}
                          >
                            {/* Phone icon for tel: links */}
                            {l.href.startsWith('tel:')    && <span style={{ marginRight:5 }}>📲</span>}
                            {l.href.startsWith('mailto:') && <span style={{ marginRight:5 }}>📧</span>}
                            {l.display}
                          </a>
                        ))
                      ) : (
                        <>
                          <p style={{ fontSize:'.86rem', color:'var(--white-60)', lineHeight:1.7, whiteSpace:'pre-line' }}>{c.text}</p>
                          {c.link && (
                            <a href={c.link} target="_blank" rel="noopener noreferrer" style={{
                              display:'inline-block', marginTop:6,
                              fontSize:'.74rem', fontWeight:600, color:'var(--gold)',
                              letterSpacing:'.08em', textDecoration:'none',
                              transition:'color .2s',
                            }}>
                              {c.linkLabel} →
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick WhatsApp support button */}
              <a href="https://wa.me/917094640322?text=Hi%201Ground%2C%20I%20need%20help%20with%20a%20property%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
                style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  marginTop:32, padding:'13px 24px',
                  background:'#25D366', color:'#fff',
                  borderRadius:10, fontWeight:700, fontSize:'.88rem',
                  textDecoration:'none', transition:'background .2s, transform .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#1ebe5d'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='#25D366'; e.currentTarget.style.transform='translateY(0)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.832L.057 23.854l6.196-1.426A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.727.857.897-3.62-.234-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* ── Contact Form ── */}
            <div className="contact-form-card" style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:18, padding:'36px 32px' }}>
              <h3 style={{ fontFamily:'var(--ff-d)', fontSize:'1.4rem', color:'var(--white)', marginBottom:24 }}>
                Send Us a <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Message</em>
              </h3>

              {/* Status message */}
              {msg.text && (
                <div style={{
                  padding:'13px 16px', borderRadius:10, marginBottom:20,
                  fontSize:'.85rem', lineHeight:1.5,
                  background: msg.type==='success' ? 'rgba(76,175,125,.12)' : 'rgba(224,85,85,.12)',
                  border:     msg.type==='success' ? '1px solid rgba(76,175,125,.3)' : '1px solid rgba(224,85,85,.3)',
                  color:      msg.type==='success' ? '#7de0a8' : '#ff8a8a',
                }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="form-row-2">
                  <div>
                    <label className="f-label">Your Name *</label>
                    <input className="f-input" required placeholder="Full name"
                      value={form.name} onChange={e => setForm(p => ({ ...p, name:e.target.value }))}/>
                  </div>
                  <div>
                    <label className="f-label">Email *</label>
                    <input className="f-input" type="email" required placeholder="you@email.com"
                      value={form.email} onChange={e => setForm(p => ({ ...p, email:e.target.value }))}/>
                  </div>
                </div>

                <div className="form-row-2">
                  <div>
                    <label className="f-label">Phone</label>
                    <input className="f-input" type="tel" placeholder="+91 XXXXXXXXXX"
                      value={form.phone} onChange={e => setForm(p => ({ ...p, phone:e.target.value }))}/>
                  </div>
                  <div>
                    <label className="f-label">Subject *</label>
                    <select className="f-select" required
                      value={form.subject} onChange={e => setForm(p => ({ ...p, subject:e.target.value }))}>
                      <option value="">Select subject</option>
                      <option>Buying a Property</option>
                      <option>Renting a Property</option>
                      <option>Listing my Property</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="f-label">Message *</label>
                  <textarea className="f-textarea" required placeholder="Tell us how we can help..."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message:e.target.value }))}
                    style={{ minHeight:120 }}/>
                </div>

                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ padding:'13px', width:'100%', justifyContent:'center', opacity:loading?.7:1, cursor:loading?'not-allowed':'pointer' }}>
                  {loading ? '⏳ Sending...' : 'Send Message →'}
                </button>

                <p style={{ fontSize:'.72rem', color:'var(--white-30)', textAlign:'center', marginTop:-6 }}>
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 56px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 600px) {
          .contact-hero {
            height: 280px !important;
          }

          .contact-grid {
            gap: 32px;
          }

          .contact-row {
            gap: 12px !important;
          }

          .contact-icon {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.05rem !important;
          }

          .contact-form-card {
            padding: 24px 18px !important;
            border-radius: 14px !important;
          }

          .form-row-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .whatsapp-btn {
            width: 100%;
            justify-content: center;
            margin-top: 24px !important;
          }
        }

        @media (min-width: 601px) {
          .form-row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  )
}