import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { SEO } from '../seo/seoConfig'

export default function TermsOfService() {
  useSEO(SEO.termsOfService)

  return (
    <div style={{ background: 'var(--black-soft)', minHeight: '100vh', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>

        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.82rem', color: 'var(--gold)', textDecoration: 'none', marginBottom: 40 }}
        >
          ← Back to Home
        </Link>

        <h1 style={{ fontFamily: 'var(--ff-d)', fontSize: '2.2rem', color: 'var(--white)', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: '.82rem', color: 'var(--white-30)', marginBottom: 48 }}>Last updated: January 1, 2025</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: `By accessing or using 1Ground's platform, website, or services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
          },
          {
            title: '2. Use of the Platform',
            body: `1Ground is a real estate listing platform connecting buyers, sellers, and renters. You agree to use the platform only for lawful purposes and in accordance with these terms. You must not misuse our services or attempt to access them using a method other than the interface provided.`,
          },
          {
            title: '3. User Accounts',
            body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account. You must be at least 18 years old to create an account.`,
          },
          {
            title: '4. Property Listings',
            body: `Property owners and agents are solely responsible for the accuracy of their listings. 1Ground does not verify all listing details and is not responsible for any inaccuracies. We reserve the right to remove any listing that violates our policies.`,
          },
          {
            title: '5. Prohibited Activities',
            body: `You may not post false, misleading, or fraudulent listings; harass or harm other users; use automated tools to scrape or collect data; or use the platform for any purpose that violates applicable laws or regulations in India.`,
          },
          {
            title: '6. Intellectual Property',
            body: `All content on the 1Ground platform, including logos, text, images, and software, is the property of 1Ground or its licensors and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.`,
          },
          {
            title: '7. Limitation of Liability',
            body: `1Ground is a listing platform and is not a party to any transaction between buyers, sellers, or renters. We are not liable for any losses, damages, or disputes arising from transactions facilitated through our platform.`,
          },
          {
            title: '8. Termination',
            body: `We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service or engage in conduct that we determine to be harmful to other users or the platform.`,
          },
          {
            title: '9. Governing Law',
            body: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.`,
          },
          {
            title: '10. Contact',
            body: `For questions about these Terms, contact us at enquiry1ground@gmail.com or +91 70946 40322.`,
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