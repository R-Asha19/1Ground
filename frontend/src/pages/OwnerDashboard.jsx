import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Toast from '../components/Toast'
import { ALL_STATES, getCitiesForState } from '../data/indiaStatesCities'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

const AMENITIES = ['WiFi','Parking','Gym','Swimming Pool','Security','Lift','Power Backup','Garden']
const EMPTY = {
  title:'', description:'', listingType:'rent', type:'apartment', status:'available',
  state:'', city:'', locality:'', pincode:'', price:'', bedrooms:1, bathrooms:1,
  areaSqft:'', whatsappNumber:'', furnished:false, negotiable:false, amenities:[], images:null,
}

export default function OwnerDashboard() {
   useSEO(SEO.ownerDashboard)
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [props,   setProps]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editId,  setEditId]  = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [formMsg, setFormMsg] = useState({ text:'', type:'' })
  const [toast,   setToast]   = useState('')
  const [delId,   setDelId]   = useState(null)
  const [preview, setPreview] = useState([])
  const [filter,  setFilter]  = useState('all') // all | rent | buy | available | rented

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/properties/owner/my')
      setProps(res.data.properties || [])
    } catch { } finally { setLoading(false) }
  }

  const openAdd = () => {
    setEditId(null)
    setForm({ ...EMPTY, whatsappNumber: user?.phone || '' })
    setPreview([]); setFormMsg({ text:'', type:'' }); setModal(true)
  }

  const openEdit = (p) => {
    setEditId(p._id)
    setForm({
      title: p.title, description: p.description,
      listingType: p.listingType || 'rent',
      type: p.type, status: p.status,
      state: p.state || '', city: p.city, locality: p.locality || '', pincode: p.pincode || '',
      price: p.price, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      areaSqft: p.areaSqft || '', whatsappNumber: p.whatsappNumber || '',
      furnished: p.furnished, negotiable: p.negotiable,
      amenities: p.amenities || [], images: null,
    })
    setPreview(p.images?.map(i => i.url) || [])
    setFormMsg({ text:'', type:'' }); setModal(true)
  }

  // When State changes, clear City if it doesn't belong to the new state
  // (e.g. editing a property and switching states) so a stale/mismatched
  // city can't silently get saved.
  const handleStateChange = (newState) => {
    setForm(p => {
      const validCities = newState ? getCitiesForState(newState) : []
      const cityStillValid = validCities.includes(p.city)
      return { ...p, state: newState, city: cityStillValid ? p.city : '' }
    })
  }

  const citiesForSelectedState = form.state ? getCitiesForState(form.state) : []

  const handleImages = (files) => {
    setForm(p => ({ ...p, images: files }))
    setPreview([])
    Array.from(files).forEach(f => {
      const r = new FileReader()
      r.onload = e => setPreview(prev => [...prev, e.target.result])
      r.readAsDataURL(f)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormMsg({ text:'', type:'' })
    if (!form.state) {
      setFormMsg({ text: 'Please select a state', type: 'error' }); setSaving(false); return
    }
    if (!form.city) {
      setFormMsg({ text: 'Please select a city', type: 'error' }); setSaving(false); return
    }
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images')    { if (v) Array.from(v).forEach(f => fd.append('images', f)) }
        else if (k === 'amenities') fd.append('amenities', JSON.stringify(v))
        else fd.append(k, v)
      })
      if (editId) await api.put(`/properties/${editId}`,   fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else        await api.post('/properties',             fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setModal(false); setToast(editId ? '✅ Property updated!' : '✅ Property posted!'); load()
    } catch (err) {
      setFormMsg({ text: err.response?.data?.message || 'Something went wrong', type: 'error' })
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/properties/${delId}`)
      setDelId(null); setToast('🗑 Property deleted'); load()
    } catch { setToast('❌ Delete failed') }
  }

  const toggleAmenity = a => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }))

  const filtered = props.filter(p => {
    if (filter === 'all') return true
    if (filter === 'rent' || filter === 'buy') return p.listingType === filter
    return p.status === filter
  })

  const stats = {
    total:  props.length,
    rent:   props.filter(p => p.listingType === 'rent').length,
    buy:    props.filter(p => p.listingType === 'buy').length,
    rented: props.filter(p => p.status === 'rented').length,
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--black)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><span>1</span>Ground</div>
        <Link to="/"           className="s-link">🌐 View Site</Link>
        <Link to="/owner-dashboard" className="s-link active">🏠 My Properties</Link>
        <Link to="/profile"    className="s-link">👤 My Profile</Link>
        <div className="sidebar-footer">
          <div style={{ fontSize:'.75rem', color:'var(--white-30)', padding:'8px 14px' }}>🔑 {user?.name}</div>
          <button onClick={() => { logout(); navigate('/') }} className="s-link" style={{ color:'#ff8a8a' }}>🚪 Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
          <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)' }}>
            My <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Properties</em>
          </h1>
          <button onClick={openAdd} className="btn-primary">+ Add New Property</button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {[
            { n:stats.total,  l:'Total',      icon:'🏠' },
            { n:stats.rent,   l:'For Rent',   icon:'🔑' },
            { n:stats.buy,    l:'For Sale',   icon:'💰' },
            { n:stats.rented, l:'Rented Out', icon:'✅' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:'1.4rem', marginBottom:8 }}>{s.icon}</div>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
          {[
            { id:'all',       label:'All' },
            { id:'rent',      label:'For Rent' },
            { id:'buy',       label:'For Sale' },
            { id:'available', label:'Available' },
            { id:'rented',    label:'Rented/Sold' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'7px 16px', borderRadius:20, cursor:'pointer',
              fontFamily:'var(--ff-b)', fontSize:'.76rem', fontWeight:600,
              background: filter===f.id ? 'var(--gold)' : 'var(--black-card)',
              color:      filter===f.id ? 'var(--black)' : 'var(--white-60)',
              border:     filter===f.id ? 'none' : '1px solid var(--border)',
              transition:'all .2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Table */}
        <div className="tbl-wrap">
          <div className="tbl-head">
            <h3>{filtered.length} {filter==='all'?'total':filter} listings</h3>
          </div>
          {loading ? <div className="spinner"/> : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--white-60)' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🏠</div>
              <p style={{ marginBottom:16 }}>No properties yet.</p>
              <button onClick={openAdd} className="btn-primary">+ Post First Property</button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table>
                <thead><tr>
                  <th>Property</th><th>Type</th><th>Listing</th>
                  <th>Price</th><th>City</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          {p.images?.[0]
                            ? <img src={p.images[0].url} alt="" style={{ width:50, height:38, borderRadius:7, objectFit:'cover', flexShrink:0 }}/>
                            : <div style={{ width:50, height:38, borderRadius:7, background:'var(--black-el)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🏠</div>
                          }
                          <div>
                            <div style={{ fontWeight:600, color:'var(--white)', fontSize:'.84rem' }}>{p.title}</div>
                            <div style={{ fontSize:'.7rem', color:'var(--white-30)' }}>{p.bedrooms} BHK · {p.areaSqft||'—'} sqft</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize:'.78rem', color:'var(--white-60)', textTransform:'capitalize' }}>{p.type}</td>
                      <td><span className={`badge ${p.listingType==='rent'?'badge-rent':'badge-sell'}`}>{p.listingType==='rent'?'For Rent':'For Sale'}</span></td>
                      <td style={{ fontWeight:600, color:'var(--gold-lt)' }}>₹{Number(p.price).toLocaleString('en-IN')}{p.listingType==='rent'?'/mo':''}</td>
                      <td style={{ fontSize:'.78rem', color:'var(--white-60)' }}>{p.city}{p.state ? `, ${p.state}` : ''}</td>
                      <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:7 }}>
                          <button onClick={() => openEdit(p)}     className="btn-tbl btn-edit">✏️ Edit</button>
                          <button onClick={() => setDelId(p._id)} className="btn-tbl btn-del" >🗑 Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── ADD / EDIT MODAL ── */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth:680 }}>
            <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            <h2 style={{ fontFamily:'var(--ff-d)', fontSize:'1.5rem', color:'var(--white)', marginBottom:22 }}>
              {editId ? 'Edit' : 'Post New'} <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Property</em>
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13 }}>

                {/* ── Listing Type (Sell or Rent) ── */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">I want to *</label>
                  <div style={{ display:'flex', gap:10, marginTop:4 }}>
                    {[
                      { v:'rent', label:'🏠 Rent Out',  desc:'Monthly rental income' },
                      { v:'buy',  label:'💰 Sell',      desc:'One-time sale' },
                    ].map(l => (
                      <button key={l.v} type="button" onClick={() => setForm(p => ({ ...p, listingType:l.v }))} style={{
                        flex:1, padding:'13px 16px', borderRadius:10, cursor:'pointer',
                        fontFamily:'var(--ff-b)', textAlign:'left',
                        border: form.listingType===l.v ? '1.5px solid var(--gold)' : '1.5px solid var(--border)',
                        background: form.listingType===l.v ? 'var(--gold-pale)' : 'var(--black-el)',
                        color: form.listingType===l.v ? 'var(--gold-lt)' : 'var(--white-60)',
                        transition:'all .2s',
                      }}>
                        <div style={{ fontWeight:700, marginBottom:2 }}>{l.label}</div>
                        <div style={{ fontSize:'.72rem', opacity:.7 }}>{l.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">Property Title *</label>
                  <input className="f-input" required placeholder="e.g. Spacious 3BHK near Metro" value={form.title} onChange={e => setForm(p => ({ ...p, title:e.target.value }))}/>
                </div>
                {/* Description */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">Description *</label>
                  <textarea className="f-textarea" required placeholder="Describe the property, surroundings, nearby landmarks..." value={form.description} onChange={e => setForm(p => ({ ...p, description:e.target.value }))}/>
                </div>
                {/* Property Type */}
                <div>
                  <label className="f-label">Property Type *</label>
                  <select className="f-select" value={form.type} onChange={e => setForm(p => ({ ...p, type:e.target.value }))}>
                    {['apartment','villa','studio','penthouse','plot','commercial'].map(t => <option key={t} value={t} style={{ textTransform:'capitalize' }}>{t}</option>)}
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label className="f-label">Status</label>
                  <select className="f-select" value={form.status} onChange={e => setForm(p => ({ ...p, status:e.target.value }))}>
                    <option value="available">Available</option>
                    <option value="rented">Rented / Sold</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
                {/* State */}
                <div>
                  <label className="f-label">State *</label>
                  <select className="f-select" required value={form.state} onChange={e => handleStateChange(e.target.value)}>
                    <option value="">Select State</option>
                    {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* City — depends on selected State */}
                <div>
                  <label className="f-label">City *</label>
                  <select
                    className="f-select"
                    required
                    value={form.city}
                    onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    disabled={!form.state}
                    style={!form.state ? { opacity:.5, cursor:'not-allowed' } : undefined}
                  >
                    <option value="">{form.state ? 'Select City' : 'Select a state first'}</option>
                    {citiesForSelectedState.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Locality */}
                <div>
                  <label className="f-label">Locality</label>
                  <input className="f-input" placeholder="Bandra West" value={form.locality} onChange={e => setForm(p => ({ ...p, locality:e.target.value }))}/>
                </div>
                {/* Pincode */}
                <div>
                  <label className="f-label">Pincode</label>
                  <input className="f-input" placeholder="400050" value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode:e.target.value }))}/>
                </div>
                {/* Price */}
                <div>
                  <label className="f-label">{form.listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Sale Price (₹) *'}</label>
                  <input className="f-input" type="number" required placeholder={form.listingType==='rent'?'25000':'5000000'} value={form.price} onChange={e => setForm(p => ({ ...p, price:e.target.value }))}/>
                </div>
                {/* Bedrooms */}
                <div>
                  <label className="f-label">Bedrooms</label>
                  <input className="f-input" type="number" min="0" value={form.bedrooms} onChange={e => setForm(p => ({ ...p, bedrooms:e.target.value }))}/>
                </div>
                {/* Bathrooms */}
                <div>
                  <label className="f-label">Bathrooms</label>
                  <input className="f-input" type="number" min="0" value={form.bathrooms} onChange={e => setForm(p => ({ ...p, bathrooms:e.target.value }))}/>
                </div>
                {/* Area */}
                <div>
                  <label className="f-label">Area (sqft)</label>
                  <input className="f-input" type="number" placeholder="850" value={form.areaSqft} onChange={e => setForm(p => ({ ...p, areaSqft:e.target.value }))}/>
                </div>
                {/* WhatsApp */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">WhatsApp Number * <span style={{ color:'var(--white-30)', fontWeight:400, letterSpacing:0, textTransform:'none', fontSize:'.7rem' }}>(buyers / renters will contact you here)</span></label>
                  <input className="f-input" required placeholder="919876543210" value={form.whatsappNumber} onChange={e => setForm(p => ({ ...p, whatsappNumber:e.target.value }))}/>
                </div>
                {/* Checkboxes */}
                <div style={{ gridColumn:'1/-1', display:'flex', gap:24 }}>
                  {[['furnished','🛋 Furnished'],['negotiable','💬 Price Negotiable']].map(([key,label]) => (
                    <label key={key} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.84rem', color:'var(--white-60)' }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(p => ({ ...p, [key]:e.target.checked }))} style={{ accentColor:'var(--gold)', width:15, height:15 }}/>
                      {label}
                    </label>
                  ))}
                </div>
                {/* Amenities */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">Amenities</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
                    {AMENITIES.map(a => (
                      <label key={a} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:'.78rem', color:'var(--white-60)', padding:'6px 10px', borderRadius:8, border:`1px solid ${form.amenities.includes(a)?'var(--gold)':'var(--border)'}`, background:form.amenities.includes(a)?'var(--gold-pale)':'transparent', transition:'all .2s' }}>
                        <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ accentColor:'var(--gold)', display:'none' }}/> {a}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Images */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="f-label">Property Images (max 10)</label>
                  <input className="f-input" type="file" multiple accept="image/*" onChange={e => handleImages(e.target.files)} style={{ padding:'8px 12px' }}/>
                  {preview.length > 0 && (
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
                      {preview.map((src,i) => <img key={i} src={src} alt="" style={{ width:72, height:54, objectFit:'cover', borderRadius:7, border:'1px solid var(--border)' }}/>)}
                    </div>
                  )}
                </div>
              </div>

              {formMsg.text && (
                <p style={{ fontSize:'.78rem', marginTop:12, padding:'10px 14px', borderRadius:8,
                  color: formMsg.type==='error'?'#ff8a8a':'#7de0a8',
                  background: formMsg.type==='error'?'rgba(224,85,85,.1)':'rgba(76,175,125,.1)',
                  border:`1px solid ${formMsg.type==='error'?'rgba(224,85,85,.25)':'rgba(76,175,125,.25)'}`,
                }}>{formMsg.text}</p>
              )}

              <button type="submit" disabled={saving} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:13, marginTop:16, opacity:saving?.7:1 }}>
                {saving ? 'Saving...' : editId ? '✅ Update Property' : '🚀 Post Property'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="modal-overlay">
          <div style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:16, padding:'32px 28px', maxWidth:340, textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🗑</div>
            <h3 style={{ color:'var(--white)', marginBottom:8 }}>Delete Property?</h3>
            <p style={{ color:'var(--white-60)', fontSize:'.82rem', marginBottom:24 }}>This will permanently remove the listing and cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setDelId(null)} style={{ padding:'10px 22px', borderRadius:8, background:'var(--white-10)', border:'1px solid var(--border)', color:'var(--white)', cursor:'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding:'10px 22px', borderRadius:8, background:'#e05555', border:'none', color:'#fff', fontWeight:600, cursor:'pointer' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')}/>}
    </div>
  )
}