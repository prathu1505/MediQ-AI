import React from 'react'
import { ArrowRight, ShieldCheck, Hospital, Sparkles, PhoneCall } from 'lucide-react'

export default function CTASection({ onOpenDemo }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 p-8 sm:p-14 lg:p-20 text-white shadow-2xl overflow-hidden">
          
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-teal-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Hospital Queue Orchestration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Eliminate Waiting Room Chaos in Your Hospital Network
            </h2>

            <p className="text-base sm:text-lg text-teal-50 max-w-2xl leading-relaxed">
              Connect your emergency departments, outpatient centers, and clinics to MediQ AI. Deploy our zero-hardware mobile queue system in days with full EHR & FHIR interoperability.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button
                onClick={onOpenDemo}
                className="px-8 py-4 bg-white text-teal-800 hover:bg-teal-50 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenDemo}
                className="px-8 py-4 bg-teal-800/60 hover:bg-teal-800/80 border border-white/30 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Hospital className="w-4 h-4" />
                <span>Hospital Admin Portal</span>
              </button>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-teal-100/90 border-t border-white/20">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> HIPAA & GDPR Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> HL7 FHIR Interoperable
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Zero Hardware Required
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
