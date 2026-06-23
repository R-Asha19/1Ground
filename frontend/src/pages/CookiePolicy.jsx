import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

export default function CookiePolicy() {
  useSEO(SEO.cookiePolicy)

  return (
    <div style={{ background: 'var(--black-soft)', minHeight: '100vh', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>

        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.82rem', color: 'var(--gold)', textDecoration: 'none', marginBottom: 40 }}
        >
          ← Back to Home
        </Link>

        <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: '2.2rem', color: 'var(--white)', marginBottom: 8 }}>Cookie Policy</h1>
        <p style={{ fontSize: '.82rem', color: 'var(--white-30)', marginBottom: 48 }}>Last updated: January 1, 2025</p>

        {[
          {
            title: '1. What Are Cookies?',
            body: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to website owners about how users interact with their site.`,
          },
          {
            title: '2. How 1Ground Uses Cookies',
            body: `We use cookies to keep you logged in, remember your search preferences and filters, understand how you use our platform, and improve the performance and relevance of our services. Without certain cookies, parts of the platform may not function correctly.`,
          },
          {
            title: '3. Types of Cookies We Use',
            body: `Essential Cookies: Required for the platform to function. These cannot be disabled.\n\nPreference Cookies: Remember your settings and preferences such as language and search filters.\n\nAnalytics Cookies: Help us understand how visitors interact with our site so we can improve it.\n\nMarketing Cookies: Used to show you relevant property listings and advertisements based on your interests.`,
          },
          {
            title: '4. Third-Party Cookies',
            body: `We may use third-party services such as Google Analytics and Google OAuth that place their own cookies on your device. These third parties have their own privacy and cookie policies which we encourage you to review.`,
          },
          {
            title: '5. Managing Cookies',
            body: `You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete them. Please note that disabling certain cookies may affect the functionality of the 1Ground platform.`,
          },
          {
            title: '6. Cookie Retention',
            body: `Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. The duration varies by cookie type and purpose.`,
          },
          {
            title: '7. Updates to This Policy',
            body: `We may update this Cookie Policy periodically. We will notify you of significant changes by updating the date at the top of this page.`,
          },
          {
            title: '8. Contact Us',
            body: `If you have questions about our use of cookies, please contact us at enquiry1ground@gmail.com or call +91 70946 40322.`,
          },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 10 }}>{section.title}</h2>
            <p style={{ fontSize: '.88rem', color: 'var(--white-60)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{section.body}</p>
          </section>
        ))}

      </div>
    </div>
  )
}