import { useState } from 'react'
import { ALL_STATES, getCitiesForState } from '../data/indiaStatesCities'

/**
 * PropertyFilterSidebar
 * Sticky/fixed-position filter panel for property listing pages.
 *
 * State appears directly above City. Selecting a State narrows the
 * City dropdown to only that state's cities. Clearing the State (back
 * to "Any State") resets City back to the full list (cleared automatically
 * if the previously selected city doesn't belong to the new state).
 *
 * Controlled component: parent owns filter state and passes it down,
 * so the same filters object can drive Buy + Rent grids together.
 *
 * Props:
 *  - filters:      object  { city, state, type, budget, bedrooms, area, furnished }
 *  - onChange:      fn(key, value)  called whenever a single field changes
 *  - onReset:       fn()            called when "Clear All" is clicked
 *  - resultCount:   number | undefined  optional, shown at the top
 */
export default function PropertyFilterSidebar({ filters, onChange, onReset, resultCount }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const types = ['Apartment','Villa','Studio','Penthouse','Plot','Commercial']

  // City options depend on the currently selected state.
  // No state selected -> no city dropdown narrowing (shows a prompt instead).
  const citiesForSelectedState = filters.state ? getCitiesForState(filters.state) : []

  const handleStateChange = (newState) => {
    onChange('state', newState)
    // If the city the user had picked doesn't belong to the new state
    // (or no state is selected anymore), clear it so stale filters
    // can't silently stay applied.
    const validCities = newState ? getCitiesForState(newState) : []
    if (filters.city && !validCities.includes(filters.city)) {
      onChange('city', '')
    }
  }

  const budgetOptions = [
    { value: '',                  label: 'Any Budget' },
    { value: '0-5000000',         label: 'Under ₹50 Lakh' },
    { value: '5000000-10000000',  label: '₹50 Lakh – ₹1 Crore' },
    { value: '10000000-30000000', label: '₹1 Crore – ₹3 Crore' },
    { value: '30000000-50000000', label: '₹3 Crore – ₹5 Crore' },
    { value: '50000000-999999999',label: 'Above ₹5 Crore' },
  ]

  const rentBudgetOptions = [
    { value: '',            label: 'Any Budget' },
    { value: '0-15000',     label: 'Under ₹15,000/mo' },
    { value: '15000-30000', label: '₹15,000 – ₹30,000/mo' },
    { value: '30000-60000', label: '₹30,000 – ₹60,000/mo' },
    { value: '60000-999999999', label: 'Above ₹60,000/mo' },
  ]

  const areaOptions = [
    { value: '',          label: 'Any Area' },
    { value: '0-600',     label: 'Under 600 sqft' },
    { value: '600-1000',  label: '600 – 1000 sqft' },
    { value: '1000-1800', label: '1000 – 1800 sqft' },
    { value: '1800-3000', label: '1800 – 3000 sqft' },
    { value: '3000-999999', label: 'Above 3000 sqft' },
  ]

  const bedroomOptions = ['', '1', '2', '3', '4', '5+']

  const activeBudgetOptions = filters.listingType === 'rent' ? rentBudgetOptions : budgetOptions

  const fieldLabel = {
    fontSize: '.62rem', fontWeight: 700, letterSpacing: '.14em',
    textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8, display: 'block',
  }
  const selectStyle = {
    width: '100%', background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.12)', borderRadius: 8,
    color: 'var(--white)', fontSize: '.85rem', padding: '10px 12px',
    outline: 'none', cursor: 'pointer', fontFamily: 'var(--ff-b)',
  }
  const disabledSelectStyle = {
    ...selectStyle,
    opacity: .5, cursor: 'not-allowed',
  }
  const chipRowStyle = { display: 'flex', flexWrap: 'wrap', gap: 8 }
  const chip = (active) => ({
    padding: '7px 14px', borderRadius: 20, fontSize: '.78rem', cursor: 'pointer',
    border: active ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,.14)',
    background: active ? 'rgba(201,168,76,.14)' : 'rgba(255,255,255,.04)',
    color: active ? 'var(--gold-lt)' : 'var(--white-60)',
    transition: 'all .2s', fontWeight: active ? 600 : 400,
  })

  const Field = ({ label, children, hint }) => (
    <div style={{ marginBottom: 22 }}>
      <label style={fieldLabel}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: '.68rem', color: 'var(--white-30)', marginTop: 6 }}>{hint}</p>}
    </div>
  )

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.05rem', color: 'var(--white)', fontWeight: 600 }}>
          Filters
        </h3>
        <button onClick={onReset} style={{
          background: 'none', border: 'none', color: 'var(--white-30)',
          fontSize: '.72rem', cursor: 'pointer', textDecoration: 'underline',
        }}>
          Clear All
        </button>
      </div>

      {typeof resultCount === 'number' && (
        <p style={{ fontSize: '.75rem', color: 'var(--white-60)', marginBottom: 20 }}>
          {resultCount} {resultCount === 1 ? 'property' : 'properties'} found
        </p>
      )}

      {/* State — appears above City, and narrows City's options */}
      <Field label="State">
        <select value={filters.state} onChange={e => handleStateChange(e.target.value)} style={selectStyle}>
          <option value="" style={{ background: '#111' }}>Any State</option>
          {ALL_STATES.map(s => <option key={s} value={s} style={{ background: '#111' }}>{s}</option>)}
        </select>
      </Field>

      {/* City — disabled with a hint until a State is chosen */}
      <Field
        label="City"
        hint={!filters.state ? 'Select a state first to see its cities' : null}
      >
        <select
          value={filters.city}
          onChange={e => onChange('city', e.target.value)}
          style={filters.state ? selectStyle : disabledSelectStyle}
          disabled={!filters.state}
        >
          <option value="" style={{ background: '#111' }}>
            {filters.state ? 'Any City' : 'Select a state first'}
          </option>
          {citiesForSelectedState.map(c => (
            <option key={c} value={c} style={{ background: '#111' }}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="Property Type">
        <select value={filters.type} onChange={e => onChange('type', e.target.value)} style={selectStyle}>
          <option value="" style={{ background: '#111' }}>Any Type</option>
          {types.map(t => <option key={t} value={t.toLowerCase()} style={{ background: '#111' }}>{t}</option>)}
        </select>
      </Field>

      <Field label="Budget">
        <select value={filters.budget} onChange={e => onChange('budget', e.target.value)} style={selectStyle}>
          {activeBudgetOptions.map(o => (
            <option key={o.value} value={o.value} style={{ background: '#111' }}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Bedrooms">
        <div style={chipRowStyle}>
          {bedroomOptions.map(b => (
            <span key={b || 'any'} style={chip(filters.bedrooms === b)} onClick={() => onChange('bedrooms', b)}>
              {b === '' ? 'Any' : `${b} BHK`}
            </span>
          ))}
        </div>
      </Field>

      <Field label="Area">
        <select value={filters.area} onChange={e => onChange('area', e.target.value)} style={selectStyle}>
          {areaOptions.map(o => (
            <option key={o.value} value={o.value} style={{ background: '#111' }}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Furnishing">
        <div style={chipRowStyle}>
          {[
            { value: '',           label: 'Any' },
            { value: 'furnished',  label: 'Furnished' },
            { value: 'unfurnished',label: 'Unfurnished' },
          ].map(o => (
            <span key={o.value} style={chip(filters.furnished === o.value)} onClick={() => onChange('furnished', o.value)}>
              {o.label}
            </span>
          ))}
        </div>
      </Field>
    </>
  )

  return (
    <>
      {/* ───────── Desktop sidebar (sticky) ───────── */}
      <aside
        className="filter-sidebar-desktop"
        style={{
          position: 'sticky',
          top: 96, /* sits below a ~80px navbar with breathing room */
          alignSelf: 'flex-start',
          width: 270,
          flexShrink: 0,
          background: 'var(--black-soft)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 14,
          padding: '24px 22px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }}
      >
        {content}
      </aside>

      {/* ───────── Mobile trigger + drawer ───────── */}
      <button
        className="filter-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          width: '100%', padding: '12px 16px', marginBottom: 16,
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 10, color: 'var(--white)', fontSize: '.85rem',
          fontWeight: 600, cursor: 'pointer', alignItems: 'center',
          justifyContent: 'center', gap: 8,
        }}
      >
        ⚙ Filters {typeof resultCount === 'number' ? `(${resultCount})` : ''}
      </button>

      {mobileOpen && (
        <div
          className="filter-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
            zIndex: 200, display: 'flex', justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '88%', maxWidth: 340, height: '100%',
              background: 'var(--black-soft)', padding: '24px 20px',
              overflowY: 'auto', boxShadow: '-10px 0 40px rgba(0,0,0,.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button onClick={() => setMobileOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--white)',
                fontSize: '1.3rem', cursor: 'pointer',
              }}>✕</button>
            </div>
            {content}
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 16 }}
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .filter-sidebar-desktop { display: none !important; }
          .filter-mobile-trigger  { display: flex !important; }
        }
      `}</style>
    </>
  )
}