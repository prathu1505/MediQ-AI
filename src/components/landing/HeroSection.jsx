import React, { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Clock,
  MapPin,
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  ChevronRight
} from 'lucide-react'

export default function HeroSection({ onTrackToken, onSelectHospital }) {
  const [tokenInput, setTokenInput] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (tokenInput.trim()) {
      onTrackToken(tokenInput.trim().toUpperCase())
    }
  }

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Multi-Hospital Queue Orchestration</span>
              <span className="text-teal-400">|</span>
              <span className="flex items-center gap-1 text-teal-600 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> AI Triage 2.0
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Multi-Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Smart Queue</span> & Patient Routing
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform chaotic emergency lobbies into seamless, predictive healthcare flows. Patients track live tokens in real-time while AI balances doctor loads across city hospitals.
            </p>

            {/* Search / Track Token Form */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter Token (e.g. MQ-204) or Patient ID..."
                    className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
              <div className="mt-2.5 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <span>Quick demo:</span>
                <button type="button" onClick={() => onTrackToken('MQ-104')} className="font-semibold text-teal-600 hover:underline">
                  Try "MQ-104" (In Triage)
                </button>
                <span>•</span>
                <button type="button" onClick={() => onTrackToken('MQ-308')} className="font-semibold text-teal-600 hover:underline">
                  Try "MQ-308" (Doctor Ready)
                </button>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Lobby Congestion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-Time SMS & Push Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Supabase Realtime Sync</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Multi-Hospital Status Widget */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Back card decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-6">
                
                {/* Header of widget */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-800 text-sm">
                      Regional Hospital Network
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    Live Feed
                  </span>
                </div>

                {/* Hospital List preview */}
                <div className="space-y-3">
                  
                  {/* Hospital 1 */}
                  <div
                    onClick={() => onSelectHospital && onSelectHospital('Metro General')}
                    className="group cursor-pointer p-3.5 rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/40 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700">
                            Metro Central Hospital
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Normal Load
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> Downtown Sector • 1.2 km away
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-teal-600">~14 min</span>
                        <p className="text-[10px] text-slate-400">Est. Wait</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> 8 in queue
                      </span>
                      <span className="text-[11px] font-medium text-teal-600 group-hover:underline flex items-center">
                        Select facility <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Hospital 2 */}
                  <div
                    onClick={() => onSelectHospital && onSelectHospital('St. Jude Medical')}
                    className="group cursor-pointer p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800">
                            St. Jude Trauma & ER
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            High Surge
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> North Hub • 3.8 km away
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-amber-600">~52 min</span>
                        <p className="text-[10px] text-slate-400">Est. Wait</p>
                      </div>
                    </div>
                    {/* AI Re-route suggestion banner */}
                    <div className="mt-2.5 bg-white/90 border border-amber-200 rounded-lg p-2 flex items-center gap-2 text-[11px] text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span><strong>AI Recommendation:</strong> Divert non-emergencies to Apex Clinic (save 38m)</span>
                    </div>
                  </div>

                  {/* Hospital 3 */}
                  <div
                    onClick={() => onSelectHospital && onSelectHospital('Apex Health')}
                    className="group cursor-pointer p-3.5 rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/40 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700">
                            Apex Health & Urgent Care
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                            Fast Track
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> East Pavilion • 2.4 km away
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-teal-600">~6 min</span>
                        <p className="text-[10px] text-slate-400">Est. Wait</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> 3 in queue
                      </span>
                      <span className="text-[11px] font-medium text-teal-600 group-hover:underline flex items-center">
                        Select facility <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Live System Stat */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    Cross-hospital synchronization active
                  </span>
                  <span className="font-semibold text-teal-600">100% Synced</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
