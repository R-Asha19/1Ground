import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropertyDetailModal from './PropertyDetailModal'


export default function PropertyCard({ property }) {
  const { user, toggleLike, isLiked } = useAuth()
  const [liked,       setLiked]   = useState(() => isLiked(property._id))
  const [showDetail,  setShowDetail] = useState(false)


  const handleLike = (e) => {
    e.stopPropagation()
    if (!user) return
    const nowLiked = toggleLike(property)
    setLiked(nowLiked)
  }

  const img = property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'

  const listingType = property.listingType || 'buy'  // 'buy' | 'rent'
  const navigate = useNavigate();

  const slug = `${property.title}-${property.city}-${property._id}`
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-');
  
  return (
    <>
      <div className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={() => setShowDetail(true)}>
        {/* Image */}
        <div style={{ position:'relative', height:210, overflow:'hidden' }}>
          <img
            src={img} alt={property.title}
            style={{ transition:'transform .6s var(--ease)' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          />
          {/* Listing type badge */}
          <span className={`badge ${listingType === 'rent' ? 'badge-rent' : 'badge-buy'}`} style={{ position:'absolute', top:12, left:12 }}>
            {listingType === 'rent' ? '🏠 For Rent' : '🏢 For Sale'}
          </span>
          {/* Wishlist */}
          <button
            onClick={handleLike}
            title={user ? 'Save property' : 'Login to save'}
            style={{
              position:'absolute', top:10, right:10,
              width:34, height:34, borderRadius:'50%',
              background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)',
              border:'none', cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center',
              fontSize:'1rem', transition:'transform .2s',
            }}
          >
            {liked ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'18px 20px' }}>
          {/* Stars */}
          <div style={{ color:'var(--gold)', fontSize:'.72rem', marginBottom:6, letterSpacing:2 }}>★★★★★</div>
          <h3 style={{
            fontFamily:'var(--ff-d)', fontSize:'1.08rem', fontWeight:600,
            color:'var(--white)', marginBottom:5, lineHeight:1.3,
          }}>{property.title}</h3>
          <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.75rem', color:'var(--white-60)', marginBottom:8 }}>
            📍 {property.locality ? `${property.locality}, ` : ''}{property.city}
          </p>
          <p style={{ fontSize:'.95rem', fontWeight:700, color:'var(--gold-lt)', marginBottom:10 }}>
            ₹{Number(property.price).toLocaleString('en-IN')}
            <span style={{ fontSize:'.72rem', fontWeight:400, color:'var(--white-30)', marginLeft:4 }}>
              {listingType === 'rent' ? '/month' : ''}
            </span>
          </p>
          {/* Meta */}
          <div style={{ display:'flex', gap:14, fontSize:'.72rem', color:'var(--white-60)', marginBottom:16, flexWrap:'wrap' }}>
            {property.bedrooms  && <span>🛏 {property.bedrooms} BHK</span>}
            {property.areaSqft  && <span>📐 {property.areaSqft} sqft</span>}
            {property.furnished && <span>🛋 Furnished</span>}
          </div>

          {/* Enquire button */}
          <button
          onClick={e => {
          e.stopPropagation();
             setShowDetail(true);   // opens the popup, same as clicking the card
          }}          className="btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:'11px' }}
          >
            Enquire Property →
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <PropertyDetailModal
          property={property}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
}
