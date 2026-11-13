
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Stethoscope,
  Hospital,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Activity,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  RotateCcw,
  FileText,
  Building,
  Check,
  PhoneForwarded,
  Eye,
  Lock,
  UserPlus,
  ArrowRightLeft,
  Calendar,
  AlertTriangle,
  Settings,
  Coffee,
  Power
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'
import {
  BookingType,
  Stage1BookingStatus,
  Stage2AttendanceStatus,
  ArrivalStatus,
  SlotStatus,
  DoctorStatus,
} from '../types'
import WalkInRegistrationModal from '../components/reception/WalkInRegistrationModal'
import DepartmentTransferModal from '../components/reception/DepartmentTransferModal'
import ReleasedSlotAssignModal from '../components/reception/ReleasedSlotAssignModal'

export default function StaffPage({ initialTab = 'reception' }) {
  const {
    hospitals,
    departments,
    patients,
    auditLogs,
    gracePeriodMinutes,
    setGracePeriodMinutes,
    updateArrivalStatus,
    releaseUnclaimedSlot,
    updateDoctorAvailability,
    updatePatientStatus,
    sendVoiceCallReminder,
    sendReminderNotification,
    staffOverrideBookingStatus,
    getDepartmentStats,
  } = useQueue()

  const [activeTab, setActiveTab] = useState(initialTab)

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const [bookingTypeFilter, setBookingTypeFilter] = useState('all')

  const [filterHospital, setFilterHospital] = useState('all')
  const [filterDept, setFilterDept] = useState('all')
  const [filterArrival, setFilterArrival] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false)
  const [transferTargetPatient, setTransferTargetPatient] = useState(null)
  const [releasedSlotTarget, setReleasedSlotTarget] = useState(null)

  const [activeDoctorDept, setActiveDoctorDept] = useState('Cardiology')
  const [activeDoctorName, setActiveDoctorName] = useState('Dr. Sundar (Cardiologist)')

  const [actionAlert, setActionAlert] = useState('')

  const handleActionToast = (msg) => {
    setActionAlert(msg)
    setTimeout(() => setActionAlert(''), 4500)
  }

  const handleArrivalChange = (token, newStatus) => {
    const res = updateArrivalStatus(token, newStatus, 'Reception Desk')
    handleActionToast(res.message)
  }

  const handleReleaseSlot = (token) => {
    const res = releaseUnclaimedSlot(token, 'Reception Supervisor')
    handleActionToast(res.message)
  }

  // Only active patients should appear in operational queues.
  // Completed and cancelled records remain saved for history and audit.
  const isActivePatient = (patient) =>
    patient.status !== 'completed' && patient.status !== 'cancelled'

  const filteredPatients = patients.filter((p) => {
    if (!isActivePatient(p)) return false

    if (bookingTypeFilter !== 'all' && p.bookingType !== bookingTypeFilter) return false
    if (filterHospital !== 'all' && p.hospital !== filterHospital) return false
    if (filterDept !== 'all' && p.department !== filterDept) return false
    if (filterArrival !== 'all' && p.arrivalStatus !== filterArrival) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchToken = p.token.toLowerCase().includes(q)
      const matchName = p.patientName.toLowerCase().includes(q)
      const matchDept = p.department.toLowerCase().includes(q)
      const matchId = p.patientId && p.patientId.toLowerCase().includes(q)
      const matchPhone = p.phone && p.phone.includes(q)

      return matchToken || matchName || matchDept || matchId || matchPhone
    }

    return true
  })

  // All dashboard counts now include active patients only.
  const onlineCount = patients.filter(
    (p) => isActivePatient(p) && p.bookingType === BookingType.ONLINE
  ).length

  const walkInCount = patients.filter(
    (p) => isActivePatient(p) && p.bookingType === BookingType.WALK_IN
  ).length

  const arrivedCount = patients.filter(
    (p) => isActivePatient(p) && p.arrivalStatus === ArrivalStatus.ARRIVED
  ).length

  const lateCount = patients.filter(
    (p) => isActivePatient(p) && p.arrivalStatus === ArrivalStatus.LATE
  ).length

  // Released slots belong here even though their original booking is cancelled.
  const releasedSlotsList = patients.filter(
    (p) => p.slotStatus === SlotStatus.RELEASED_AVAILABLE
  )

  const doctorDeptConfig =
    departments.find((d) => d.name === activeDoctorDept) || departments[0]

  const currentDoctorObj =
    doctorDeptConfig.doctors.find((doc) => doc.name === activeDoctorName) ||
    doctorDeptConfig.doctors[0]

  const doctorPatients = patients
    .filter(
      (p) =>
        p.department === activeDoctorDept &&
        p.status !== 'cancelled' &&
        p.status !== 'completed' &&
        (p.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ||
          p.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ||
          p.bookingType === BookingType.WALK_IN)
    )
    .sort((a, b) => {
      if (a.priority === 'P1' && b.priority !== 'P1') return -1
      if (b.priority === 'P1' && a.priority !== 'P1') return 1
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Staff Control Panel
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Staff Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Walk-in Patient Registration</span>
          </button>
        </div>
      </div>

      {/* Action Toast */}
      {actionAlert && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-xs">
          <span>{actionAlert}</span>
          <button
            onClick={() => setActionAlert('')}
            className="text-teal-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Role Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('reception')}
          className={`pb-3.5 font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'reception'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Receptionist Dashboard</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">
            {patients.filter(isActivePatient).length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3.5 font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'departments'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Hospital className="w-4 h-4" />
          <span>Department Live Queues</span>
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`pb-3.5 font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'doctor'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor Consultation Room</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-teal-600 text-white">
            {doctorPatients.length} Waiting
          </span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-3.5 font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'admin'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Hospital Admin & Audit Log</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">
            {auditLogs.length} Events
          </span>
        </button>
      </div>

      {/* TAB 1: RECEPTION */}
      {activeTab === 'reception' && (
        <div className="space-y-6">

          {/* Released Slots */}
          {releasedSlotsList.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    {releasedSlotsList.length} Unclaimed Released Slot(s) Available!
                  </p>
                  <p className="text-amber-800 text-[11px]">
                    Available slots can be assigned to eligible walk-in patients.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {releasedSlotsList.map((slot) => (
                  <button
                    key={slot.token}
                    onClick={() => setReleasedSlotTarget(slot)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Assign {slot.token} ({slot.department})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Operational Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <div
              onClick={() => setBookingTypeFilter(bookingTypeFilter === BookingType.ONLINE ? 'all' : BookingType.ONLINE)}
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-all ${
                bookingTypeFilter === BookingType.ONLINE ? 'border-teal-500 ring-2 ring-teal-400/20' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
                <span>Online Bookings</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-teal-600 mt-1">
                {onlineCount}
              </div>
            </div>

            <div
              onClick={() => setBookingTypeFilter(bookingTypeFilter === BookingType.WALK_IN ? 'all' : BookingType.WALK_IN)}
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-all ${
                bookingTypeFilter === BookingType.WALK_IN ? 'border-cyan-500 ring-2 ring-cyan-400/20' : 'border-slate-200 hover:border-cyan-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
                <span>Walk-In Patients</span>
                <UserPlus className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-extrabold text-cyan-600 mt-1">
                {walkInCount}
              </div>
            </div>

            <div
              onClick={() => setFilterArrival(filterArrival === ArrivalStatus.ARRIVED ? 'all' : ArrivalStatus.ARRIVED)}
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-all ${
                filterArrival === ArrivalStatus.ARRIVED ? 'border-emerald-500 ring-2 ring-emerald-400/20' : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
                <span>Arrived On-Site</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {arrivedCount}
              </div>
            </div>

            <div
              onClick={() => setFilterArrival(filterArrival === ArrivalStatus.LATE ? 'all' : ArrivalStatus.LATE)}
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-all ${
                filterArrival === ArrivalStatus.LATE ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
                <span>Late / Grace Timer</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">
                {lateCount}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {gracePeriodMinutes}m grace
              </p>
            </div>

          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">

            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setBookingTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    bookingTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Patients ({patients.filter(isActivePatient).length})
                </button>
                <button
                  onClick={() => setBookingTypeFilter(BookingType.ONLINE)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    bookingTypeFilter === BookingType.ONLINE ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Online Bookings ({onlineCount})
                </button>
                <button
                  onClick={() => setBookingTypeFilter(BookingType.WALK_IN)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    bookingTypeFilter === BookingType.WALK_IN ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Walk-In Registrations ({walkInCount})
                </button>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by token, name, ID or mobile..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Filter by:</span>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>

              <select
                value={filterArrival}
                onChange={(e) => setFilterArrival(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="all">All Arrival States</option>
                <option value={ArrivalStatus.ARRIVED}>Arrived Only</option>
                <option value={ArrivalStatus.NOT_ARRIVED}>Not Arrived</option>
                <option value={ArrivalStatus.LATE}>Late Only</option>
              </select>

              {(filterDept !== 'all' || filterArrival !== 'all' || bookingTypeFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterDept('all')
                    setFilterArrival('all')
                    setBookingTypeFilter('all')
                    setSearchQuery('')
                  }}
                  className="text-teal-600 hover:underline font-bold ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>

          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No patient records found.</p>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isOnline = patient.bookingType === BookingType.ONLINE
                const isWalkIn = patient.bookingType === BookingType.WALK_IN
                const isArrived = patient.arrivalStatus === ArrivalStatus.ARRIVED
                const isLate = patient.arrivalStatus === ArrivalStatus.LATE
                const isSlotReleased = patient.slotStatus === SlotStatus.RELEASED_AVAILABLE

                return (
                  <div
                    key={patient.token}
                    className={`bg-white rounded-2xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isSlotReleased
                        ? 'border-amber-300 bg-amber-50/20'
                        : isLate
                        ? 'border-orange-300 bg-orange-50/15'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div className="text-center px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isOnline ? 'Online' : 'Walk-in'}
                        </span>
                        <span className="text-xl font-black text-teal-700 font-mono block">
                          {patient.token}
                        </span>
                        {patient.patientId && (
                          <span className="text-[9px] font-bold text-slate-500 block font-mono">{patient.patientId}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {patient.patientName}
                          </h4>
                          {patient.age && <span className="text-xs text-slate-500">({patient.age} yrs)</span>}

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isOnline
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            {isOnline ? 'Online Appointment' : 'Walk-In'}
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {patient.department}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              patient.priority === 'P1'
                                ? 'bg-red-600 text-white animate-pulse'
                                : patient.priority === 'P2'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {patient.priorityLabel}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-700">Dr: {patient.doctor}</span>
                          <span>•</span>
                          <span>Room: {patient.room}</span>
                          <span>•</span>
                          <span>Mobile: {patient.phone}</span>
                        </p>

                        <p className="text-xs text-slate-600">
                          <strong>Chief Complaint:</strong> {patient.symptoms}
                        </p>

                        {patient.slotStatus === SlotStatus.REASSIGNED_TO_WALKIN && (
                          <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            Slot reassigned to walk-in token: {patient.reassignedToToken}
                          </p>
                        )}

                        {patient.fastTrackedFromSlot && (
                          <p className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                            Fast-tracked into released slot from {patient.fastTrackedFromSlot}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Arrival Control */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">

                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Arrival Control
                        </span>

                        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                          <button
                            onClick={() => handleArrivalChange(patient.token, ArrivalStatus.ARRIVED)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                              isArrived ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Arrived
                          </button>
                          <button
                            onClick={() => handleArrivalChange(patient.token, ArrivalStatus.NOT_ARRIVED)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                              patient.arrivalStatus === ArrivalStatus.NOT_ARRIVED ? 'bg-slate-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Not Arrived
                          </button>
                          <button
                            onClick={() => handleArrivalChange(patient.token, ArrivalStatus.LATE)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                              isLate ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Patient Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto text-xs">

                      <button
                        onClick={() => setTransferTargetPatient(patient)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                        title="Transfer patient to another clinical department"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                        <span>Transfer Dept</span>
                      </button>

                      {isLate && patient.slotStatus !== SlotStatus.RELEASED_AVAILABLE && patient.status === 'waiting' && (
                        <button
                          onClick={() => handleReleaseSlot(patient.token)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-colors"
                          title="Release unclaimed slot after grace period"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Release Slot</span>
                        </button>
                      )}

                      {isSlotReleased && (
                        <button
                          onClick={() => setReleasedSlotTarget(patient)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Assign to Walk-in</span>
                        </button>
                      )}

                      <Link
                        to={`/tracker?token=${patient.token}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-xl"
                        title="Live Patient Tracker View"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                    </div>

                  </div>
                )
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 2: DEPARTMENT QUEUES */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900">
            <div className="flex items-center gap-2.5">
              <Hospital className="w-5 h-5 text-teal-600" />
              <div>
                <p className="font-bold text-sm">Department Live Queues</p>
                <p className="text-teal-700">Live queues and doctor availability by department.</p>
              </div>
            </div>
            <span className="font-bold bg-white px-3 py-1 rounded-xl border border-teal-200 text-teal-800">
              8 Hospital Departments Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => {
              const stats = getDepartmentStats(hospitals[0].name, dept.name)

              return (
                <div key={dept.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{dept.name}</h3>
                        <p className="text-xs text-slate-500">{dept.room}</p>
                      </div>
                      <span className="text-xs font-black text-teal-600 font-mono px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                        {stats.waitingCount} in line
                      </span>
                    </div>

                    <div className="space-y-2 pt-3 text-xs border-y border-slate-100 my-3 text-slate-600">
                      <div className="flex justify-between">
                        <span>Est. Wait Time:</span>
                        <strong className="text-teal-700">{stats.estimatedWait}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Online vs Walk-in:</span>
                        <span>{stats.onlineCount} Online / {stats.walkInCount} Walk-in</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Doctors:</span>
                        <span className="font-bold text-slate-800">{stats.activeDoctorCount} on duty</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialists</span>
                      {dept.doctors.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between text-[11px] p-1.5 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-700 truncate">{doc.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              doc.status === DoctorStatus.AVAILABLE
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === DoctorStatus.ON_BREAK
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveDoctorDept(dept.name)
                        setActiveTab('doctor')
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Open {dept.name} Console</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOCTOR CONSULTATION */}
      {activeTab === 'doctor' && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={activeDoctorDept}
                  onChange={(e) => setActiveDoctorDept(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Attending Doctor
                </label>
                <select
                  value={activeDoctorName}
                  onChange={(e) => setActiveDoctorName(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-teal-800 bg-white"
                >
                  {doctorDeptConfig.doctors.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} ({d.room})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Doctor Status:</span>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => updateDoctorAvailability(doctorDeptConfig.id, currentDoctorObj.id, DoctorStatus.AVAILABLE)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    currentDoctorObj.status === DoctorStatus.AVAILABLE ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Available</span>
                </button>
                <button
                  onClick={() => updateDoctorAvailability(doctorDeptConfig.id, currentDoctorObj.id, DoctorStatus.ON_BREAK)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    currentDoctorObj.status === DoctorStatus.ON_BREAK ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>On Break</span>
                </button>
                <button
                  onClick={() => updateDoctorAvailability(doctorDeptConfig.id, currentDoctorObj.id, DoctorStatus.OFF_DUTY)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    currentDoctorObj.status === DoctorStatus.OFF_DUTY ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Off Duty</span>
                </button>
              </div>
            </div>

          </div>

          {/* Doctor Queue */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{activeDoctorDept} Waiting Room Queue ({doctorPatients.length} Patients)</span>
            </h3>

            {doctorPatients.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No patients waiting.</p>
              </div>
            ) : (
              doctorPatients.map((patient, index) => {
                const isEmergency = patient.priority === 'P1'
                const isWithDoctor = patient.status === 'with_doctor'
                const isWalkIn = patient.bookingType === BookingType.WALK_IN

                return (
                  <div
                    key={patient.token}
                    className={`bg-white rounded-2xl p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isEmergency
                        ? 'border-red-400 bg-red-50/20 shadow-xs'
                        : isWithDoctor
                        ? 'border-teal-400 bg-teal-50/20 shadow-xs'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`text-center px-3 py-2 rounded-xl border shrink-0 ${isEmergency ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-100 border-slate-200'}`}>
                        <span className="text-[10px] font-bold block uppercase">Turn</span>
                        <span className="text-xl font-black font-mono block">#{index + 1}</span>
                        <span className="text-[10px] font-bold block">{patient.token}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{patient.patientName}</h4>
                          {isEmergency && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                              CRITICAL EMERGENCY (P1)
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {isWalkIn ? 'Walk-in' : 'Online'}
                          </span>
                          <span className="text-xs text-slate-500">Room: {patient.room}</span>
                        </div>

                        <p className="text-xs text-slate-600">
                          <strong>Chief Complaint:</strong> {patient.symptoms}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Arrival: {patient.arrivalStatus === ArrivalStatus.ARRIVED ? '✓ On-Site' : patient.arrivalStatus}</span>
                          <span>•</span>
                          <span>Doctor: {patient.doctor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">

                      <button
                        onClick={() => setTransferTargetPatient(patient)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        title="Refer to another department"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Refer / Transfer</span>
                      </button>

                      {patient.status === 'waiting' && (
                        <button
                          onClick={() => updatePatientStatus(patient.token, 'with_doctor')}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Call In</span>
                        </button>
                      )}

                      {patient.status === 'with_doctor' && (
                        <button
                          onClick={() => updatePatientStatus(patient.token, 'completed')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Finish & Discharge</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 4: HOSPITAL ADMIN */}
      {activeTab === 'admin' && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-teal-600" />
                <span>Configurable Grace Period</span>
              </h4>
              <p className="text-xs text-slate-500">
                Set the waiting time before releasing an unclaimed appointment slot.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setGracePeriodMinutes(mins)
                    handleActionToast(`Grace period updated to ${mins} minutes.`)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gracePeriodMinutes === mins
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>System Audit Log ({auditLogs.length} Records)</span>
            </h4>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Token</th>
                      <th className="px-4 py-3">Actor</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Details & Reason</th>
                      <th className="px-4 py-3">Transition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-slate-500 font-mono">{log.timestamp}</td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-700">{log.token}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{log.actor}</td>
                        <td className="px-4 py-3">
                          <span className="font-bold font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-sm">{log.details}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-400">
                          <span className="font-medium text-slate-500">{log.previousStatus}</span> → <span className="font-bold text-slate-800">{log.newStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Walk-In Registration */}
      <WalkInRegistrationModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onRegistered={(newPatient) => {
          handleActionToast(`Walk-in patient ${newPatient.patientName} (${newPatient.token}) registered in ${newPatient.department}!`)
        }}
      />

      {/* Department Transfer */}
      <DepartmentTransferModal
        isOpen={Boolean(transferTargetPatient)}
        patient={transferTargetPatient}
        onClose={() => setTransferTargetPatient(null)}
        onTransferred={(msg) => handleActionToast(msg)}
      />

      {/* Released Slot Reassignment */}
      <ReleasedSlotAssignModal
        isOpen={Boolean(releasedSlotTarget)}
        releasedPatient={releasedSlotTarget}
        onClose={() => setReleasedSlotTarget(null)}
        onAssigned={(msg) => handleActionToast(msg)}
      />

    </div>
  )
}
