import React, { useState } from 'react'
import { X, ArrowRightLeft, Hospital, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useQueue } from '../../context/QueueContext'
import { DoctorStatus } from '../../types'

export default function DepartmentTransferModal({ isOpen, onClose, patient, onTransferred }) {
  const { departments, transferPatientDepartment } = useQueue()

  const [targetDept, setTargetDept] = useState(
    patient?.department === 'General Medicine' ? 'Cardiology' : 'General Medicine'
  )
  const [targetDoctor, setTargetDoctor] = useState('')
  const [reason, setReason] = useState('')
  const [transferredBy, setTransferredBy] = useState('Dr. Anitha (Attending Physician)')

  if (!isOpen || !patient) return null

  const targetDeptConfig = departments.find((d) => d.name === targetDept) || departments[0]
  const availableDocs = targetDeptConfig.doctors || []

  const handleTransferSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim()) return

    const res = await transferPatientDepartment({
      tokenId: patient.token,
      fromDept: patient.department,
      toDept: targetDept,
      targetDoctor: targetDoctor || availableDocs[0]?.name,
      reason: reason.trim(),
      transferredBy,
    })

    if (onTransferred) {
      onTransferred(res.message)
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
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Clinical Department Transfer</h3>
              <p className="text-xs text-slate-500">Reassign queue & notify patient: {patient.token}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleTransferSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Current State Summary */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-slate-800">{patient.patientName} ({patient.token})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Department:</span>
              <span className="font-bold text-slate-700">{patient.department} ({patient.doctor})</span>
            </div>
          </div>

          {/* Target Department */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Transfer To Department *
            </label>
            <select
              value={targetDept}
              onChange={(e) => {
                setTargetDept(e.target.value)
                setTargetDoctor('')
              }}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold text-teal-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {departments
                .filter((d) => d.name !== patient.department)
                .map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.room})
                  </option>
                ))}
            </select>
          </div>

          {/* Target Doctor */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Select Receiving Specialist *
            </label>
            <select
              value={targetDoctor}
              onChange={(e) => setTargetDoctor(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {availableDocs.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} [{doc.status === DoctorStatus.AVAILABLE ? 'Available' : doc.status}] ({doc.room})
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Clinical Reason for Referral / Transfer *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Initial vitals and ECG show ST elevation; referred urgently to Cardiology for specialist assessment..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Staff Member */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Authorizing Staff / Physician *
            </label>
            <input
              type="text"
              required
              value={transferredBy}
              onChange={(e) => setTransferredBy(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

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
              className="flex-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Transfer & Recalculate Queue</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
