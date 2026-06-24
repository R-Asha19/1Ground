import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Helmet } from "react-helmet-async";
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import PropertyFilterSidebar from '../components/PropertyFilterSidebar'
import api from '../api/axios'
import { PageHero } from './Buy'   // reuse from Buy.jsx
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

const EMPTY_FILTERS = {
  city: '', state: '', type: '', budget: '',
  bedrooms: '', area: '', furnished: '',
  listingType: 'rent', // tells the sidebar to show rent-specific budget presets
}

function filtersFromParams(searchParams) {
  const city = searchParams.get('city') || ''
  const type = searchParams.get('type') || ''
  return { ...EMPTY_FILTERS, city, type }
}

export default function Rent() {
  useSEO(SEO.rent)

  const [searchParams] = useSearchParams()
  const [props,   setProps]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams))
  const [showFilters, setShowFilters] = useState(false) // mobile filter panel toggle

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  const handleFilterReset = () => setFilters(EMPTY_FILTERS)

  const buildQuery = (f) => {
    const p = new URLSearchParams({ listingType: 'rent', status: 'available' })

    if (f.city)  p.set('city', f.city)
    if (f.state) p.set('state', f.state)
    if (f.type)  p.set('type', f.type)

    if (f.budget) {
      const [, max] = f.budget.split('-')
      if (max && Number(max) < 999999999) p.set('maxPrice', max)
    }

    if (f.bedrooms) {
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

  useEffect(() => {
    const timer = setTimeout(() => load(filters), 350)
    return () => clearTimeout(timer)
  }, [filters])

  return (
    <div>
      <Helmet>
        <title>Rent Properties in India | 1Ground</title>
        <meta
          name="description"
          content="Find verified houses, apartments and commercial properties for rent across India on 1Ground."
        />
        <meta
          name="keywords"
          content="rent property, apartments for rent, houses for rent, flats for rent, 1ground"
        />
        <link rel="canonical" href="https://www.1ground.in/rent" />
      </Helmet>

      <Navbar />
      <PageHero
        title="Rent" em="Properties"
        sub="Discover comfortable homes and apartments available for rent"
        img="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80"
      />

      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="rent-layout">

            {/* Mobile-only filter toggle */}
            <button
              className="rent-filter-toggle"
              onClick={() => setShowFilters(s => !s)}
            >
              {showFilters ? '✕ Close Filters' : '☰ Filters'}
            </button>

            <div className={`rent-sidebar-wrap ${showFilters ? 'is-open' : ''}`}>
              <PropertyFilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
                resultCount={loading ? undefined : props.length}
              />
            </div>

            <div className="rent-content">
              <p style={{ fontSize: '.78rem', color: 'var(--white-30)', marginBottom: 24 }}>
                {loading ? 'Searching...' : `${props.length} rental properties found`}
              </p>
              {loading ? (
                <div className="spinner" />
              ) : props.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--white-60)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏠</div>
                  <p>No rental properties found. Try different filters.</p>
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

      <style>{`
        .rent-layout {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }
        .rent-content {
          flex: 1;
          min-width: 0;
          width: 100%;
        }
        .rent-sidebar-wrap {
          flex-shrink: 0;
        }
        .rent-filter-toggle {
          display: none;
        }

        @media (max-width: 860px) {
          .rent-layout {
            flex-direction: column;
            gap: 14px;
          }
          .rent-filter-toggle {
            display: block;
            width: 100%;
            padding: 12px 16px;
            background: var(--black);
            border: 1px solid var(--white-30);
            color: var(--white-60);
            border-radius: 8px;
            font-size: .85rem;
            text-align: left;
            cursor: pointer;
          }
          .rent-sidebar-wrap {
            display: none;
            width: 100%;
          }
          .rent-sidebar-wrap.is-open {
            display: block;
          }
          .rent-content {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .prop-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}