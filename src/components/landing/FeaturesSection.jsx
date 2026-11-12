import React from 'react'
import {
  Share2,
  Brain,
  Smartphone,
  ShieldAlert,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  HeartPulse,
  Network
} from 'lucide-react'

const features = [
  {
    icon: Network,
    badge: 'Multi-Facility',
    title: 'Cross-Hospital Load Balancing',
    description:
      'Dynamically redistributes outpatient and non-emergency queues across neighboring medical centers when one facility experiences emergency surges.',
    color: 'from-teal-500 to-cyan-500',
    lightBg: 'bg-teal-50 border-teal-200 text-teal-700'
  },
  {
    icon: Brain,
    badge: 'Predictive Intelligence',
    title: 'AI Medical Triage & Prioritization',
    description:
      'Instantly classifies incoming patients using standard Emergency Severity Index (ESI) protocols, prioritizing critical chest pains and strokes ahead of routine visits.',
    color: 'from-blue-500 to-indigo-500',
    lightBg: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    icon: Smartphone,
    badge: 'Patient Experience',
    title: 'Live Mobile Token Tracking',
    description:
      'Patients track their live position from home, nearby cafes, or parked cars without staying in germ-prone, crowded waiting rooms.',
    color: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  {
    icon: Clock,
    badge: 'Precision Timing',
    title: 'Dynamic Wait-Time Forecasting',
    description:
      'Machine learning models analyze doctor consultation speeds, lab processing latencies, and diagnostic delays to forecast wait times down to the minute.',
    color: 'from-cyan-500 to-blue-500',
    lightBg: 'bg-cyan-50 border-cyan-200 text-cyan-700'
  },
  {
    icon: ShieldAlert,
    badge: 'Clinical Coordination',
    title: 'Emergency Divert Orchestration',
    description:
      'Instantly alerts incoming ambulances and emergency medical services when an emergency department reaches peak capacity, routing them to the closest open facility.',
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-700'
  },
  {
    icon: Layers,
    badge: 'Cloud Infrastructure',
    title: 'Supabase Realtime Sync Engine',
    description:
      'Built on high-speed Supabase WebSockets. Doctor calls, triage changes, and queue advancements propagate across thousands of concurrent devices in under 80ms.',
    color: 'from-indigo-500 to-purple-500',
    lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
            <Sparkles className="w-3.5 h-3.5" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Engineered for High-Pressure Medical Environments
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            MediQ AI combines predictive algorithms, multi-facility networking, and patient-first interfaces to modernize the healthcare journey from check-in to discharge.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shadow-teal-500/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.lightBg}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-500" />
                  <span>Enterprise Medical Ready</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
