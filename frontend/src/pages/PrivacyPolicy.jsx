import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

export default function PrivacyPolicy() {
  useSEO(SEO.privacyPolicy)

  return (
    <div style={{ background: 'var(--black-soft)', minHeight: '100vh', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>

        {/* Back */}
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.82rem', color: 'var(--gold)', textDecoration: 'none', marginBottom: 40 }}
        >
          ← Back to Home
        </Link>

        <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: '2.2rem', color: 'var(--white)', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: '.82rem', color: 'var(--white-30)', marginBottom: 48 }}>Last updated: January 1, 2025</p>

        {[
          {
            title: '1. Information We Collect',
            body: `We collect information you provide directly to us, such as your name, email address, phone number, and property preferences when you register or use our services. We also collect usage data, device information, and location data to improve your experience on the 1Ground platform.`,
          },
          {
            title: '2. How We Use Your Information',
            body: `We use the information we collect to provide, maintain, and improve our services; to match you with relevant property listings; to communicate with you about your account, transactions, and updates; and to personalise your experience on 1Ground.`,
          },
          {
            title: '3. Information Sharing',
            body: `We do not sell your personal information to third parties. We may share your information with property owners or agents when you express interest in a listing, with service providers who assist in our operations, or when required by law.`,
          },
          {
            title: '4. Data Security',
            body: `We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.`,
          },
          {
            title: '5. Cookies',
            body: `We use cookies and similar tracking technologies to enhance your experience. Please refer to our Cookie Policy for detailed information about how we use cookies and your choices regarding them.`,
          },
          {
            title: '6. Your Rights',
            body: `You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications. To exercise these rights, contact us at enquiry1ground@gmail.com.`,
          },
          {
            title: '7. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.`,
          },
          {
            title: '8. Contact Us',
            body: `If you have questions about this Privacy Policy, please contact us at enquiry1ground@gmail.com or call +91 70946 40322.`,
          },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 10 }}>{section.title}</h2>
            <p style={{ fontSize: '.88rem', color: 'var(--white-60)', lineHeight: 1.85 }}>{section.body}</p>
          </section>
        ))}

      </div>
    </div>
  )
}