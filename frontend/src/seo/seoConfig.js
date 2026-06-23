// src/seo/seoConfig.js
// Central SEO config for all pages in 1Ground

const BASE_URL = 'https://1ground.in'

export const SEO = {
  home: {
    title: 'Buy, Rent & Sell Properties in India',
    description: 'Find your dream home with 1Ground — India\'s trusted real estate platform. Browse premium properties for sale and rent across 200+ cities including Chennai, Mumbai, Bengaluru and more.',
    keywords: 'buy property india, rent property india, real estate chennai, property for sale, flats for rent, 1ground',
    canonical: '/',
  },

  buy: {
    title: 'Properties for Sale in India',
    description: 'Browse thousands of properties for sale across India. Find apartments, villas, plots and commercial spaces at the best prices on 1Ground.',
    keywords: 'property for sale india, buy apartment, buy villa, buy plot, real estate for sale chennai',
    canonical: '/buy',
  },

  rent: {
    title: 'Properties for Rent in India',
    description: 'Find the perfect rental property on 1Ground. Explore flats, houses, PG and commercial spaces for rent across 200+ Indian cities.',
    keywords: 'property for rent india, flats for rent, house for rent chennai, rental apartments india',
    canonical: '/rent',
  },

  sell: {
    title: 'Sell Your Property in India',
    description: 'List your property on 1Ground and reach millions of genuine buyers and renters. Free listing, easy process, fast results.',
    keywords: 'sell property india, list property, property listing india, sell house india',
    canonical: '/sell',
  },

  about: {
    title: 'About Us – India\'s Trusted Real Estate Platform',
    description: '1Ground is India\'s trusted real estate platform connecting buyers, sellers and renters. Learn about our mission, team and commitment to transparent property transactions.',
    keywords: '1ground about, real estate company india, property platform india',
    canonical: '/about',
  },

  contact: {
    title: 'Contact Us – Get in Touch with 1Ground',
    description: 'Have questions about buying, renting or selling property? Contact the 1Ground team. We\'re available Mon–Sat 9AM–7PM. Call +91 70946 40322 or email enquiry1ground@gmail.com.',
    keywords: 'contact 1ground, real estate support india, property help',
    canonical: '/contact',
  },

  privacyPolicy: {
    title: 'Privacy Policy',
    description: 'Read 1Ground\'s Privacy Policy to understand how we collect, use and protect your personal information.',
    canonical: '/privacy-policy',
  },

  termsOfService: {
    title: 'Terms of Service',
    description: 'Review the Terms of Service for using the 1Ground real estate platform.',
    canonical: '/terms-of-service',
  },

  cookiePolicy: {
    title: 'Cookie Policy',
    description: 'Learn how 1Ground uses cookies to improve your browsing experience.',
    canonical: '/cookie-policy',
  },

  // ── Private pages — noIndex: true ──
  login: {
    title: 'Login to 1Ground',
    description: 'Login to your 1Ground account.',
    canonical: '/login',
    noIndex: true,
  },

  adminDashboard: {
    title: 'Admin Dashboard',
    description: 'Admin Dashboard',
    canonical: '/admin/dashboard',
    noIndex: true,
  },

  ownerDashboard: {
    title: 'Owner Dashboard',
    description: 'Owner Dashboard',
    canonical: '/owner/dashboard',
    noIndex: true,
  },

  profile: {
    title: 'My Profile',
    description: 'My Profile',
    canonical: '/profile',
    noIndex: true,
  },
}

// ── JSON-LD Schemas ──────────────────────────────

export const SCHEMA = {
  // Used on Home & About
  organization: {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: '1Ground',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'India\'s trusted platform to buy, rent and sell premium properties across 200+ cities.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '61/87, Station Rd, Radha Nagar, Chromepet',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600044',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-70946-40322',
      contactType: 'customer service',
      availableLanguage: ['English', 'Tamil'],
    },
    sameAs: [
      'https://www.instagram.com/1ground.in/',
      'https://www.youtube.com/@chennaipropertylisting1gro970',
    ],
  },

  // Used on Home page
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '1Ground',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/buy?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },

  // Used on Contact page
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: '1Ground',
    image: `${BASE_URL}/og-image.jpg`,
    url: BASE_URL,
    telephone: '+91-70946-40322',
    email: 'enquiry1ground@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '61/87, Station Rd, Radha Nagar, Chromepet',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600044',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
  },

  // Used on Buy/Rent pages — call with property data
  propertyListing: (property) => ({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${BASE_URL}/property/${property._id}`,
    image: property.images?.[0] || `${BASE_URL}/og-image.jpg`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: 'IN',
    },
  }),
}