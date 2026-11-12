import React, { useState } from 'react'
import { X, Hospital, Stethoscope, User, Sparkles, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react'

export default function DemoModal({ isOpen, onClose, defaultHospital = 'Metro Central Hospital' }) {
  const [activeTab, setActiveTab] = useState('patient') // 'patient' or 'staff'
  const [patientName, setPatientName] = useState('')
  const [selectedHospital, setSelectedHospital] = useState(defaultHospital)
  const [symptom, setSymptom] = useState('')
  const [generatedToken, setGeneratedToken] = useState(null)

  if (!isOpen) return null

  const handleGenerateToken = (e) => {
    e.preventDefault()
    const randomNum = Math.floor(100 + Math.random() * 900)
    const token = `MQ-${randomNum}`
    setGeneratedToken({
      token,
      name: patientName || 'Patient',
      hospital: selectedHospital,
      symptom: symptom || 'General Consultation',
      wait: '12 mins',
      position: '3'
    })
  }

  const handleReset = () => {
    setGeneratedToken(null)
    setPatientName('')
    setSymptom('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              MQ
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">MediQ AI Interactive Portal</h3>
              <p className="text-xs text-slate-500">Live multi-hospital simulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 text-sm">
          <button
            onClick={() => { setActiveTab('patient'); handleReset(); }}
            className={`pb-3 font-semibold transition-all relative ${
              activeTab === 'patient'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Patient Digital Check-In
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`pb-3 font-semibold transition-all relative ${
              activeTab === 'staff'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Staff View
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'patient' ? (
            generatedToken ? (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Virtual Token Generated
                  </span>
                  <div className="text-4xl font-black text-slate-900 tracking-tight mt-1 font-mono text-teal-600">
                    {generatedToken.token}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Assigned to: <strong className="text-slate-700">{generatedToken.name}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Facility:</span>
                    <span className="font-semibold text-slate-800">{generatedToken.hospital}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Queue Position:</span>
                    <span className="font-semibold text-slate-800">#{generatedToken.position} in line</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Waiting Time:</span>
                    <span className="font-bold text-teal-600">{generatedToken.wait}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Check in another patient
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Name or Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Choose Hospital Facility
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option>Metro Central Hospital (Est. 14m wait)</option>
                    <option>St. Jude Trauma & ER (Est. 52m wait)</option>
                    <option>Apex Health & Urgent Care (Est. 6m wait)</option>
                    <option>West Valley Memorial Hospital (Est. 19m wait)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chief Complaint / Department
                  </label>
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="e.g. Mild chest discomfort, headache, fever..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Smart Token</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="text-xs text-teal-900">
                  <p className="font-bold">Doctor & Triage Nurse Control Room</p>
                  <p>Real-time queue sequencing powered by Supabase subscription.</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Token MQ-104</span>
                    <p className="text-slate-500">Triage: P2 Emergent • Sarah J.</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold">Calling Next</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Token MQ-308</span>
                    <p className="text-slate-500">Triage: P4 Standard • David P.</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">In Room 4</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
