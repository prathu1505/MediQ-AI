import React, { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/landing/HeroSection'
import StatsSection from '../components/landing/StatsSection'
import LiveQueuePreview from '../components/landing/LiveQueuePreview'
import HospitalNetworkSection from '../components/landing/HospitalNetworkSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import CTASection from '../components/landing/CTASection'
import DemoModal from '../components/common/DemoModal'

export default function LandingPage() {
  const [selectedToken, setSelectedToken] = useState('MQ-104')
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [modalHospital, setModalHospital] = useState('Metro Central Hospital')

  const handleTrackToken = (token) => {
    setSelectedToken(token)
    // Scroll smoothly to live queue tracker
    const queueElem = document.getElementById('live-queue')
    if (queueElem) {
      queueElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSelectHospital = (hospitalName) => {
    setModalHospital(hospitalName)
    setIsDemoModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white font-sans">
      
      {/* Top Navigation */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        <HeroSection
          onTrackToken={handleTrackToken}
          onSelectHospital={handleSelectHospital}
        />

        <StatsSection />

        <LiveQueuePreview
          selectedToken={selectedToken}
          onClearSelection={() => setSelectedToken('MQ-104')}
        />

        <HospitalNetworkSection onSelectHospital={handleSelectHospital} />

        <FeaturesSection />

        <HowItWorks />

        <CTASection onOpenDemo={() => setIsDemoModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Simulation Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultHospital={modalHospital}
      />

    </div>
  )
}
