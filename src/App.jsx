import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueueProvider } from './context/QueueContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import NotificationDrawer from './components/common/NotificationDrawer'
import HomePage from './pages/HomePage'
import CheckInPage from './pages/CheckInPage'
import TrackerPage from './pages/TrackerPage'
import HospitalsPage from './pages/HospitalsPage'
import StaffPage from './pages/StaffPage'

export default function App() {
  return (
    <BrowserRouter>
      <QueueProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* 1. Patient Portal */}
              <Route path="/" element={<HomePage />} />
              <Route path="/checkin" element={<CheckInPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/hospitals" element={<HospitalsPage />} />

              {/* 2. Receptionist Portal */}
              <Route path="/receptionist" element={<StaffPage initialTab="reception" />} />
              <Route path="/reception" element={<StaffPage initialTab="reception" />} />

              {/* 3. Doctor Portal */}
              <Route path="/doctor" element={<StaffPage initialTab="doctor" />} />

              {/* 4. Hospital Admin Portal */}
              <Route path="/admin" element={<StaffPage initialTab="admin" />} />

              {/* Unified Staff Console */}
              <Route path="/staff" element={<StaffPage initialTab="reception" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />

          {/* Global In-App SMS & Verification Simulator Drawer */}
          <NotificationDrawer />
        </div>
      </QueueProvider>
    </BrowserRouter>
  )
}
