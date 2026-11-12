import React, { useState } from 'react'
import { X, Sparkles, UserCheck, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { useQueue } from '../../context/QueueContext'
import { BookingType } from '../../types'

export default function ReleasedSlotAssignModal({ isOpen, onClose, releasedPatient, onAssigned }) {
  const { patients, assignReleasedSlotToWalkIn } = useQueue()

  const [selectedWalkInToken, setSelectedWalkInToken] = useState('')

  if (!isOpen || !releasedPatient) return null

  // Find waiting walk-in patients in this department
  const eligibleWalkIns = patients.filter(
    (p) =>
      p.bookingType === BookingType.WALK_IN &&
      p.department === releasedPatient.department &&
      p.status === 'waiting'
  )

  const handleAssign = (e) => {
    e.preventDefault()
    if (!selectedWalkInToken) return

    const res = assignReleasedSlotToWalkIn(releasedPatient.token, selectedWalkInToken, 'Reception Desk')
    if (onAssigned) {
      onAssigned(res.message)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Assign Released Slot to Walk-In</h3>
              <p className="text-xs text-slate-500">Fast-track walk-in without displacing confirmed patients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Released Slot Details */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1">
            <div className="flex justify-between font-bold">
              <span>Unclaimed Released Slot:</span>
              <span>{releasedPatient.token} ({releasedPatient.department})</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Doctor: <strong>{releasedPatient.doctor}</strong> • Room: {releasedPatient.room} • Grace period elapsed.
            </p>
          </div>

          {/* List of Eligible Walk-In Patients */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Select Waiting Walk-In Patient for {releasedPatient.department} *
            </label>

            {eligibleWalkIns.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500">
                No walk-in patients currently waiting in {releasedPatient.department}.
              </div>
            ) : (
              <div className="space-y-2">
                {eligibleWalkIns.map((walkIn) => (
                  <label
                    key={walkIn.token}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWalkInToken === walkIn.token
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-400/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="walkInToken"
                        value={walkIn.token}
                        checked={selectedWalkInToken === walkIn.token}
                        onChange={(e) => setSelectedWalkInToken(e.target.value)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{walkIn.patientName}</span>
                        <span className="font-mono text-teal-700 font-bold ml-2">({walkIn.token})</span>
                        <p className="text-[11px] text-slate-500">Age: {walkIn.age} • Priority: {walkIn.priorityLabel}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      Waiting in OPD
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-slate-100 pt-2">
            Clinical Fairness Guarantee: Assigning this released slot utilizes doctor consultation capacity while fully safeguarding all confirmed and on-time patients.
          </p>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedWalkInToken}
              className="flex-2 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Assign & Fast-Track Walk-in</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
