import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  UserPlus,
  Hospital,
  Stethoscope,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  XCircle,
  Smartphone
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'
import { Stage1BookingStatus, Stage2AttendanceStatus } from '../types'

export default function CheckInPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { hospitals, departments, addPatient, getDepartmentStats, answerStage1Verification } = useQueue()

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

  // Handle Age change - auto-detect minor
  const handleAgeChange = (e) => {
    const ageVal = e.target.value
    const isUnder18 = ageVal !== '' && parseInt(ageVal, 10) < 18
    setFormData((prev) => ({
      ...prev,
      age: ageVal,
      isMinor: isUnder18,
    }))
  }

  // Recalculate stats for selected department & hospital
  const deptLiveStats = getDepartmentStats(formData.hospital, formData.department)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.patientName.trim()) return

    // If minor, require guardian phone and name
    if (formData.isMinor && (!formData.guardianName.trim() || !formData.guardianPhone.trim())) {
      alert('For minor patients (under 18), guardian name and contact number are strictly required.')
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
    const res = await answerStage1Verification(generatedTicket.token, response)
    setVerificationFeedback(res)
    setGeneratedTicket((prev) => ({
      ...prev,
      bookingVerificationStatus: res.status === 'verified' ? Stage1BookingStatus.VERIFIED : Stage1BookingStatus.FLAGGED_UNAUTHORIZED,
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
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Two-Stage Verified Patient Check-In</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Patient Check-In & Token Booking
        </h1>
        <p className="text-sm text-slate-600">
          Tokens are assigned directly to the chosen department. Two-stage verification ensures queue integrity and avoids empty ghost slots.
        </p>
      </div>

      {generatedTicket ? (
        /* Token Generated Success Card with Stage 1 Verification Widget */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm border border-teal-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
              Token Reserved Successfully
            </span>
            <div className="text-5xl font-black text-slate-900 tracking-tight mt-1 font-mono text-teal-600">
              {generatedTicket.token}
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-2">
              Patient: <span className="text-slate-900 font-bold">{generatedTicket.patientName}</span>
              {generatedTicket.age && <span> (Age: {generatedTicket.age})</span>}
            </p>
          </div>

          {/* STAGE 1 VERIFICATION SECTION ON THE TICKET */}
          <div className="p-5 rounded-2xl border text-left space-y-3 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-teal-600" />
                <span>STAGE 1: Booking Authentication</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                {generatedTicket.bookingVerificationStatus === Stage1BookingStatus.VERIFIED
                  ? 'VERIFIED'
                  : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY
                  ? 'EMERGENCY BYPASS'
                  : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED
                  ? 'FLAGGED UNAUTHORIZED'
                  : 'PENDING VERIFICATION'}
              </span>
            </div>

            {generatedTicket.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong>Emergency Protocol Active:</strong> Booking verification delay bypassed for immediate life-saving medical care.</span>
              </div>
            ) : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Booking Verified:</strong> Token activated into active queue. Stage 2 attendance prompt dispatched.</span>
              </div>
            ) : generatedTicket.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong>Flagged as Unauthorized:</strong> Hospital reception alerted and slot released from queue.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {generatedTicket.isMinor ? (
                    <span>
                      Notification sent to Guardian <strong>{generatedTicket.guardianName}</strong> ({generatedTicket.guardianPhone}):
                      <br />
                      <em>"Did you or your guardian request this hospital appointment for your ward {generatedTicket.patientName}?"</em>
                    </span>
                  ) : (
                    <span>
                      Verification notification sent to <strong>{generatedTicket.phone}</strong>:
                      <br />
                      <em>"Did you or your guardian request this hospital appointment?"</em>
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleStage1Answer('YES')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>YES, Authorize Booking</span>
                  </button>
                  <button
                    onClick={() => handleStage1Answer('NO')}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>NO, Cancel Request</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Details breakdown */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-bold text-slate-800">{generatedTicket.hospital}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Department:</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {generatedTicket.department}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Attending Specialist:</span>
              <span className="font-semibold text-slate-800">{generatedTicket.doctor}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Room:</span>
              <span className="font-semibold text-slate-800">{generatedTicket.room}</span>
            </div>
            {generatedTicket.isMinor && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-amber-800 bg-amber-50/50 p-1.5 rounded">
                <span className="font-medium">Guardian Consent:</span>
                <span className="font-bold">{generatedTicket.guardianName} ({generatedTicket.guardianRelationship})</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Estimated Waiting Time:</span>
              <span className="font-extrabold text-teal-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{generatedTicket.estimatedWaitMinutes} mins
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(`/tracker?token=${generatedTicket.token}`)}
              className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Track in Live Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/staff')}
              className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Verify in Staff Portal</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
            >
              Book another patient token
            </button>
          </div>
        </div>
      ) : (
        /* Check-In Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Phone & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (For Verification SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9840123456"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Age *
                  </label>
                  {formData.isMinor && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Minor (Under 18)
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
                  placeholder="e.g. 14"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* MINOR PATIENT GUARDIAN FIELDS (Mandatory if Age < 18) */}
            {formData.isMinor && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Minor Patient Protection Protocol: Guardian Required</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  As the patient is a minor, booking verification notifications are sent exclusively to the guardian's contact.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                      Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Deepa Nathan (Parent)"
                      className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                      Guardian Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="e.g. 9876501234"
                      className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Relationship to Minor
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

            {/* Select Hospital */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Hospital *
              </label>
              <select
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
              >
                {hospitals.map((hosp) => (
                  <option key={hosp.id} value={hosp.name}>
                    {hosp.name} ({hosp.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Department (Isolated Queue!) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Department (Direct Queue Routing) *
                </label>
                <span className="text-[11px] font-semibold text-teal-600">
                  Current Wait: {deptLiveStats.estimatedWait} ({deptLiveStats.waitingCount} in line)
                </span>
              </div>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-teal-300 bg-teal-50/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold text-teal-900"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name} — {dept.defaultDoctor} ({dept.room})
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency / Priority (with Emergency Bypass Alert) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Triage Priority Assessment *
                </label>
                {formData.priority === 'P1' && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Emergency Bypass Enabled
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'P4', label: 'Routine / Standard', desc: 'Regular checkup' },
                  { code: 'P2', label: 'Urgent Care', desc: 'Acute pain / high fever' },
                  { code: 'P1', label: 'Emergency (P1)', desc: 'Immediate trauma / chest pain' },
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
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {formData.priority === 'P1' && (
                <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Clinical Safety Notice:</strong> Priority 1 emergency cases automatically bypass booking verification delays so urgent medical care is never delayed.
                  </span>
                </div>
              )}
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chief Health Issue / Symptoms
              </label>
              <textarea
                rows={2}
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="e.g. Chest tightness, fever, knee injury..."
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Request Token (Triggers Stage 1 Verification)</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  )
}
