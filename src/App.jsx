import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Amenities from './components/Amenities'
import AuthModal from './components/AuthModal'
import Calculator from './components/Calculator'
import Contact from './components/Contact'
import FloorPlans from './components/FloorPlans'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

const initialSearchFilters = { propertyType: 'All residences', location: 'Marina District, Dubai', budget: '$750k - $2m', searchId: 0 }

function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState(initialSearchFilters)
  const handleSearch = filters => setSearchFilters(current => ({ ...filters, searchId: current.searchId + 1 }))

  return <AuthProvider><div className="overflow-x-hidden bg-stone-50 text-slate-900"><Navbar onAuthOpen={() => setAuthOpen(true)} /><main><Hero onSearch={handleSearch} /><Gallery /><FloorPlans key={searchFilters.searchId} searchFilters={searchFilters} /><Amenities /><Calculator onAuthOpen={() => setAuthOpen(true)} /><Contact onAuthOpen={() => setAuthOpen(true)} /></main><Footer /></div>{authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}</AuthProvider>
}

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<AdminLogin />} /><Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} /></Routes></BrowserRouter>
}

export default App
