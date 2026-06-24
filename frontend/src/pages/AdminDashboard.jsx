import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Toast from '../components/Toast'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

const AMENITIES = ['WiFi','Parking','Gym','Swimming Pool','Security','Lift','Power Backup','Garden']

export default function AdminDashboard() {
  useSEO(SEO.adminDashboard)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [panel,      setPanel]      = useState('dashboard')
  const [stats,      setStats]      = useState({})
  const [owners,     setOwners]     = useState([])
  const [customers,  setCustomers]  = useState([])
  const [allProps,   setAllProps]   = useState([])
  const [loading,    setLoading]    = useState(false)
  const [toast,      setToast]      = useState('')
  const [expanded,   setExpanded]   = useState(null)
  const [sideOpen,   setSideOpen]   = useState(false)

  // Edit modal
  const [editModal, setEditModal] = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [editForm,  setEditForm]  = useState({})
  const [saving,    setSaving]    = useState(false)

  // Delete confirm
  const [confirmDel, setConfirmDel] = useState(null)

  // Search
  const [ownerQ, setOwnerQ] = useState('')
  const [custQ,  setCustQ]  = useState('')
  const [propQ,  setPropQ]  = useState('')

  // Inbox
  const [messages,    setMessages]    = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMsg, setSelectedMsg] = useState(null)

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sideOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sideOpen])

  useEffect(() => { loadStats(); fetchUnreadCount() }, [])

  /* ── Data loaders ── */
  const loadStats = async () => {
    try { const r = await api.get('/admin/dashboard'); setStats(r.data.stats || {}) } catch {}
  }
  const loadOwners = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/owners');     setOwners(r.data.owners || []) }
    catch {} finally { setLoading(false) }
  }
  const loadCustomers = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/customers');  setCustomers(r.data.customers || []) }
    catch {} finally { setLoading(false) }
  }
  const loadProps = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/properties'); setAllProps(r.data.properties || []) }
    catch {} finally { setLoading(false) }
  }
  const loadInbox = async () => {
    setLoading(true)
    try { const r = await api.get('/contact'); setMessages(r.data.messages || []) }
    catch {} finally { setLoading(false) }
  }
  const fetchUnreadCount = async () => {
    try { const r = await api.get('/contact/unread-count'); setUnreadCount(r.data.count || 0) } catch {}
  }

  /* ── Inbox actions ── */
  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`)
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }
  const deleteMsg = async (id) => {
    try {
      await api.delete(`/contact/${id}`)
      setMessages(prev => prev.filter(m => m._id !== id))
      if (selectedMsg?._id === id) setSelectedMsg(null)
      setToast('🗑 Message deleted')
      fetchUnreadCount()
    } catch { setToast('❌ Delete failed') }
  }

  /* ── Panel switcher ── */
  const switchPanel = (p) => {
    setPanel(p)
    setSideOpen(false)
    if (p === 'owners')     loadOwners()
    if (p === 'customers')  loadCustomers()
    if (p === 'properties') loadProps()
    if (p === 'inbox')      loadInbox()
  }

  /* ── User actions ── */
  const toggleBlock = async (id) => {
    try {
      const r = await api.patch(`/admin/users/${id}/block`)
      setToast(r.data.message)
      loadOwners(); loadCustomers()
    } catch (e) { setToast('❌ ' + e.response?.data?.message) }
  }
  const handleDelete = async () => {
    if (!confirmDel) return
    try {
      if (confirmDel.type === 'user') await api.delete(`/admin/users/${confirmDel.id}`)
      else                            await api.delete(`/properties/${confirmDel.id}`)
      setToast('🗑 Deleted'); setConfirmDel(null)
      loadStats()
      if (confirmDel.type === 'prop') loadProps()
      else { loadOwners(); loadCustomers() }
    } catch (e) { setToast('❌ ' + e.response?.data?.message); setConfirmDel(null) }
  }

  /* ── Edit property ── */
  const openEdit = async (id) => {
    let p = allProps.find(x => x._id === id)
    if (!p) {
      try { const r = await api.get(`/properties/${id}`); p = r.data.property } catch { return }
    }
    setEditId(id)
    setEditForm({
      title: p.title, description: p.description, listingType: p.listingType || 'rent',
      type: p.type, status: p.status, city: p.city, locality: p.locality || '',
      price: p.price, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      areaSqft: p.areaSqft || '', whatsappNumber: p.whatsappNumber || '',
      amenities: p.amenities || [], images: null, existingImages: p.images || [],
    })
    setEditModal(true)
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(editForm).forEach(([k, v]) => {
        if (k === 'images')          { if (v) Array.from(v).forEach(f => fd.append('images', f)) }
        else if (k === 'amenities')  fd.append('amenities', JSON.stringify(v))
        else if (k !== 'existingImages') fd.append(k, v)
      })
      await api.put(`/properties/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setEditModal(false); setToast('✅ Property updated!'); loadProps(); loadStats()
    } catch (e) { setToast('❌ ' + e.response?.data?.message) }
    finally { setSaving(false) }
  }
  const toggleAmenity = a => setEditForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }))

  /* ── Filtered lists ── */
  const fOwners    = owners.filter(o    => o.name.toLowerCase().includes(ownerQ.toLowerCase()) || o.email.toLowerCase().includes(ownerQ.toLowerCase()))
  const fCustomers = customers.filter(c => c.name.toLowerCase().includes(custQ.toLowerCase())  || c.email.toLowerCase().includes(custQ.toLowerCase()))
  const fProps     = allProps.filter(p  => p.title.toLowerCase().includes(propQ.toLowerCase()) || p.city.toLowerCase().includes(propQ.toLowerCase()))

  const sideLinks = [
    { id: 'dashboard',  icon: '📊', label: 'Dashboard' },
    { id: 'owners',     icon: '🔑', label: 'Owners' },
    { id: 'customers',  icon: '👥', label: 'Customers' },
    { id: 'properties', icon: '🏠', label: 'All Properties' },
    { id: 'inbox',      icon: '📨', label: 'Inbox' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>

      {/* ── Mobile top bar ── */}
      <div className="admin-topbar">
        <span style={{ fontFamily: 'var(--ff-d)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--white)' }}>
          <span style={{ color: 'var(--gold)' }}>1</span>Ground
        </span>
        <button
          className="ham-btn"
          onClick={() => setSideOpen(o => !o)}
          aria-label="Menu"
          style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--white)', borderRadius: 2,
              transition: 'all .3s',
              transform: sideOpen
                ? (i===0 ? 'translateY(7px) rotate(45deg)' : i===2 ? 'translateY(-7px) rotate(-45deg)' : 'none')
                : 'none',
              opacity: sideOpen && i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </div>

      {/* ── Mobile overlay (backdrop) ── */}
      {sideOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sideOpen ? ' sidebar-open' : ''}`}>
        {/* Logo only shown on desktop; topbar handles mobile */}
        <div className="sidebar-logo admin-sidebar-logo-desktop"><span>1</span>Ground</div>
        <div style={{ display:'inline-block', background:'var(--gold-pale)', border:'1px solid var(--gold-dim)', borderRadius:20, padding:'3px 12px', fontSize:'.6rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16 }}>
          🛡️ Admin Panel
        </div>

        {sideLinks.map(l => (
          <button key={l.id} onClick={() => switchPanel(l.id)} className={`s-link${panel === l.id ? ' active' : ''}`}>
            <span style={{ marginRight: 4 }}>{l.icon}</span>
            {l.label}
            {l.id === 'inbox' && unreadCount > 0 && (
              <span style={{ marginLeft:'auto', background:'#e05555', color:'#fff', borderRadius:20, padding:'1px 9px', fontSize:'.62rem', fontWeight:700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}

        <Link to="/" className="s-link" onClick={() => setSideOpen(false)}>🌐 View Site</Link>

        <div className="sidebar-footer">
          <button onClick={() => { logout(); navigate('/login') }} className="s-link" style={{ color:'#ff8a8a' }}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">

        {/* ══ DASHBOARD ══ */}
        {panel === 'dashboard' && (
          <>
            <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)', marginBottom:24 }}>
              Admin <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Dashboard</em>
            </h1>
            <div className="admin-stats-grid">
              {[
                { n: stats.totalOwners,         l: 'Owners',     icon: '🔑' },
                { n: stats.totalCustomers,      l: 'Customers',  icon: '👥' },
                { n: stats.totalProperties,     l: 'Properties', icon: '🏠' },
                { n: stats.availableProperties, l: 'Available',  icon: '✅' },
                { n: stats.rentedProperties,    l: 'Rented',     icon: '🔄' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize:'1.3rem', marginBottom:6 }}>{s.icon}</div>
                  <div className="stat-n">{s.n ?? '—'}</div>
                  <div className="stat-l">{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:14, padding:32, textAlign:'center', color:'var(--white-60)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:10 }}>👋</div>
              <p>Welcome back, 1Ground Admin! Use the sidebar to manage owners, customers, and properties.</p>
            </div>
          </>
        )}

        {/* ══ OWNERS ══ */}
        {panel === 'owners' && (
          <>
            <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)', marginBottom:24 }}>
              Manage <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Owners</em>
            </h1>
            <div className="tbl-wrap">
              <div className="tbl-head">
                <h3>All Owners & Their Properties</h3>
                <input className="search-inp" placeholder="🔍 Search owner..." value={ownerQ} onChange={e => setOwnerQ(e.target.value)} />
              </div>
              {loading ? <div className="spinner" /> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: 640 }}>
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Posts</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {fOwners.map(o => (
                        <Fragment key={o._id}>
                          <tr>
                            <td style={{ fontWeight:600, color:'var(--white)' }}>{o.name}</td>
                            <td style={{ color:'var(--white-60)', fontSize:'.78rem' }}>{o.email}</td>
                            <td style={{ color:'var(--white-60)', fontSize:'.78rem' }}>{o.phone || '—'}</td>
                            <td><span style={{ background:'var(--gold-pale)', color:'var(--gold-lt)', borderRadius:20, padding:'2px 10px', fontSize:'.72rem', fontWeight:700 }}>{o.totalPosts}</span></td>
                            <td><span className={`badge ${o.isActive ? 'badge-available' : 'badge-unlisted'}`}>{o.isActive ? 'Active' : 'Blocked'}</span></td>
                            <td style={{ color:'var(--white-30)', fontSize:'.75rem' }}>{new Date(o.joinedAt).toLocaleDateString('en-IN')}</td>
                            <td>
                              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                                <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="btn-tbl" style={{ background:'var(--white-10)', color:'var(--white-60)', border:'1px solid var(--border)' }}>📋 Props</button>
                                <button onClick={() => toggleBlock(o._id)} className={`btn-tbl ${o.isActive ? 'btn-block' : 'btn-unblock'}`}>{o.isActive ? '🚫 Block' : '✅ Unblock'}</button>
                                <button onClick={() => setConfirmDel({ type:'user', id:o._id, name:o.name })} className="btn-tbl btn-del">🗑</button>
                              </div>
                            </td>
                          </tr>
                          {expanded === o._id && (
                            <tr style={{ background:'rgba(0,0,0,.25)' }}>
                              <td colSpan={7} style={{ padding:'14px 20px 18px' }}>
                                <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--white-30)', marginBottom:10 }}>Properties by {o.name} ({o.totalPosts})</p>
                                {o.properties.length === 0
                                  ? <p style={{ fontSize:'.8rem', color:'var(--white-60)' }}>No properties posted yet.</p>
                                  : <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                                    {o.properties.map(p => (
                                      <div key={p._id} style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 13px', display:'flex', alignItems:'center', gap:10, minWidth:220, flex:'1 1 220px' }}>
                                        {p.images?.[0] ? <img src={p.images[0].url} alt="" style={{ width:44, height:33, borderRadius:5, objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:44, height:33, borderRadius:5, background:'var(--black-el)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🏠</div>}
                                        <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{ fontSize:'.8rem', fontWeight:600, color:'var(--white)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
                                          <div style={{ fontSize:'.68rem', color:'var(--white-30)' }}>{p.city} · ₹{Number(p.price).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                                          <button onClick={() => { setAllProps([p]); openEdit(p._id) }} className="btn-tbl btn-edit" style={{ padding:'4px 9px' }}>✏️</button>
                                          <button onClick={() => setConfirmDel({ type:'prop', id:p._id, name:p.title })} className="btn-tbl btn-del" style={{ padding:'4px 9px' }}>🗑</button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                }
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ CUSTOMERS ══ */}
        {panel === 'customers' && (
          <>
            <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)', marginBottom:24 }}>
              Manage <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Customers</em>
            </h1>
            <div className="tbl-wrap">
              <div className="tbl-head">
                <h3>All Customers ({customers.length})</h3>
                <input className="search-inp" placeholder="🔍 Search customer..." value={custQ} onChange={e => setCustQ(e.target.value)} />
              </div>
              {loading ? <div className="spinner" /> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: 500 }}>
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {fCustomers.map(c => (
                        <tr key={c._id}>
                          <td style={{ fontWeight:600, color:'var(--white)' }}>{c.name}</td>
                          <td style={{ color:'var(--white-60)', fontSize:'.78rem' }}>{c.email}</td>
                          <td><span className={`badge ${c.isActive ? 'badge-available' : 'badge-unlisted'}`}>{c.isActive ? 'Active' : 'Blocked'}</span></td>
                          <td style={{ color:'var(--white-30)', fontSize:'.75rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                              <button onClick={() => toggleBlock(c._id)} className={`btn-tbl ${c.isActive ? 'btn-block' : 'btn-unblock'}`}>{c.isActive ? '🚫 Block' : '✅ Unblock'}</button>
                              <button onClick={() => setConfirmDel({ type:'user', id:c._id, name:c.name })} className="btn-tbl btn-del">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ ALL PROPERTIES ══ */}
        {panel === 'properties' && (
          <>
            <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)', marginBottom:24 }}>
              All <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Properties</em>
            </h1>
            <div className="tbl-wrap">
              <div className="tbl-head">
                <h3>All Properties ({allProps.length})</h3>
                <input className="search-inp" placeholder="🔍 Search property..." value={propQ} onChange={e => setPropQ(e.target.value)} />
              </div>
              {loading ? <div className="spinner" /> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: 640 }}>
                    <thead><tr><th>Property</th><th>Owner</th><th>Listing</th><th>City</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {fProps.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              {p.images?.[0] ? <img src={p.images[0].url} alt="" style={{ width:48, height:36, borderRadius:6, objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:48, height:36, borderRadius:6, background:'var(--black-el)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🏠</div>}
                              <div>
                                <div style={{ fontWeight:600, color:'var(--white)', fontSize:'.84rem' }}>{p.title}</div>
                                <div style={{ fontSize:'.7rem', color:'var(--white-30)' }}>{p.bedrooms} BHK</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize:'.78rem', color:'var(--white-60)' }}>{p.owner?.name || '—'}</td>
                          <td><span className={`badge ${p.listingType === 'rent' ? 'badge-rent' : 'badge-sell'}`}>{p.listingType === 'rent' ? 'Rent' : 'Sale'}</span></td>
                          <td style={{ fontSize:'.78rem', color:'var(--white-60)' }}>{p.city}</td>
                          <td style={{ fontWeight:600, color:'var(--gold-lt)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                          <td>
                            <div style={{ display:'flex', gap:6 }}>
                              <button onClick={() => openEdit(p._id)} className="btn-tbl btn-edit">✏️ Edit</button>
                              <button onClick={() => setConfirmDel({ type:'prop', id:p._id, name:p.title })} className="btn-tbl btn-del">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ INBOX ══ */}
        {panel === 'inbox' && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, flexWrap:'wrap' }}>
              <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'1.9rem', fontWeight:400, color:'var(--white)', margin:0 }}>
                Contact <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Inbox</em>
              </h1>
              {unreadCount > 0 && (
                <span style={{ background:'#e05555', color:'#fff', borderRadius:20, padding:'4px 14px', fontSize:'.75rem', fontWeight:700 }}>
                  {unreadCount} unread
                </span>
              )}
            </div>

            {loading ? <div className="spinner" /> : (
              <div className="inbox-layout">

                {/* ── LEFT: Message List ── */}
                <div className={`inbox-list${selectedMsg ? ' inbox-list-hidden' : ''}`} style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontSize:'.88rem', fontWeight:600, color:'var(--white)' }}>
                      All Messages
                      <span style={{ marginLeft:8, fontSize:'.75rem', color:'var(--white-30)', fontWeight:400 }}>({messages.length})</span>
                    </h3>
                  </div>

                  {messages.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'50px 20px', color:'var(--white-60)' }}>
                      <div style={{ fontSize:'2.5rem', marginBottom:10 }}>📭</div>
                      <p style={{ fontSize:'.85rem' }}>No messages yet.</p>
                    </div>
                  ) : (
                    <div style={{ maxHeight:600, overflowY:'auto' }}>
                      {messages.map(m => (
                        <div
                          key={m._id}
                          onClick={() => { setSelectedMsg(m); if (!m.isRead) markRead(m._id) }}
                          style={{
                            padding:'15px 18px',
                            borderBottom:'1px solid rgba(255,255,255,.05)',
                            cursor:'pointer',
                            background: selectedMsg?._id === m._id
                              ? 'var(--gold-pale)'
                              : m.isRead ? 'transparent' : 'rgba(201,168,76,.04)',
                            borderLeft: selectedMsg?._id === m._id
                              ? '3px solid var(--gold)'
                              : m.isRead ? '3px solid transparent' : '3px solid rgba(201,168,76,.4)',
                            transition:'background .15s',
                          }}
                        >
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4, gap:8 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                              {!m.isRead && (
                                <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--gold)', flexShrink:0 }} />
                              )}
                              <span style={{ fontWeight:600, color:'var(--white)', fontSize:'.84rem' }}>{m.name}</span>
                            </div>
                            <span style={{ fontSize:'.68rem', color:'var(--white-30)', flexShrink:0 }}>
                              {new Date(m.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                            </span>
                          </div>
                          <p style={{ fontSize:'.76rem', color:'var(--gold)', fontWeight:600, marginBottom:3 }}>{m.subject}</p>
                          <p style={{ fontSize:'.72rem', color:'var(--white-30)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {m.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── RIGHT: Message Detail ── */}
                {selectedMsg ? (
                  <div className="inbox-detail" style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                    <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <button
                        className="inbox-back-btn"
                        onClick={() => setSelectedMsg(null)}
                      >
                        ← Back
                      </button>
                      <h3 style={{ fontFamily:'var(--ff-d)', fontSize:'1.2rem', color:'var(--white)', fontWeight:400, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {selectedMsg.subject}
                      </h3>
                      <button
                        onClick={() => setSelectedMsg(null)}
                        className="inbox-close-btn"
                      >✕</button>
                    </div>

                    <div style={{ padding:'24px' }}>
                      <div className="msg-meta-grid" style={{ marginBottom:22 }}>
                        <div>
                          <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:5 }}>From</p>
                          <p style={{ fontSize:'.88rem', color:'var(--white)', fontWeight:600 }}>{selectedMsg.name}</p>
                        </div>
                        <div>
                          <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:5 }}>Date & Time</p>
                          <p style={{ fontSize:'.82rem', color:'var(--white-60)' }}>
                            {new Date(selectedMsg.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:5 }}>Email</p>
                          <a href={`mailto:${selectedMsg.email}`} style={{ fontSize:'.85rem', color:'var(--gold-lt)', textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
                            <span>📧</span>{selectedMsg.email}
                          </a>
                        </div>
                        <div>
                          <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:5 }}>Phone</p>
                          {selectedMsg.phone ? (
                            <a href={`tel:${selectedMsg.phone}`} style={{ fontSize:'.85rem', color:'var(--gold-lt)', textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
                              <span>📞</span>{selectedMsg.phone}
                            </a>
                          ) : (
                            <p style={{ fontSize:'.82rem', color:'var(--white-30)' }}>—</p>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Message</p>
                      <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', borderRadius:12, padding:'18px 20px', marginBottom:24, minHeight:100 }}>
                        <p style={{ fontSize:'.9rem', color:'var(--white-60)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{selectedMsg.message}</p>
                      </div>

                      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                        <a
                          href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                          style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 22px', borderRadius:9, background:'var(--gold)', color:'var(--black)', fontWeight:700, fontSize:'.82rem', textDecoration:'none', transition:'background .2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-lt)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                        >
                          ✉️ Reply
                        </a>

                        {selectedMsg.phone && (
                          <a
                            href={`tel:${selectedMsg.phone}`}
                            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 20px', borderRadius:9, background:'rgba(76,175,125,.15)', color:'#7de0a8', border:'1px solid rgba(76,175,125,.3)', fontWeight:600, fontSize:'.82rem', textDecoration:'none' }}
                          >
                            📞 Call
                          </a>
                        )}

                        {selectedMsg.phone && (
                          <a
                            href={`https://wa.me/${selectedMsg.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${selectedMsg.name}, this is 1Ground support regarding your enquiry: "${selectedMsg.subject}"`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 20px', borderRadius:9, background:'rgba(37,211,102,.15)', color:'#25D366', border:'1px solid rgba(37,211,102,.3)', fontWeight:600, fontSize:'.82rem', textDecoration:'none' }}
                          >
                            💬 WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => deleteMsg(selectedMsg._id)}
                          className="btn-tbl btn-del"
                          style={{ padding:'11px 20px', marginLeft:'auto' }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="inbox-empty" style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:14, flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 30px', textAlign:'center', color:'var(--white-30)' }}>
                    <div style={{ fontSize:'3rem', marginBottom:14 }}>📬</div>
                    <p style={{ fontSize:'.9rem', marginBottom:6, color:'var(--white-60)' }}>Select a message</p>
                    <p style={{ fontSize:'.8rem' }}>Click any message from the list to view its full details here.</p>
                  </div>
                )}

              </div>
            )}
          </>
        )}

      </main>

      {/* ── Edit Property Modal ── */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth:660 }}>
            <button className="modal-close" onClick={() => setEditModal(false)}>✕</button>
            <h2 style={{ fontFamily:'var(--ff-d)', fontSize:'1.5rem', color:'var(--white)', marginBottom:22 }}>
              Edit <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Property</em>
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="edit-form-grid">
                <div className="edit-form-full">
                  <label className="f-label">Listing Type</label>
                  <div style={{ display:'flex', gap:10, marginTop:4 }}>
                    {[['rent','🏠 For Rent'],['buy','💰 For Sale']].map(([v,l]) => (
                      <button key={v} type="button" onClick={() => setEditForm(p => ({ ...p, listingType:v }))} style={{ flex:1, padding:'10px', borderRadius:8, cursor:'pointer', fontFamily:'var(--ff-b)', fontSize:'.82rem', fontWeight:600, border: editForm.listingType===v ? '1.5px solid var(--gold)' : '1.5px solid var(--border)', background: editForm.listingType===v ? 'var(--gold-pale)' : 'var(--black-el)', color: editForm.listingType===v ? 'var(--gold-lt)' : 'var(--white-60)', transition:'all .2s' }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="edit-form-full"><label className="f-label">Title</label><input className="f-input" value={editForm.title||''} onChange={e => setEditForm(p => ({ ...p, title:e.target.value }))} /></div>
                <div className="edit-form-full"><label className="f-label">Description</label><textarea className="f-textarea" value={editForm.description||''} onChange={e => setEditForm(p => ({ ...p, description:e.target.value }))} /></div>
                <div><label className="f-label">Type</label><select className="f-select" value={editForm.type||''} onChange={e => setEditForm(p => ({ ...p, type:e.target.value }))}>{['apartment','villa','studio','penthouse','plot','commercial'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="f-label">Status</label><select className="f-select" value={editForm.status||''} onChange={e => setEditForm(p => ({ ...p, status:e.target.value }))}>{['available','rented','unlisted'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="f-label">City</label><input className="f-input" value={editForm.city||''} onChange={e => setEditForm(p => ({ ...p, city:e.target.value }))} /></div>
                <div><label className="f-label">Locality</label><input className="f-input" value={editForm.locality||''} onChange={e => setEditForm(p => ({ ...p, locality:e.target.value }))} /></div>
                <div><label className="f-label">Price (₹)</label><input className="f-input" type="number" value={editForm.price||''} onChange={e => setEditForm(p => ({ ...p, price:e.target.value }))} /></div>
                <div><label className="f-label">Bedrooms</label><input className="f-input" type="number" value={editForm.bedrooms||''} onChange={e => setEditForm(p => ({ ...p, bedrooms:e.target.value }))} /></div>
                <div><label className="f-label">Bathrooms</label><input className="f-input" type="number" value={editForm.bathrooms||''} onChange={e => setEditForm(p => ({ ...p, bathrooms:e.target.value }))} /></div>
                <div><label className="f-label">Area (sqft)</label><input className="f-input" type="number" value={editForm.areaSqft||''} onChange={e => setEditForm(p => ({ ...p, areaSqft:e.target.value }))} /></div>
                <div className="edit-form-full"><label className="f-label">WhatsApp</label><input className="f-input" value={editForm.whatsappNumber||''} onChange={e => setEditForm(p => ({ ...p, whatsappNumber:e.target.value }))} /></div>
                <div className="edit-form-full">
                  <label className="f-label">Amenities</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:6 }}>
                    {AMENITIES.map(a => (
                      <label key={a} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:'.76rem', color:'var(--white-60)', padding:'5px 10px', borderRadius:7, border:`1px solid ${(editForm.amenities||[]).includes(a) ? 'var(--gold)' : 'var(--border)'}`, background:(editForm.amenities||[]).includes(a)?'var(--gold-pale)':'transparent', transition:'all .2s' }}>
                        <input type="checkbox" checked={(editForm.amenities||[]).includes(a)} onChange={() => toggleAmenity(a)} style={{ display:'none' }} />{a}
                      </label>
                    ))}
                  </div>
                </div>
                {editForm.existingImages?.length > 0 && (
                  <div className="edit-form-full">
                    <label className="f-label">Current Images</label>
                    <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:6 }}>
                      {editForm.existingImages.map((img,i) => <img key={i} src={img.url} alt="" style={{ width:68, height:50, objectFit:'cover', borderRadius:6, border:'1px solid var(--border)' }} />)}
                    </div>
                  </div>
                )}
                <div className="edit-form-full">
                  <label className="f-label">Replace Images (optional)</label>
                  <input className="f-input" type="file" multiple accept="image/*" onChange={e => setEditForm(p => ({ ...p, images:e.target.files }))} style={{ padding:'8px 12px' }} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:13, marginTop:16, opacity:saving ? .7 : 1 }}>
                {saving ? 'Updating...' : '✅ Update Property'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmDel && (
        <div className="modal-overlay">
          <div style={{ background:'var(--black-card)', border:'1px solid var(--border)', borderRadius:16, padding:'32px 28px', maxWidth:340, width:'90%', textAlign:'center' }}>
            <div style={{ fontSize:'2rem', marginBottom:10 }}>⚠️</div>
            <h3 style={{ color:'var(--white)', marginBottom:8 }}>Confirm Delete</h3>
            <p style={{ color:'var(--white-60)', fontSize:'.82rem', marginBottom:22 }}>"{confirmDel.name}" will be permanently deleted.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{ padding:'10px 22px', borderRadius:8, background:'var(--white-10)', border:'1px solid var(--border)', color:'var(--white)', cursor:'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding:'10px 22px', borderRadius:8, background:'#e05555', border:'none', color:'#fff', fontWeight:600, cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <style>{`
        /* ── Mobile topbar (hidden on desktop) ── */
        .admin-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 300;
          background: var(--black-card, #111);
          border-bottom: 1px solid var(--border);
          padding: 12px 20px;
          height: 60px;
          box-sizing: border-box;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Sidebar overlay backdrop ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 250;
          background: rgba(0,0,0,.6);
        }

        /* ── Stats grid ── */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        /* ── Inbox layout ── */
        .inbox-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
          align-items: start;
          min-height: 500px;
        }
        .inbox-empty { display: flex; }

        /* ── Inbox detail buttons ── */
        .inbox-back-btn {
          display: none;
          background: rgba(255,255,255,.07);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          color: var(--white-60);
          font-size: .78rem;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .inbox-close-btn {
          background: rgba(255,255,255,.07);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--white-60);
          flex-shrink: 0;
          font-size: .85rem;
        }

        /* ── Edit form grid ── */
        .edit-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .edit-form-full { grid-column: 1 / -1; }

        /* ── Msg meta grid ── */
        .msg-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          background: rgba(255,255,255,.04);
          border-radius: 12px;
          padding: 18px 20px;
        }

        /* ── Desktop logo inside sidebar ── */
        .admin-sidebar-logo-desktop { display: block; }

        /* ════════════════════════════
           TABLET  (≤ 900px)
        ════════════════════════════ */
        @media (max-width: 900px) {
          .admin-topbar    { display: flex; }
          .sidebar-overlay { display: block; }

          /* Hide desktop logo — topbar already shows it */
          .admin-sidebar-logo-desktop { display: none !important; }

          /* Sidebar becomes a fixed full-height drawer */
          .sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 240px !important;
            max-width: 80vw;
            z-index: 260 !important;
            /* KEY FIX: solid background so links are visible */
            background: var(--black-card, #111) !important;
            border-right: 1px solid var(--border, #222) !important;
            display: flex !important;
            flex-direction: column !important;
            transform: translateX(-100%);
            transition: transform .3s ease;
            padding-top: 60px !important;
            box-sizing: border-box;
            overflow-y: auto;
          }
          .sidebar.sidebar-open {
            transform: translateX(0) !important;
          }

          /* Ensure every link inside is tappable */
          .sidebar .s-link,
          .sidebar button,
          .sidebar a {
            position: relative;
            z-index: 1;
            pointer-events: auto;
          }

          .dash-main {
            margin-left: 0 !important;
            padding-top: 72px !important;
            width: 100% !important;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .inbox-layout {
            grid-template-columns: 1fr;
          }
          .inbox-empty { display: none; }
        }

        /* ════════════════════════════
           MOBILE  (≤ 600px)
        ════════════════════════════ */
        @media (max-width: 600px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          /* Inbox: show list OR detail, not both */
          .inbox-list-hidden { display: none !important; }
          .inbox-detail      { display: block !important; }
          .inbox-back-btn    { display: flex !important; }
          .inbox-close-btn   { display: none !important; }

          .edit-form-grid {
            grid-template-columns: 1fr !important;
          }
          .edit-form-full {
            grid-column: 1 !important;
          }

          .msg-meta-grid {
            grid-template-columns: 1fr !important;
          }

          .tbl-head {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .search-inp {
            width: 100% !important;
            box-sizing: border-box;
          }

          .dash-main {
            padding: 72px 12px 24px !important;
          }
        }

        @media (max-width: 400px) {
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}