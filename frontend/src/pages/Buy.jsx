import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import PropertyFilterSidebar from '../components/PropertyFilterSidebar'
import api from '../api/axios'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

// ── Shared PageHero ──────────────────────────────
export function PageHero({ title, em, sub, img }) {
  return (
    <section style={{
      height: 340, position: 'relative', display: 'flex', alignItems: 'center',
      backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.78)' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        <p style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>1Ground</p>
        <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.1 }}>
          {title} <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>{em}</em>
        </h1>
        <p style={{ fontSize: '.92rem', color: 'rgba(255,255,255,.6)', marginTop: 10, maxWidth: 500 }}>{sub}</p>
      </div>
    </section>
  )
}

const EMPTY_FILTERS = {
  city: '', state: '', type: '', budget: '',
  bedrooms: '', area: '', furnished: '',
}

// Build filters object from the URL's ?city= &type= &minPrice= &maxPrice= etc,
// since the old query params used separate min/max rather than the sidebar's
// combined "min-max" range strings.
function filtersFromParams(searchParams) {
  const city  = searchParams.get('city')  || ''
  const type  = searchParams.get('type')  || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const bedrooms = searchParams.get('bedrooms') || ''
  const budget = (minPrice || maxPrice) ? `${minPrice || 0}-${maxPrice || 999999999}` : ''
  return { ...EMPTY_FILTERS, city, type, budget, bedrooms }
}

// ── Buy Page ─────────────────────────────────────
export default function Buy() {
  useSEO(SEO.buy)

  const [searchParams] = useSearchParams()
  const [props,   setProps]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams))

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  const handleFilterReset = () => setFilters(EMPTY_FILTERS)

  // Build the API query string from the current filters object.
  const buildQuery = (f) => {
    const p = new URLSearchParams({ listingType: 'buy', status: 'available' })

    if (f.city)  p.set('city', f.city)
    if (f.state) p.set('state', f.state)
    if (f.type)  p.set('type', f.type)

    if (f.budget) {
      const [min, max] = f.budget.split('-')
      if (min) p.set('minPrice', min)
      if (max) p.set('maxPrice', max)
    }

    if (f.bedrooms) {
      // '5+' means "5 or more" — send as minBedrooms if your API supports it,
      // otherwise falls back to an exact match for plain numbers.
      if (f.bedrooms === '5+') p.set('minBedrooms', '5')
      else p.set('bedrooms', f.bedrooms)
    }

    if (f.area) {
      const [min, max] = f.area.split('-')
      if (min) p.set('minArea', min)
      if (max) p.set('maxArea', max)
    }

    if (f.furnished) p.set('furnished', f.furnished === 'furnished' ? 'true' : 'false')

    return p
  }

  const load = async (f) => {
    setLoading(true)
    try {
      const res = await api.get(`/properties?${buildQuery(f)}`)
      setProps(res.data.properties || [])
    } catch {
      setProps([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-apply: debounce so rapid filter changes don't fire a request per click.
  useEffect(() => {
    const timer = setTimeout(() => load(filters), 350)
    return () => clearTimeout(timer)
  }, [filters])

  return (
    <div>
      <Navbar />
      <PageHero
        title="Buy" em="Properties"
        sub="Browse thousands of verified properties for sale across India"
        img="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80"
      />
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            <PropertyFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleFilterReset}
              resultCount={loading ? undefined : props.length}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '.78rem', color: 'var(--white-30)', marginBottom: 24 }}>
                {loading ? 'Searching...' : `${props.length} properties found`}
              </p>
              {loading ? (
                <div className="spinner" />
              ) : props.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--white-60)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏢</div>
                  <p>No buy properties found. Try different filters.</p>
                </div>
              ) : (
                <div className="prop-grid">
                  {props.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}