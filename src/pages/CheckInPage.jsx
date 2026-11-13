
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Smartphone,
  Users
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'
import { Stage1BookingStatus } from '../types'

export default function CheckInPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    hospitals,
    departments,
    addPatient,
    getDepartmentStats,
    answerStage1Verification
  } = useQueue()

  const defaultHospital = searchParams.get('hospital') || hospitals[0].name
  const defaultDept = searchParams.get('department') || departments[0].name

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    age: '',
    isMinor: false,
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: 'Parent / Legal Guardian',
    hospital: defaultHospital,
    department: defaultDept,
    priority: 'P4',
    symptoms: '',
  })

  const [generatedTicket, setGeneratedTicket] = useState(null)
  const [verificationFeedback, setVerificationFeedback] = useState(null)

  const handleAgeChange = (e) => {
    const ageVal = e.target.value
    const isUnder18 = ageVal !== '' && parseInt(ageVal, 10) < 18

    setFormData((prev) => ({
      ...prev,
      age: ageVal,
      isMinor: isUnder18,
    }))
  }

  const deptLiveStats = getDepartmentStats(
    formData.hospital,
    formData.department
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patientName.trim()) return

    if (
      formData.isMinor &&
      (!formData.guardianName.trim() || !formData.guardianPhone.trim())
    ) {
      alert('Guardian name and phone number are required for patients under 18.')
      return
    }

    const newPatient = await addPatient({
      patientName: formData.patientName.trim(),
      phone: formData.phone.trim(),
      age: formData.age.trim(),
      isMinor: formData.isMinor,
      guardianName: formData.guardianName.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      guardianRelationship: formData.guardianRelationship,
      hospital: formData.hospital,
      department: formData.department,
      priority: formData.priority,
      symptoms: formData.symptoms.trim() || 'General Medical Consultation',
    })

    setGeneratedTicket(newPatient)
    setVerificationFeedback(null)
  }

  const handleStage1Answer = async (response) => {
    if (!generatedTicket) return

    const res = await answerStage1Verification(
      generatedTicket.token,
      response
    )

    setVerificationFeedback(res)

    setGeneratedTicket((prev) => ({
      ...prev,
      bookingVerificationStatus:
        res.status === 'verified'
          ? Stage1BookingStatus.VERIFIED
          : Stage1BookingStatus.FLAGGED_UNAUTHORIZED,
    }))
  }

  const handleReset = () => {
    setGeneratedTicket(null)
    setVerificationFeedback(null)

    setFormData({
      patientName: '',
      phone: '',
      age: '',
      isMinor: false,
      guardianName: '',
      guardianPhone: '',
      guardianRelationship: 'Parent / Legal Guardian',
      hospital: defaultHospital,
      department: defaultDept,
      priority: 'P4',
      symptoms: '',
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Patient Check-In
        </h1>
        <p className="text-sm text-slate-500">
          Book your appointment and get a queue token
        </p>
      </div>

      {generatedTicket ? (

        /* Generated Token */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">

          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-teal-700 uppercase">
              Token Generated
            </span>

            <div className="text-5xl font-black text-teal-600 mt-1 font-mono">
              {generatedTicket.token}
            </div>

            <p className="text-sm font-semibold text-slate-700 mt-2">
              {generatedTicket.patientName}
              {generatedTicket.age && ` · Age ${generatedTicket.age}`}
            </p>
          </div>

          {/* Booking Verification */}
          <div className="p-5 rounded-2xl border text-left space-y-3 bg-slate-50 border-slate-200">

            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-teal-600" />
                Booking Verification
              </span>

              <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                {generatedTicket.bookingVerificationStatus === Stage1BookingStatus.VERIFIED
                  ? 'VERIFIED'
                  : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY
                  ? 'EMERGENCY BYPASS'
                  : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED
                  ? 'UNAUTHORIZED'
                  : 'PENDING'}
              </span>
            </div>

            {generatedTicket.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ? (

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Emergency verification bypassed.
              </div>

            ) : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ? (

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Booking verified successfully.
              </div>

            ) : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED ? (

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                Booking marked as unauthorized.
              </div>

            ) : (

              <div className="space-y-3">

                <p className="text-sm font-semibold text-slate-800">
                  Did you or your guardian request this appointment?
                </p>

                {generatedTicket.isMinor && (
                  <p className="text-xs text-slate-500">
                    Verification contact: {generatedTicket.guardianName} · {generatedTicket.guardianPhone}
                  </p>
                )}

                {!generatedTicket.isMinor && (
                  <p className="text-xs text-slate-500">
                    Verification contact: {generatedTicket.phone}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={() => handleStage1Answer('YES')}
                    className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    YES
                  </button>

                  <button
                    onClick={() => handleStage1Answer('NO')}
                    className="py-3 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    NO
                  </button>

                </div>
              </div>
            )}

          </div>

          {/* Appointment Details */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Hospital</span>
              <span className="font-bold text-slate-800 text-right">
                {generatedTicket.hospital}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-teal-700 text-right">
                {generatedTicket.department}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Doctor</span>
              <span className="font-semibold text-slate-800 text-right">
                {generatedTicket.doctor}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Room</span>
              <span className="font-semibold text-slate-800">
                {generatedTicket.room}
              </span>
            </div>

            {generatedTicket.isMinor && (
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Guardian</span>
                <span className="font-semibold text-slate-800 text-right">
                  {generatedTicket.guardianName}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Estimated Wait</span>
              <span className="font-extrabold text-teal-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{generatedTicket.estimatedWaitMinutes} mins
              </span>
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <button
              onClick={() => navigate(`/tracker?token=${generatedTicket.token}`)}
              className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Track Token
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/staff')}
              className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Staff Portal
            </button>

          </div>

          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
          >
            Book Another Token
          </button>

        </div>

      ) : (

        /* Booking Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Patient Name *
              </label>

              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Phone and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Age *
                  </label>

                  {formData.isMinor && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Under 18
                    </span>
                  )}
                </div>

                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleAgeChange}
                  placeholder="Enter age"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Guardian Details */}
            {formData.isMinor && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">

                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4" />
                  Guardian Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Guardian Name *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="Enter guardian name"
                      className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Guardian Phone *
                    </label>

                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="Enter guardian phone"
                      className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    Relationship
                  </label>

                  <select
                    value={formData.guardianRelationship}
                    onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Parent / Legal Guardian">Parent / Legal Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Authorized Foster Caretaker">Authorized Foster Caretaker</option>
                  </select>
                </div>

              </div>
            )}

            {/* Hospital */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hospital *
              </label>

              <select
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                {hospitals.map((hosp) => (
                  <option key={hosp.id} value={hosp.name}>
                    {hosp.name} ({hosp.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Department *
                </label>

                <span className="text-[11px] font-semibold text-teal-600">
                  Wait: {deptLiveStats.estimatedWait} · {deptLiveStats.waitingCount} waiting
                </span>
              </div>

              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-teal-300 bg-teal-50/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-teal-900"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name} — {dept.defaultDoctor} ({dept.room})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Priority *
                </label>

                {formData.priority === 'P1' && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    Emergency Bypass
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'P4', label: 'Routine', desc: 'Standard' },
                  { code: 'P2', label: 'Urgent', desc: 'High priority' },
                  { code: 'P1', label: 'Emergency', desc: 'Immediate care' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: item.code })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.priority === item.code
                        ? item.code === 'P1'
                          ? 'border-red-600 bg-red-50 text-red-900 font-bold'
                          : 'border-teal-600 bg-teal-50/70 text-teal-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>

              {formData.priority === 'P1' && (
                <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  Emergency cases bypass booking verification delays.
                </div>
              )}
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Symptoms
              </label>

              <textarea
                rows={2}
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Enter symptoms"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Confirm & Generate Token
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>
      )}

    </div>
  )
}
