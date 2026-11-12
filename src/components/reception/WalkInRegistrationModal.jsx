import React, { useState } from 'react'
import {
  X,
  UserPlus,
  Search,
  Sparkles,
  ShieldAlert,
  Hospital,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck,
  Clock,
  ArrowRight
} from 'lucide-react'
import { useQueue } from '../../context/QueueContext'
import { DoctorStatus, TriagePriority } from '../../types'
import {
  suggestDepartmentFromSymptoms,
  MANDATORY_MEDICAL_DISCLAIMER,
} from '../../utils/aiDepartmentAdvisor'
import { searchPatientProfile } from '../../services/queueDatabaseService'

export default function WalkInRegistrationModal({ isOpen, onClose, onRegistered }) {
  const { hospitals, departments, registerWalkInPatient } = useQueue()

  // Profile Lookup Query
  const [searchQuery, setSearchQuery] = useState('')
  const [profileFound, setProfileFound] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  // Form Fields
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    hospital: hospitals[0].name,
    department: 'General Medicine',
    assignedDoctor: '',
    priority: 'P4',
    symptoms: '',
    staffName: 'Receptionist Sarah',
  })

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState(null)

  if (!isOpen) return null

  // Search Profile
  const handleProfileLookup = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setIsSearching(true)
    const profile = await searchPatientProfile(searchQuery)
    setIsSearching(false)

    if (profile) {
      setProfileFound(profile)
      setFormData((prev) => ({
        ...prev,
        patientId: profile.patientId,
        patientName: profile.patientName,
        phone: profile.phone,
        age: profile.age.toString(),
        gender: profile.gender || 'Male',
        bloodGroup: profile.bloodGroup || 'B+',
      }))
    } else {
      setProfileFound(false)
    }
  }

  // Handle Symptom Typing -> Triggers AI Department Advisor
  const handleSymptomsChange = (e) => {
    const text = e.target.value
    setFormData((prev) => ({ ...prev, symptoms: text }))

    if (text.trim().length > 3) {
      const suggestion = suggestDepartmentFromSymptoms(text, formData.age)
      setAiSuggestion(suggestion)
    } else {
      setAiSuggestion(null)
    }
  }

  // Accept AI Suggestion
  const handleAcceptAiSuggestion = () => {
    if (!aiSuggestion) return
    setFormData((prev) => ({
      ...prev,
      department: aiSuggestion.department,
      priority: aiSuggestion.isEmergency ? 'P1' : prev.priority,
    }))
  }

  // Emergency One-Click Shortcut
  const handleImmediateEmergency = () => {
    setFormData((prev) => ({
      ...prev,
      department: 'Emergency Care',
      priority: 'P1',
      symptoms: prev.symptoms ? `EMERGENCY: ${prev.symptoms}` : 'CRITICAL EMERGENCY: Severe trauma / cardiac arrest',
    }))
    const suggestion = suggestDepartmentFromSymptoms('severe trauma emergency cardiac arrest', formData.age)
    setAiSuggestion(suggestion)
  }

  // Current department available doctors
  const selectedDeptConfig = departments.find((d) => d.name === formData.department) || departments[0]
  const availableDoctors = selectedDeptConfig?.doctors || []

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.patientName.trim()) return

    const newPatient = await registerWalkInPatient({
      patientId: formData.patientId || null,
      patientName: formData.patientName.trim(),
      phone: formData.phone.trim(),
      age: formData.age.trim(),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      hospital: formData.hospital,
      department: formData.department,
      assignedDoctor: formData.assignedDoctor || availableDoctors[0]?.name,
      priority: formData.priority,
      symptoms: formData.symptoms.trim() || 'General walk-in examination',
      aiSuggestedDept: aiSuggestion?.department || null,
      aiConfidence: aiSuggestion?.confidence || null,
      staffName: formData.staffName,
    })

    if (onRegistered) {
      onRegistered(newPatient)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Walk-in Patient Desk Registration</h3>
              <p className="text-xs text-slate-500">In-person outpatient intake & instant token generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          
          {/* 1. Existing Patient Profile Lookup */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>Retrieve Existing Patient Profile</span>
              </label>
              <span className="text-[10px] text-slate-400">Search by Patient ID or Mobile #</span>
            </div>

            <form onSubmit={handleProfileLookup} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. PID-1001 or 9840123456..."
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                {isSearching ? 'Searching...' : 'Search Profile'}
              </button>
            </form>

            {profileFound && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Profile Found: {profileFound.patientName} ({profileFound.patientId})</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Phone: {profileFound.phone} • Blood Group: {profileFound.bloodGroup} • Allergies: {profileFound.allergies || 'None'}
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-700">
                  Pre-filled
                </span>
              </div>
            )}

            {profileFound === false && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                No matching profile found. You can proceed below to register as a new patient profile.
              </div>
            )}
          </div>

          {/* Emergency Triage Shortcut Banner */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-red-900">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Critical Life-Threatening Emergency?</p>
                <p className="text-red-700 text-[11px]">Bypasses all normal queues and assigns immediately to Trauma Bay 1.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleImmediateEmergency}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              🚨 Fast-Track Emergency
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Patient Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9840123456"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Age, Gender, Blood Group */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 42"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chief Complaint / Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reported Problem / Chief Symptoms *
              </label>
              <textarea
                required
                rows={2}
                value={formData.symptoms}
                onChange={handleSymptomsChange}
                placeholder="Describe patient's reported symptoms (e.g., severe unilateral headache with dizziness, chest pain, knee joint injury)..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* AI DEPARTMENT SUGGESTION WIDGET (With Mandatory Staff Confirmation) */}
            {aiSuggestion && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-teal-900">
                      AI Suggested Department: <span className="underline">{aiSuggestion.department}</span>
                    </span>
                    <span className="text-[10px] font-extrabold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {aiSuggestion.confidence}% Match
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAcceptAiSuggestion}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Confirm & Select {aiSuggestion.department}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] text-teal-800 leading-relaxed">
                  <strong>Reasoning:</strong> {aiSuggestion.reasoning}
                </p>

                {/* Mandatory Disclaimer */}
                <p className="text-[10px] text-slate-500 italic pt-1 border-t border-teal-200/60">
                  {MANDATORY_MEDICAL_DISCLAIMER}
                </p>
              </div>
            )}

            {/* Department Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} ({dept.room})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Doctor *
                </label>
                <select
                  value={formData.assignedDoctor}
                  onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} [{doc.status === DoctorStatus.AVAILABLE ? 'Available' : doc.status}] ({doc.room})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Triage Priority Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { code: 'P4', label: 'Standard', color: 'border-slate-200' },
                  { code: 'P3', label: 'Semi-Urgent', color: 'border-amber-200' },
                  { code: 'P2', label: 'Urgent Care', color: 'border-orange-300' },
                  { code: 'P1', label: 'Emergency (P1)', color: 'border-red-400' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: item.code })}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                      formData.priority === item.code
                        ? item.code === 'P1'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-teal-600 text-white border-teal-600'
                        : `${item.color} bg-white text-slate-700 hover:bg-slate-50`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Walk-in Registration & Generate Unique Token</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  )
}
