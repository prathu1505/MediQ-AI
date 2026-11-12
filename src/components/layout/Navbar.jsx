import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Activity,
  Hospital,
  UserPlus,
  Search,
  Building,
  Stethoscope,
  Lock,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import { useQueue } from '../../context/QueueContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false)
  const { patients } = useQueue()
  const location = useLocation()

  const waitingCount = patients.filter((p) => p.status === 'waiting').length

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Token', path: '/checkin', icon: UserPlus },
    { name: 'Live Tracker', path: '/tracker', icon: Search },
    { name: 'Hospitals', path: '/hospitals', icon: Hospital },
  ]

  const portalLinks = [
    { name: 'Receptionist Desk', path: '/receptionist', icon: Building, badge: waitingCount },
    { name: 'Doctor Consultation', path: '/doctor', icon: Stethoscope },
    { name: 'Hospital Admin & Audit', path: '/admin', icon: Lock },
  ]

  const isStaffActive = ['/receptionist', '/doctor', '/admin', '/staff'].includes(location.pathname)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Medi<span className="text-teal-600">Q</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Multi-Hospital Queue Orchestration
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {mainLinks.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </NavLink>
              )
            })}

            {/* Portals Dropdown for Receptionist, Doctor & Admin */}
            <div className="relative">
              <button
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
                onBlur={() => setTimeout(() => setStaffDropdownOpen(false), 200)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isStaffActive
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Clinical Portals</span>
                {waitingCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                    {waitingCount}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {staffDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Staff & Clinical Consoles
                  </div>
                  {portalLinks.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setStaffDropdownOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 text-xs font-semibold ${
                          isActive
                            ? 'bg-teal-50 text-teal-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-teal-600" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-teal-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Direct CTA: Book Token */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/receptionist"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Reception Desk</span>
            </Link>
            <Link
              to="/checkin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Book Token</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
          <div className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1">
            Patient Portal
          </div>
          {mainLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {Icon && <Icon className="w-4 h-4 text-teal-600" />}
                <span>{item.name}</span>
              </Link>
            )
          })}

          <div className="text-[10px] font-bold uppercase text-slate-400 px-3 pt-3 pb-1 border-t border-slate-100">
            Clinical Portals
          </div>
          {portalLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
