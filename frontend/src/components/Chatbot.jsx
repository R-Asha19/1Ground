import { useState, useRef, useEffect } from 'react'

// ── Knowledge Base ─────────────────────────────────────────────
const getReply = (input) => {
  const msg = input.toLowerCase().trim()

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|vanakkam|helo|hii|hai)/.test(msg))
    return `👋 Hello! Welcome to 1Ground — India's trusted real estate platform.\n\nI can help you with:\n• 🏠 Buying or renting a property\n• 📋 Listing your property\n• 📞 Contact & working hours\n• 📄 Documents needed\n• 💰 Home loans & pricing\n• 🗺️ Chennai area guide\n\nWhat would you like to know?`

  if (/thank|thanks|thank you|thx/.test(msg))
    return `You're welcome! 😊 Feel free to ask anything else about properties.\n\nYou can also reach us at:\n📞 +91 70946 40322\n✉️ enquiry1ground@gmail.com`

  if (/contact|phone|number|call|email|mail|address|office|location|where are you|reach/.test(msg))
    return `📞 **Contact 1Ground:**\n\n📞 +91 70946 40322\n✉️ enquiry1ground@gmail.com\n\n🕐 **Working Hours:**\nMon – Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 4:00 PM\n\n💬 [Chat on WhatsApp](https://wa.me/917094640322)`

  if (/hour|timing|time|open|close|working|available|when/.test(msg))
    return `🕐 **1Ground Working Hours:**\n\n• Monday – Saturday: 9:00 AM – 7:00 PM\n• Sunday: 10:00 AM – 4:00 PM\n\nFor urgent queries, WhatsApp us at +91 70946 40322!`

  if (/about|what is 1ground|who are you|tell me about|company|platform|1ground/.test(msg))
    return `🏢 **About 1Ground:**\n\n1Ground is India's trusted real estate platform connecting buyers, sellers, and renters across 200+ cities.\n\n✅ No middlemen, no hidden fees\n✅ Verified property listings\n✅ Direct owner-to-buyer connect\n✅ Covering Chennai, Mumbai, Bangalore & more\n\nOur office is in Chromepet, Chennai. We make property transactions simple and transparent!`

  if (/buy|purchase|buying|want to buy|looking to buy/.test(msg))
    return `🏠 **Buying a Property on 1Ground:**\n\n1️⃣ Browse listings on our [Buy page](/buy)\n2️⃣ Filter by city, budget, and property type\n3️⃣ View property details and images\n4️⃣ Contact the owner directly via WhatsApp\n5️⃣ Schedule a site visit\n6️⃣ Negotiate and finalise the deal\n\n💡 Always verify documents before paying any advance.\n\nNeed help? Call +91 70946 40322!`

  if (/rent|rental|renting|tenant|looking for rent|flat for rent|house for rent|pg/.test(msg))
    return `🏠 **Renting a Property on 1Ground:**\n\n1️⃣ Visit our [Rent page](/rent)\n2️⃣ Filter by locality, budget & BHK size\n3️⃣ Contact owner directly — no brokerage!\n4️⃣ Visit the property\n5️⃣ Sign rental agreement\n6️⃣ Move in!\n\n📋 **Documents needed for renting:**\n• Aadhaar card\n• PAN card\n• Last 3 months salary slips\n• Passport-size photos\n\nCall us: +91 70946 40322`

  if (/sell|list|listing|post property|add property|selling|owner|landlord/.test(msg))
    return `📋 **List Your Property on 1Ground:**\n\n1️⃣ Register as an Owner on our platform\n2️⃣ Go to [Sell/List Property](/sell)\n3️⃣ Fill in property details (title, location, price, photos)\n4️⃣ Submit — our team reviews within 24 hours\n5️⃣ Your property goes live for thousands of buyers!\n\n✅ **It's completely free to list!**\n\nNeed help? Call +91 70946 40322`

  if (/document|doc|paper|legal|registration|stamp duty|agreement|what do i need/.test(msg))
    return `📄 **Documents Needed to Buy Property in India:**\n\n**From Seller:**\n• Sale deed / Title deed\n• Encumbrance certificate\n• Khata certificate\n• Property tax receipts\n• Approved building plan\n\n**From Buyer:**\n• Aadhaar card\n• PAN card\n• Bank statements (last 6 months)\n• Passport-size photos\n\n⚠️ Always consult a property lawyer before signing.\n\nCall us for guidance: +91 70946 40322`

  if (/loan|home loan|bank|finance|emi|mortgage|interest rate|housing loan/.test(msg))
    return `💰 **Home Loan Guidance:**\n\n**Eligibility (general):**\n• Salaried: Min ₹25,000/month income\n• CIBIL score: 750+ recommended\n• Age: 21–65 years\n\n**Top Banks:**\n• SBI Home Loan\n• HDFC Home Loan\n• ICICI Bank\n• LIC Housing Finance\n\n**Typical rates:** 8.5% – 10.5% per annum\n\n💡 Use a bank EMI calculator to estimate monthly payments.\n\nFor help: +91 70946 40322`

  if (/price|cost|budget|how much|expensive|cheap|affordable|rate|₹|rs\.|rupee/.test(msg))
    return `💰 **Property Prices in Chennai (approx.):**\n\n**For Rent:**\n• 1 BHK: ₹7,000 – ₹15,000/month\n• 2 BHK: ₹12,000 – ₹28,000/month\n• 3 BHK: ₹20,000 – ₹50,000/month\n\n**For Sale:**\n• 1 BHK: ₹25L – ₹50L\n• 2 BHK: ₹45L – ₹90L\n• 3 BHK: ₹75L – ₹1.5Cr\n• Villas: ₹1Cr – ₹5Cr+\n\n📍 Premium: Anna Nagar, Adyar, OMR\n📍 Affordable: Chromepet, Tambaram, Ambattur\n\nBrowse listings: [Buy](/buy) | [Rent](/rent)`

  if (/area|locality|chromepet|velachery|anna nagar|omr|tambaram|porur|adyar|t nagar|nungambakkam|ambattur|perambur|chennai|which area/.test(msg))
    return `🗺️ **Chennai Locality Guide:**\n\n**Premium Areas:**\n• Anna Nagar — well-planned, family-friendly\n• Adyar — near beach, upscale living\n• T Nagar — commercial hub\n• Nungambakkam — corporate, diplomatic zone\n\n**Mid-Range:**\n• Velachery — IT corridor, great connectivity\n• OMR — IT parks, many apartments\n• Porur — west Chennai, growing fast\n\n**Affordable:**\n• Chromepet — 🏠 Our office is here!\n• Tambaram — family-friendly\n• Ambattur — budget homes\n• Perambur — good value\n\nCall for area advice: +91 70946 40322`

  if (/nri|non resident|abroad|foreign|usa|uk|dubai|overseas|outside india/.test(msg))
    return `🌍 **NRI Property Services:**\n\n1Ground helps Non-Resident Indians buy, sell, or rent property in India.\n\n**Key points for NRIs:**\n• NRIs can buy residential & commercial property\n• Power of Attorney needed if buying remotely\n• NRI Home Loans available at major banks\n• FEMA regulations apply for repatriation\n\n**Documents needed:**\n• Passport copy\n• OCI/PIO card\n• Overseas bank statements\n• NRE/NRO account details\n\nContact us: +91 70946 40322\nenquiry1ground@gmail.com`

  if (/apartment|flat|villa|studio|penthouse|plot|land|commercial|shop|office|bhk|type of/.test(msg))
    return `🏘️ **Property Types on 1Ground:**\n\n🏢 **Apartment/Flat** — Most common, in housing societies\n🏡 **Villa** — Independent house with garden\n🛋️ **Studio** — Compact single-room, ideal for singles\n🌟 **Penthouse** — Luxury top-floor apartment\n🌿 **Plot/Land** — Empty land for construction\n🏪 **Commercial** — Shops, offices, warehouses\n\n**BHK Guide:**\n• 1 BHK — ideal for singles/couples\n• 2 BHK — small families\n• 3 BHK — most popular for families\n• 4 BHK+ — large families / luxury\n\nBrowse: [Buy](/buy) | [Rent](/rent)`

  if (/vastu|direction|facing|north|south|east|west|vastu shastra/.test(msg))
    return `🧭 **Basic Vastu Tips:**\n\n✅ **Good:**\n• North or East facing main door\n• Kitchen in South-East\n• Master bedroom in South-West\n• Puja room in North-East\n\n❌ **Avoid:**\n• Toilet in North-East corner\n• Kitchen in North-East\n\n💡 Many buyers prefer North or East facing for Vastu compliance.\n\nFor more guidance: +91 70946 40322`

  if (/stamp duty|registration charge|registration fee|govt fee/.test(msg))
    return `📜 **Stamp Duty & Registration (Tamil Nadu):**\n\n• **Stamp Duty:** 7% of property value\n• **Registration Fee:** 4% of property value\n• **Total:** ~11% of the property value\n\n**Example — ₹50L property:**\n• Stamp Duty: ₹3.5L\n• Registration: ₹2L\n• Total extra: ₹5.5L\n\n⚠️ Verify current rates at TN Registration Dept.\n\nFor help: +91 70946 40322`

  if (/instagram|youtube|social media|follow|facebook/.test(msg))
    return `📱 **Follow 1Ground:**\n\n📸 Instagram: [1ground.in](https://www.instagram.com/1ground.in/)\n▶️ YouTube: [Chennai Property Listing](https://www.youtube.com/@chennaipropertylisting1gro970)\n\nFollow us for property tours, market updates, and real estate tips!`

  if (/whatsapp|whats app|chat|message us/.test(msg))
    return `💬 **WhatsApp Us:**\n\n[Click to chat on WhatsApp](https://wa.me/917094640322?text=Hi%201Ground%2C%20I%20need%20help%20with%20a%20property%20enquiry.)\n\n+91 70946 40322\n\nWe respond within a few hours (Mon–Sat 9AM–7PM).`

  if (/go to|take me|navigate|page|where|find|how to|website/.test(msg))
    return `🧭 **Navigate 1Ground:**\n\n• 🏠 [Home](/)\n• 🛒 [Buy Property](/buy)\n• 🏠 [Rent Property](/rent)\n• 📋 [Sell/List Property](/sell)\n• ℹ️ [About Us](/about)\n• 📞 [Contact Us](/contact)\n\nWhat are you looking for?`

  if (/complaint|problem|issue|wrong|fraud|fake|scam|report/.test(msg))
    return `⚠️ **Report an Issue:**\n\nWe take all complaints seriously at 1Ground.\n\nPlease contact us directly:\n📞 +91 70946 40322\n✉️ enquiry1ground@gmail.com\n\n📍 Office: 61/87, Station Rd, Chromepet, Chennai\n\nMon–Sat 9AM–7PM. We'll resolve your concern ASAP.`

  return `🤔 I'm not sure about that, but I'm happy to help!\n\nHere's what I can assist with:\n• 🏠 Buying or renting a property\n• 📋 Listing your property\n• 📞 Contact details & working hours\n• 📄 Documents & legal process\n• 💰 Home loans & pricing\n• 🗺️ Chennai area guide\n\nOr contact us directly:\n📞 +91 70946 40322\n✉️ enquiry1ground@gmail.com`
}

const QUICK_REPLIES = [
  'How do I buy a property?',
  'How do I list my property?',
  'Contact details',
  'Chennai area guide',
  'Home loan help',
  'Documents needed',
]

function MessageText({ text }) {
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith('http')
          return (
            <a key={i} href={linkMatch[2]}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{ color: 'var(--gold)', textDecoration: 'underline' }}
            >{linkMatch[1]}</a>
          )
        }
        const boldMatch = part.match(/\*\*(.*?)\*\*/)
        if (boldMatch) return <strong key={i} style={{ color: 'var(--white)', fontWeight: 700 }}>{boldMatch[1]}</strong>
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm the 1Ground Assistant. I can help you with buying, renting, or selling property in India.\n\nWhat can I help you with today?" },
  ])
  const [input,   setInput]   = useState('')
  const [typing,  setTyping]  = useState(false)
  const [unread,  setUnread]  = useState(1)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text) => {
    const userText = (text || input).trim()
    if (!userText || typing) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userText }])
    setTyping(true)
    setTimeout(() => {
      const reply = getReply(userText)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setTyping(false)
    }, 400 + Math.random() * 500)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat with 1Ground Assistant"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #b8860b)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(212,175,55,0.55)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.4)' }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1a1a">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#e05555', color: '#fff',
            borderRadius: '50%', width: 20, height: 20,
            fontSize: '.65rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--black)',
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 98, right: 28, zIndex: 9998,
          width: 360, height: 520,
          background: 'var(--black-soft)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,.6)',
          overflow: 'hidden',
          animation: 'chatSlideUp .25s ease',
        }}>

          <div style={{
            padding: '16px 18px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), #b8860b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>🏠</div>
            <div>
              <p style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', margin: 0 }}>1Ground Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf7d' }} />
                <span style={{ fontSize: '.68rem', color: 'var(--white-30)' }}>Online · Always available</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--white-30)', cursor: 'pointer', fontSize: '1rem', padding: 4 }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 13px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, var(--gold), #b8860b)' : 'rgba(255,255,255,0.07)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                  color: m.role === 'user' ? '#1a1a1a' : 'var(--white-60)',
                  fontSize: '.82rem', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  <MessageText text={m.content} />
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px', borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)',
                      animation: `typingDot .9s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => send(q)} style={{
                    padding: '6px 11px', borderRadius: 20, background: 'transparent',
                    border: '1px solid rgba(212,175,55,0.4)', color: 'var(--gold)',
                    fontSize: '.72rem', cursor: 'pointer', transition: 'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-pale)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about properties, areas, documents..."
              rows={1}
              style={{
                flex: 1, resize: 'none', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--white)', fontSize: '.82rem',
                fontFamily: 'var(--ff-b)', lineHeight: 1.5,
                outline: 'none', maxHeight: 80, overflowY: 'auto',
              }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
              }}
            />
            <button onClick={() => send()} disabled={!input.trim() || typing}
              style={{
                width: 38, height: 38, borderRadius: '50%', border: 'none',
                background: input.trim() && !typing ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                color: input.trim() && !typing ? '#1a1a1a' : 'var(--white-30)',
                cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s', flexShrink: 0,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>

          <div style={{ padding: '6px 14px 10px', textAlign: 'center' }}>
            <p style={{ fontSize: '.6rem', color: 'var(--white-30)' }}>
              1Ground Assistant · <a href="/contact" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Talk to a human →</a>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}