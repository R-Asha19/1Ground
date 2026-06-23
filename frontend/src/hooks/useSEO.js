// src/hooks/useSEO.js
// Usage: useSEO({ title, description, keywords, canonical, noIndex, ogImage, schema })

import { useEffect } from 'react'

const BASE_URL = 'https://1ground.in'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg` // put a 1200x630 banner in /public

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
  ogImage = DEFAULT_IMAGE,
  schema = null,
}) {
  const fullTitle = title ? `${title} | 1Ground` : '1Ground – Buy, Rent & Sell Properties in India'
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  useEffect(() => {
    // ── Title ──
    document.title = fullTitle

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // ── Standard meta ──
    if (description) setMeta('description', description)
    if (keywords)    setMeta('keywords', keywords)
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // ── Canonical ──
    setLink('canonical', fullCanonical)

    // ── Open Graph ──
    setMeta('og:title',       fullTitle,       'property')
    setMeta('og:description', description,     'property')
    setMeta('og:url',         fullCanonical,   'property')
    setMeta('og:image',       ogImage,         'property')
    setMeta('og:type',        'website',       'property')
    setMeta('og:site_name',   '1Ground',       'property')

    // ── Twitter Card ──
    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:title',       fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image',       ogImage)

    // ── JSON-LD Schema ──
    let schemaEl = document.getElementById('seo-schema')
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script')
        schemaEl.id   = 'seo-schema'
        schemaEl.type = 'application/ld+json'
        document.head.appendChild(schemaEl)
      }
      schemaEl.textContent = JSON.stringify(schema)
    } else if (schemaEl) {
      schemaEl.remove()
    }

    return () => {
      // cleanup noindex on unmount so it doesn't bleed to next page
      setMeta('robots', 'index, follow')
    }
  }, [fullTitle, description, keywords, fullCanonical, noIndex, ogImage, schema])
}