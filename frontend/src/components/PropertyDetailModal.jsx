import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PropertyDetailModal({ property: p, onClose }) {
  const { user, addContacted } = useAuth()
  const [activeImg, setActiveImg] = useState(0)

  const images = p.images?.length
    ? p.images
    : [{ url:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80' }]

  const listingType = p.listingType || 'buy'

  const handleWhatsApp = () => {
    const phone   = (p.whatsappNumber || '').replace(/[\s+\-()]/g, '')
    const message = encodeURIComponent(
      listingType === 'rent'
        ? `Hi! I'm interested in renting your property "${p.title}" listed on 1Ground in ${p.city}. Could you share more details?`
        : `Hi! I'm interested in buying your property "${p.title}" listed on 1Ground in ${p.city}. Could you share more details?`
    )
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
      if (user) addContacted(p)
    } else {
      alert('Owner WhatsApp number not available.')
    }
  }

  const amenityIcons = {
    'WiFi':'📶', 'Parking':'🚗', 'Gym':'🏋️', 'Swimming Pool':'🏊',
    'Security':'🔒', 'Lift':'🛗', 'Power Backup':'🔋', 'Garden':'🌿',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box prop-detail-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Image gallery ── */}
        <div className="prop-img-wrap">
          <img
            src={images[activeImg]?.url}
            alt={p.title}
            className="prop-main-img"
          />
          {/* Overlay gradient */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)' }}/>

          {/* Close */}
          <button className="modal-close" onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:2 }}>✕</button>

          {/* Listing badge */}
          <span className={`badge ${listingType === 'rent' ? 'badge-rent' : 'badge-buy'}`} style={{ position:'absolute', top:14, left:14, zIndex:2 }}>
            {listingType === 'rent' ? '🏠 For Rent' : '🏢 For Sale'}
          </span>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="prop-thumbs">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width:44, height:33, borderRadius:5, overflow:'hidden',
                  border:'none', padding:0, flexShrink:0,
                  outline: i === activeImg ? '2px solid var(--gold)' : 'none', cursor:'pointer',
                }}>
                  <img src={img.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                </button>
              ))}
            </div>
          )}

          {/* Title over image */}
          <div style={{ position:'absolute', bottom: images.length > 1 ? 52 : 16, left:16, right:16, zIndex:2 }}>
            <h2 style={{ fontFamily:'var(--ff-d)', fontSize:'clamp(1.1rem,4vw,1.7rem)', fontWeight:500, color:'var(--white)', lineHeight:1.2 }}>{p.title}</h2>
            <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.7)', marginTop:4 }}>
              📍 {p.locality ? `${p.locality}, ` : ''}{p.city}{p.pincode ? ` - ${p.pincode}` : ''}
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="prop-detail-body">

          {/* Price + meta */}
          <div className="prop-price-row">
            <div>
              <p style={{ fontSize:'clamp(1.2rem,4vw,1.5rem)', fontWeight:700, color:'var(--gold-lt)', fontFamily:'var(--ff-d)' }}>
                ₹{Number(p.price).toLocaleString('en-IN')}
                {listingType === 'rent' && <span style={{ fontSize:'.85rem', color:'var(--white-30)', fontWeight:400 }}>/month</span>}
              </p>
              {p.negotiable && <span style={{ fontSize:'.7rem', color:'var(--green)' }}>✔ Price Negotiable</span>}
            </div>
            <div className="prop-meta-chips">
              {p.bedrooms  && <span className="meta-chip">🛏 {p.bedrooms} BHK</span>}
              {p.bathrooms && <span className="meta-chip">🚿 {p.bathrooms} Bath</span>}
              {p.areaSqft  && <span className="meta-chip">📐 {p.areaSqft} sqft</span>}
              {p.furnished && <span className="meta-chip">🛋 Furnished</span>}
            </div>
          </div>

          {/* Description */}
          {p.description && (
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:8 }}>About this Property</p>
              <p style={{ fontSize:'.85rem', color:'var(--white-60)', lineHeight:1.75 }}>{p.description}</p>
            </div>
          )}

          {/* Amenities */}
          {p.amenities?.length > 0 && (
            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Amenities</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {p.amenities.map(a => (
                  <span key={a} style={{ background:'var(--gold-pale)', border:'1px solid var(--gold-dim)', borderRadius:8, padding:'6px 13px', fontSize:'.75rem', color:'var(--gold-lt)' }}>
                    {amenityIcons[a] || '✓'} {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner info */}
          {p.owner && (
            <div className="prop-owner-row">
              <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--gold-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>👤</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, color:'var(--white)', fontSize:'.88rem' }}>{p.owner.name}</p>
                <p style={{ fontSize:'.75rem', color:'var(--white-30)' }}>Property Owner</p>
                {(p.owner.phone || p.whatsappNumber) && (
                  <p style={{ fontSize:'.78rem', color:'var(--white-60)', marginTop:3 }}>
                    📞 {p.owner.phone || p.whatsappNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <button onClick={handleWhatsApp} className="btn-wa" style={{ fontSize:'.9rem', width:'100%', justifyContent:'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.832L.057 23.854l6.196-1.426A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.727.857.897-3.62-.234-.374A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Chat on WhatsApp with Owner
          </button>

          <p style={{ textAlign:'center', fontSize:'.72rem', color:'var(--white-30)', marginTop:10 }}>
            This will open WhatsApp with a pre-filled message to the property owner
          </p>
        </div>
      </div>

      <style>{`
        /* ── Modal box ── */
        .prop-detail-modal {
          max-width: 780px;
          width: calc(100% - 24px);
          padding: 0;
          overflow: hidden;
          max-height: 92vh;
          overflow-y: auto;
        }

        /* ── Image wrapper ── */
        .prop-img-wrap {
          position: relative;
          width: 100%;
          height: 300px;
          background: #0a0a0a;
          overflow: hidden;
        }
        .prop-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Thumbnails ── */
        .prop-thumbs {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          max-width: calc(100% - 32px);
          overflow-x: auto;
          padding-bottom: 2px;
        }

        /* ── Content padding ── */
        .prop-detail-body {
          padding: 22px 24px;
        }

        /* ── Price + chips row ── */
        .prop-price-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .prop-meta-chips {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }
        .meta-chip {
          background: var(--white-10);
          border-radius: 8px;
          padding: 6px 11px;
          font-size: .75rem;
          color: var(--white-60);
          white-space: nowrap;
        }

        /* ── Owner row ── */
        .prop-owner-row {
          background: var(--white-10);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 22px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        /* ── MOBILE ── */
        @media (max-width: 540px) {
          .prop-img-wrap      { height: 220px; }
          .prop-detail-body   { padding: 16px; }
          .prop-price-row     { flex-direction: column; gap: 10px; }
          .prop-meta-chips    { gap: 6px; }
          .meta-chip          { font-size: .72rem; padding: 5px 9px; }
        }
      `}</style>
    </div>
  )
}