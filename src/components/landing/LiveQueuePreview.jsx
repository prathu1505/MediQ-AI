import React, { useState } from 'react'
import {
  Clock,
  User,
  Activity,
  CheckCircle,
  AlertCircle,
  Hospital,
  Stethoscope,
  ChevronRight,
  Bell,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const sampleTokens = {
  'MQ-104': {
    token: 'MQ-104',
    patientInitials: 'S. J.',
    hospital: 'Metro Central Hospital',
    department: 'Emergency Care (ER)',
    priority: { code: 'P2', label: 'Very Urgent (Triage 2)', color: 'border-amber-500 text-amber-700 bg-amber-50' },
    status: 'In Triage Review',
    positionAhead: 1,
    estimatedWait: '4 mins',
    assignedRoom: 'Triage Bay 3',
    servingDoctor: 'Dr. Michael Chen, MD',
    step: 2,
    totalSteps: 4,
    updates: [
      { time: '10:14 AM', text: 'Checked in via Mobile QR' },
      { time: '10:18 AM', text: 'AI Vitals Assessment completed' },
      { time: '10:22 AM', text: 'Routed to Triage Nurse' }
    ]
  },
  'MQ-308': {
    token: 'MQ-308',
    patientInitials: 'D. P.',
    hospital: 'Apex Health & Urgent Care',
    department: 'Outpatient Clinic (OPD)',
    priority: { code: 'P4', label: 'Standard Consultation', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
    status: 'NOW SERVING - PLEASE PROCEED',
    positionAhead: 0,
    estimatedWait: '0 mins (Your Turn!)',
    assignedRoom: 'Consultation Suite 4',
    servingDoctor: 'Dr. Priya Sharma, MD',
    step: 3,
    totalSteps: 4,
    updates: [
      { time: '09:40 AM', text: 'Digital Token Generated' },
      { time: '09:55 AM', text: 'Pre-check completed' },
      { time: '10:15 AM', text: 'Doctor is ready in Suite 4' }
    ]
  },
  'MQ-412': {
    token: 'MQ-412',
    patientInitials: 'E. Z.',
    hospital: 'St. Jude Trauma & ER',
    department: 'Pediatrics Wing',
    priority: { code: 'P3', label: 'Urgent Assessment', color: 'border-blue-500 text-blue-700 bg-blue-50' },
    status: 'Diagnostic Lab In Progress',
    positionAhead: 3,
    estimatedWait: '18 mins',
    assignedRoom: 'Pediatric Lab 2',
    servingDoctor: 'Dr. Arthur Vance, MD',
    step: 2,
    totalSteps: 4,
    updates: [
      { time: '10:02 AM', text: 'Arrival verified' },
      { time: '10:10 AM', text: 'Initial nurse observation' },
      { time: '10:25 AM', text: 'Lab sample sent for rapid panel' }
    ]
  }
}

export default function LiveQueuePreview({ selectedToken, onClearSelection }) {
  const [activeToken, setActiveToken] = useState(selectedToken || 'MQ-104')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedToken) {
      setActiveToken(selectedToken)
    }
  }, [selectedToken])

  const ticket = sampleTokens[activeToken] || {
    token: activeToken,
    patientInitials: 'G. U.',
    hospital: 'Metro Central Hospital',
    department: 'General Medicine',
    priority: { code: 'P4', label: 'Standard Care', color: 'border-teal-500 text-teal-700 bg-teal-50' },
    status: 'In Queue',
    positionAhead: 4,
    estimatedWait: '16 mins',
    assignedRoom: 'Waiting Lounge B',
    servingDoctor: 'On-Call Physician Team',
    step: 1,
    totalSteps: 4,
    updates: [
      { time: 'Just now', text: 'Active token verified in regional queue system' }
    ]
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <section id="live-queue" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Patient Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Live Patient Queue & Virtual Ticket
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Patients get accurate, minute-by-minute wait forecasts on their smartphone, eliminating crowded waiting rooms and anxiety.
          </p>

          {/* Token Switcher Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Test Token:</span>
            {['MQ-104', 'MQ-308', 'MQ-412'].map((tok) => (
              <button
                key={tok}
                onClick={() => setActiveToken(tok)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeToken === tok
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tok}
              </button>
            ))}
          </div>
        </div>

        {/* Live Ticket Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-9 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
            
            {/* Top Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Ticket Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                  <Hospital className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{ticket.hospital}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{ticket.department}</span>
                    <span>•</span>
                    <span className="text-teal-400 font-medium">Room: {ticket.assignedRoom}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  title="Refresh live queue status"
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
                </button>
                <div className="px-3.5 py-1.5 rounded-xl bg-teal-950/80 border border-teal-700/60 text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Token
                </div>
              </div>
            </div>

            {/* Big Token Number & Wait Stats */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
              
              <div className="sm:border-r sm:border-slate-800 pr-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Your Assigned Token</span>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 text-teal-300 font-mono">
                  {ticket.token}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5" /> Patient: {ticket.patientInitials}
                </div>
              </div>

              <div className="sm:border-r sm:border-slate-800 pr-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Queue Position Ahead</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {ticket.positionAhead === 0 ? (
                    <span className="text-emerald-400 text-2xl font-bold">You're Next!</span>
                  ) : (
                    <span>{ticket.positionAhead} <span className="text-lg font-normal text-slate-400">patients</span></span>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Triage Priority: <span className="font-semibold text-slate-200">{ticket.priority.code}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estimated Wait</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span>{ticket.estimatedWait}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> AI Dynamic Calculation
                </div>
              </div>

            </div>

            {/* Stepper Progress Bar */}
            <div className="pt-4 pb-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>1. Check-In</span>
                <span>2. Triage & Vitals</span>
                <span>3. Doctor Consultation</span>
                <span>4. Care Plan & Meds</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(ticket.step / ticket.totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Notification & Doctor info */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400">Attending Physician</p>
                  <p className="text-sm font-semibold text-slate-100">{ticket.servingDoctor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                <Bell className="w-3.5 h-3.5" />
                <span>SMS notification ready at 5-min mark</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
