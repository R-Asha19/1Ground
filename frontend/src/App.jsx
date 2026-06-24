import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Chatbot from './components/Chatbot'

import Home           from './pages/Home'
import Buy            from './pages/Buy'
import Rent           from './pages/Rent'
import Sell           from './pages/Sell'
import About          from './pages/About'
import Contact        from './pages/Contact'
import Login          from './pages/Login'
import Profile        from './pages/Profile'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPolicy  from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy   from './pages/CookiePolicy'
import PropertyDetails from './pages/PropertyDetails'

function Protected({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/buy"             element={<Buy />} />
        <Route path="/rent"            element={<Rent />} />
        <Route path="/sell"            element={<Sell />} />
         <Route path="/property/:slug"  element={<PropertyDetails />} />
        <Route path="/about"           element={<About />} />
        <Route path="/contact"         element={<Contact />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/profile"         element={<Protected><Profile /></Protected>} />
        <Route path="/owner-dashboard" element={<Protected roles={['owner', 'admin']}><OwnerDashboard /></Protected>} />
        <Route path="/admin-dashboard" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
        <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy"   element={<CookiePolicy />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>

      {/* AI Chatbot — appears on all pages */}
      <Chatbot />
    </>
  )
}