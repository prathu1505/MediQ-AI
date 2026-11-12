import React from 'react'
import { QrCode, BrainCircuit, BellRing, UserCheck, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: QrCode,
    title: 'Digital Arrival & Token Generation',
    description:
      'Patients scan a QR kiosk at the entrance, enter via mobile browser, or request a token before leaving home.'
  },
  {
    step: '02',
    icon: BrainCircuit,
    title: 'AI Vitals & Severity Triage',
    description:
      'Smart triage algorithm evaluates chief complaints and vitals to assign ESI Emergency Priority (P1–P5) in seconds.'
  },
  {
    step: '03',
    icon: BellRing,
    title: 'Live Tracking & Timed Notifications',
    description:
      'Patients wait in comfort — receiving automated WhatsApp/SMS alerts when their consultation is 10 minutes away.'
  },
  {
    step: '04',
    icon: UserCheck,
    title: 'Physician Consultation & Fast Exit',
    description:
      'Doctors receive pre-triaged patient summaries, reducing consultation overhead and speeding up patient turnover.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Patient Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How MediQ AI Reinvents the Waiting Room
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            From arrival to doctor consultation — simplified into an automated, transparent, and humane process.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 font-mono">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
                  <span>Seamless flow</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
