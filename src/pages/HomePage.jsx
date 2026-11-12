import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  UserPlus,
  Search,
  Hospital,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Building2,
  Building,
  Lock
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'

export default function HomePage() {
  const [tokenSearch, setTokenSearch] = useState('')
  const navigate = useNavigate()
  const { hospitals, departments, patients, getDepartmentStats } = useQueue()

  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (tokenSearch.trim()) {
      navigate(`/tracker?token=${encodeURIComponent(tokenSearch.trim().toUpperCase())}`)
    }
  }

  const waitingTotal = patients.filter((p) => p.status === 'waiting').length

  return (
    <div className="space-y-16 py-10">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>AI Multi-Hospital Queue Orchestration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Smart Queue & Direct <span className="text-teal-600">Department Routing</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Supporting both online pre-bookings and walk-in OPD registrations. Patients are assigned directly to specialized clinical department queues with zero lobby waiting.
          </p>

          {/* Quick Token Search Box */}
          <div className="max-w-md mx-auto pt-2">
            <form onSubmit={handleTrackSubmit} className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-300 shadow-md">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  placeholder="Enter Token (e.g. ON-102 or WK-201)..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-xs text-slate-500">
              Try sample tokens: <span onClick={() => navigate('/tracker?token=ON-101')} className="font-semibold text-teal-600 hover:underline cursor-pointer">ON-101 (Online)</span>, <span onClick={() => navigate('/tracker?token=WK-201')} className="font-semibold text-cyan-600 hover:underline cursor-pointer">WK-201 (Walk-in)</span>, or <span onClick={() => navigate('/tracker?token=ON-104')} className="font-semibold text-red-600 hover:underline cursor-pointer">ON-104 (ER)</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Portals Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">MediQ AI Portals & Clinical Roles</h2>
            <p className="text-xs text-slate-500">Dedicated interfaces for Patients, Receptionists, Doctors, and Administrators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Patient Portal */}
          <Link
            to="/checkin"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">Patient Portal</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Book & Track Token
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Pre-book online appointments with 2-stage mobile verification and track live turn from home.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-teal-600">
              <span>Open Patient Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Receptionist Desk */}
          <Link
            to="/receptionist"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider mb-1">Reception Desk</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                Walk-ins & Check-In
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Register walk-in patients, lookup profile directory, manage arrivals (Late/Arrived), and assign released slots.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-cyan-600">
              <span>Open Reception Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Doctor Consultation */}
          <Link
            to="/doctor"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Doctor Portal</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Consultation Room
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Consult verified & arrived patients, toggle availability (Available/Break), and refer/transfer departments.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-blue-600">
              <span>Open Doctor Console</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Hospital Admin */}
          <Link
            to="/admin"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">Hospital Admin</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Admin & Audit Log
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Configure grace periods (5m–30m), monitor multi-department metrics, and review HIPAA audit logs.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-purple-600">
              <span>Open Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Live Hospital Network Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Connected Hospital Network Status
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Patients are routed by department to avoid general queue delays
              </p>
            </div>
            <Link
              to="/hospitals"
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View full department breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {hospitals.map((hosp) => {
              const genStats = getDepartmentStats(hosp.name, 'General Medicine')
              const cardStats = getDepartmentStats(hosp.name, 'Cardiology')
              return (
                <div key={hosp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-500">{hosp.location}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Online" />
                  </div>

                  <div className="text-xs space-y-1.5 pt-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>General Medicine:</span>
                      <span className="font-semibold text-slate-800">{genStats.estimatedWait}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cardiology:</span>
                      <span className="font-semibold text-slate-800">{cardStats.estimatedWait}</span>
                    </div>
                  </div>

                  <Link
                    to={`/checkin?hospital=${encodeURIComponent(hosp.name)}`}
                    className="block text-center py-2 text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    Book Online Token
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
