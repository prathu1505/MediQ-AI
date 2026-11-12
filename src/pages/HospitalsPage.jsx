import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Hospital,
  MapPin,
  Stethoscope,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'

export default function HospitalsPage() {
  const { hospitals, departments, getDepartmentStats } = useQueue()
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0].name)

  const currentHosp = hospitals.find((h) => h.name === selectedHospital) || hospitals[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Hospital className="w-3.5 h-3.5 text-teal-600" />
          <span>Multi-Hospital Queue Grid</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Hospitals & Department Queues
        </h1>
        <p className="text-sm text-slate-600">
          Select a hospital to view department-level doctor availability and waiting times.
        </p>
      </div>

      {/* Hospital Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {hospitals.map((hosp) => (
          <button
            key={hosp.id}
            onClick={() => setSelectedHospital(hosp.name)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedHospital === hosp.name
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{hosp.name}</span>
          </button>
        ))}
      </div>

      {/* Current Hospital Card Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Operational & Online</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{currentHosp.name}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentHosp.location} • {currentHosp.type}
          </p>
        </div>

        <Link
          to={`/checkin?hospital=${encodeURIComponent(currentHosp.name)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
        >
          <span>Book Token at this Hospital</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Departments Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Department-Wise Live Queues for {currentHosp.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const stats = getDepartmentStats(currentHosp.name, dept.name)
            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{dept.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{dept.room}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                      {stats.waitingCount === 0 ? 'No Wait' : `${stats.waitingCount} in line`}
                    </span>
                  </div>

                  <div className="space-y-2 py-2 text-xs border-y border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Doctor on duty:</span>
                      <span className="font-semibold text-slate-800">{dept.defaultDoctor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Est. Waiting Time:</span>
                      <span className="font-extrabold text-teal-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {stats.estimatedWait}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3">
                  <Link
                    to={`/checkin?hospital=${encodeURIComponent(currentHosp.name)}&department=${encodeURIComponent(dept.name)}`}
                    className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Queue for {dept.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
