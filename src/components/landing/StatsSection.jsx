import React from 'react'
import { TrendingDown, Users, ShieldCheck, Building2 } from 'lucide-react'

const stats = [
  {
    icon: TrendingDown,
    value: '-48%',
    label: 'ER Lobby Waiting Time',
    desc: 'Average reduction across 8 hospitals'
  },
  {
    icon: Users,
    value: '12,500+',
    label: 'Daily Patients Routed',
    desc: 'Zero manual queue paper slips'
  },
  {
    icon: ShieldCheck,
    value: '99.4%',
    label: 'Triage Priority Match',
    desc: 'Emergency severity accuracy'
  },
  {
    icon: Building2,
    value: '8 Facilities',
    label: 'Regional Grid Sync',
    desc: 'Real-time bed & doctor sharing'
  }
]

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 py-16 text-white relative overflow-hidden">
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-teal-400">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-wider text-teal-300">Metric</span>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">
                  {item.desc}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
