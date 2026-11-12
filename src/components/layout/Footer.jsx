import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              MQ
            </div>
            <div>
              <span className="font-bold text-white text-sm">MediQ AI</span>
              <p className="text-slate-400">Multi-Hospital Smart Queue & Direct Department Routing</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link to="/" className="hover:text-teal-400 transition-colors">Patient Portal</Link>
            <Link to="/checkin" className="hover:text-teal-400 transition-colors">Book Token</Link>
            <Link to="/tracker" className="hover:text-teal-400 transition-colors">Live Tracker</Link>
            <Link to="/receptionist" className="hover:text-teal-400 transition-colors">Receptionist Desk</Link>
            <Link to="/doctor" className="hover:text-teal-400 transition-colors">Doctor Room</Link>
            <Link to="/admin" className="hover:text-teal-400 transition-colors">Hospital Admin</Link>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 Partner Hospitals Connected</span>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} MediQ AI Healthcare Network.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>HIPAA-Compliant Patient Data Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
