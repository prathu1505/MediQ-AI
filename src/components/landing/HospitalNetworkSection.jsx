import React from 'react'
import { Hospital, MapPin, Users, Activity, Clock, ShieldCheck, ChevronRight, Stethoscope } from 'lucide-react'

const hospitals = [
  {
    id: 'hosp-1',
    name: 'Metro Central General Hospital',
    type: 'Level 1 Trauma Center • 650 Beds',
    location: 'Central Downtown • 1.2 miles away',
    status: 'Optimal',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    currentWait: '14 mins',
    activeDoctors: 18,
    queueCount: 8,
    departments: ['ER', 'Cardiology', 'ICU', 'Radiology']
  },
  {
    id: 'hosp-2',
    name: 'St. Jude Regional Medical Pavilion',
    type: 'Regional Emergency & Surgical • 420 Beds',
    location: 'North Sector • 3.8 miles away',
    status: 'Surge Warning',
    statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    currentWait: '52 mins',
    activeDoctors: 12,
    queueCount: 29,
    departments: ['Trauma', 'Pediatrics', 'Ortho', 'Emergency']
  },
  {
    id: 'hosp-3',
    name: 'Apex Health & FastTrack Urgent Care',
    type: 'Urgent Care & Outpatient • 180 Beds',
    location: 'East Pavilion • 2.4 miles away',
    status: 'Fast Track Available',
    statusColor: 'bg-teal-50 text-teal-700 border-teal-200',
    dotColor: 'bg-teal-500',
    currentWait: '6 mins',
    activeDoctors: 9,
    queueCount: 3,
    departments: ['Urgent Care', 'Diagnostics', 'Pharmacy']
  },
  {
    id: 'hosp-4',
    name: 'West Valley Memorial Hospital',
    type: 'Community Health & Oncology • 310 Beds',
    location: 'West Campus • 5.1 miles away',
    status: 'Normal',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    currentWait: '19 mins',
    activeDoctors: 14,
    queueCount: 11,
    departments: ['General OPD', 'Oncology', 'Cardiology']
  }
]

export default function HospitalNetworkSection({ onSelectHospital }) {
  return (
    <section id="network" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800">
              <Hospital className="w-3.5 h-3.5" /> Multi-Hospital Unified Grid
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Connected Healthcare Facilities Across the Region
            </h2>
            <p className="text-slate-600 text-base">
              MediQ AI links emergency rooms and specialized clinics into a unified load-balanced network. If one hospital surges, incoming patients are intelligently rerouted.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry sync: 100% active</span>
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="group bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{hosp.type}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {hosp.location}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${hosp.statusColor}`}>
                    <span className={`w-2 h-2 rounded-full ${hosp.dotColor}`} />
                    {hosp.status}
                  </span>
                </div>

                {/* Key Telemetry Stats */}
                <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-white rounded-2xl border border-slate-200/70">
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] font-medium text-slate-400 block">Est. Wait Time</span>
                    <span className="text-base sm:text-lg font-extrabold text-teal-600 flex items-center justify-center sm:justify-start gap-1">
                      <Clock className="w-4 h-4 text-teal-500" />
                      {hosp.currentWait}
                    </span>
                  </div>

                  <div className="text-center sm:text-left border-x border-slate-100 px-2">
                    <span className="text-[11px] font-medium text-slate-400 block">Active Doctors</span>
                    <span className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                      <Stethoscope className="w-4 h-4 text-slate-500" />
                      {hosp.activeDoctors}
                    </span>
                  </div>

                  <div className="text-center sm:text-left">
                    <span className="text-[11px] font-medium text-slate-400 block">In Queue</span>
                    <span className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      {hosp.queueCount}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {hosp.departments.map((dept, dIdx) => (
                    <span key={dIdx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-600">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Accepting walk-in & ambulance transfers
                </span>
                <button
                  onClick={() => onSelectHospital && onSelectHospital(hosp.name)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
                >
                  <span>Select & Join Queue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
