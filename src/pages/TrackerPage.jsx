
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Clock,
  Hospital,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  XCircle,
  MapPin,
  Building,
  ArrowRightLeft
} from 'lucide-react'
import { useQueue } from '../context/QueueContext'
import {
  BookingType,
  Stage1BookingStatus,
  Stage2AttendanceStatus,
  ArrivalStatus,
} from '../types'

export default function TrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    patients,
    getPatientByToken,
    getPatientQueuePosition,
    answerStage1Verification,
    answerStage2Attendance,
    expireBooking,
    markHospitalArrival,
  } = useQueue()

  const initialToken = searchParams.get('token') || (patients.length > 0 ? patients[0].token : 'ON-101')

  const [searchQuery, setSearchQuery] = useState(initialToken)
  const [activeToken, setActiveToken] = useState(initialToken)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState('')

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setActiveToken(urlToken)
      setSearchQuery(urlToken)
    }
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const cleanToken = searchQuery.trim().toUpperCase()
      setActiveToken(cleanToken)
      setSearchParams({ token: cleanToken })
    }
  }

  const handleSelectToken = (tok) => {
    setActiveToken(tok)
    setSearchQuery(tok)
    setSearchParams({ token: tok })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleStage1Answer = async (response) => {
    const res = await answerStage1Verification(activeToken, response)
    setStatusFeedback(res.message)
    setTimeout(() => setStatusFeedback(''), 4000)
  }

  const handleStage2Answer = async (response) => {
    const res = await answerStage2Attendance(activeToken, response)
    setStatusFeedback(res.message)
    setTimeout(() => setStatusFeedback(''), 4000)
  }

  const handleExpireSimulation = () => {
    expireBooking(activeToken)
    setStatusFeedback('Grace period expired. Booking marked as Expired.')
    setTimeout(() => setStatusFeedback(''), 4000)
  }

  const handleArrivalCheckin = () => {
    const res = markHospitalArrival(activeToken, 'Patient Self Check-In')
    setStatusFeedback(res.message)
    setTimeout(() => setStatusFeedback(''), 4000)
  }

  const patient = getPatientByToken(activeToken)
  const positionAhead = patient ? getPatientQueuePosition(patient) : 0

  const isVerified =
    patient &&
    (patient.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ||
      patient.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ||
      patient.bookingType === BookingType.WALK_IN)

  const isWalkIn = patient?.bookingType === BookingType.WALK_IN

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Live Queue</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Token
        </h1>
      </div>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-300 shadow-xs">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter token number"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Track
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          {patients.map((p) => (
            <button
              key={p.token}
              type="button"
              onClick={() => handleSelectToken(p.token)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all text-xs flex items-center gap-1 ${
                activeToken === p.token
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{p.token}</span>
              {p.bookingType === BookingType.WALK_IN && <span className="text-[9px]">(Walk-in)</span>}
              {p.isMinor && <span className="text-[9px]">(Minor)</span>}
              {p.priority === 'P1' && <span className="text-[9px]">(ER)</span>}
            </button>
          ))}
        </div>
      </div>

      {statusFeedback && (
        <div className="max-w-2xl mx-auto p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-semibold text-teal-900 flex items-center justify-between">
          <span>{statusFeedback}</span>
          <button
            onClick={() => setStatusFeedback('')}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {patient ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto space-y-6 pb-6">

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Hospital className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg text-white">{patient.hospital}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isWalkIn ? 'bg-cyan-900/60 text-cyan-300 border-cyan-700' : 'bg-teal-900/60 text-teal-300 border-teal-700'}`}>
                    {isWalkIn ? 'Walk-In' : 'Online'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="font-semibold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700/60">
                    {patient.department}
                  </span>
                  <span>•</span>
                  <span>{patient.room}</span>
                  {patient.patientId && <span>• ID: {patient.patientId}</span>}
                </div>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh status"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
            </button>
          </div>

          <div className="px-6 sm:px-8 space-y-6">

            {patient.lastTransferredFrom && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                <ArrowRightLeft className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Department Transferred</p>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    {patient.lastTransferredFrom} → {patient.department} • {patient.doctor} • {patient.room}
                  </p>
                  <p className="text-[10px] text-blue-700 mt-0.5">
                    Reason: {patient.transferReason}
                  </p>
                </div>
              </div>
            )}

            {!isWalkIn && (
              <div className="p-4 rounded-2xl border text-xs space-y-3 bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Booking Verification
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      patient.bookingVerificationStatus === Stage1BookingStatus.VERIFIED
                        ? 'bg-emerald-100 text-emerald-800'
                        : patient.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY
                        ? 'bg-red-100 text-red-800'
                        : patient.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED
                        ? 'bg-red-100 text-red-800'
                        : patient.bookingVerificationStatus === Stage1BookingStatus.EXPIRED
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {patient.bookingVerificationStatus.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                {patient.bookingVerificationStatus === Stage1BookingStatus.PENDING_VERIFICATION && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                      <p className="font-bold">
                        {patient.isMinor
                          ? `Guardian Authorization: ${patient.guardianName}`
                          : 'Booking Confirmation'}
                      </p>
                      <p className="mt-1">
                        Did you or your guardian request this appointment?
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStage1Answer('YES')}
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>YES</span>
                      </button>

                      <button
                        onClick={() => handleStage1Answer('NO')}
                        className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>NO</span>
                      </button>
                    </div>

                    <div className="pt-1 text-center">
                      <button
                        onClick={handleExpireSimulation}
                        className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                      >
                        [Dev Test] Simulate Grace Period Expiry
                      </button>
                    </div>
                  </div>
                )}

                {patient.bookingVerificationStatus === Stage1BookingStatus.VERIFIED && (
                  <div className="text-emerald-800 flex items-center justify-between text-[11px] flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified by {patient.bookingVerifiedBy} at {patient.bookingVerifiedAt}
                    </span>
                    <span className="text-slate-400">Token Active</span>
                  </div>
                )}
              </div>
            )}

            {isWalkIn && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-900 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                  Verified at Hospital Desk
                </span>
                <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-cyan-300 text-cyan-800">
                  Walk-In OPD
                </span>
              </div>
            )}

            {!isWalkIn && isVerified && (
              <div className="p-4 rounded-2xl border text-xs space-y-3 bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Attendance Confirmation
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CONFIRMED
                        ? 'bg-emerald-100 text-emerald-800'
                        : patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CANCELLED
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {patient.attendanceStatus.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                {patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_PENDING && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 leading-relaxed">
                      <p className="font-bold">
                        Will you attend this appointment?
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStage2Answer('YES')}
                        className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>YES</span>
                      </button>

                      <button
                        onClick={() => handleStage2Answer('NO')}
                        className="py-2.5 px-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>NO</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isVerified && patient.status !== 'cancelled' && (
              <div className="p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${patient.arrivalStatus === ArrivalStatus.ARRIVED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    <Building className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">Hospital Arrival</p>
                    <p className="text-[11px] text-slate-500">
                      {patient.arrivalStatus === ArrivalStatus.ARRIVED
                        ? `Arrived at ${patient.arrivedAt}`
                        : patient.arrivalStatus === ArrivalStatus.LATE
                        ? 'Late — Grace period active'
                        : 'Not arrived yet'}
                    </p>
                  </div>
                </div>

                {patient.arrivalStatus !== ArrivalStatus.ARRIVED ? (
                  <button
                    onClick={handleArrivalCheckin}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>I'm Here</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-xs">
                    Arrived
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left py-2 border-y border-slate-100">

              <div className="sm:border-r sm:border-slate-100 pr-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Token
                </span>

                <span className="text-4xl font-black text-teal-600 font-mono tracking-tight block mt-1">
                  {patient.token}
                </span>

                <span className="text-xs text-slate-500 mt-1 block">
                  Patient: <strong className="text-slate-700">{patient.patientName}</strong>
                </span>
              </div>

              <div className="sm:border-r sm:border-slate-100 pr-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Queue Position
                </span>

                <div className="text-3xl font-extrabold text-slate-800 mt-1">
                  {patient.status === 'with_doctor' ? (
                    <span className="text-emerald-600 text-xl font-bold">Now Inside</span>
                  ) : patient.status === 'cancelled' ? (
                    <span className="text-red-500 text-xl font-bold">Released</span>
                  ) : patient.status === 'completed' ? (
                    <span className="text-slate-400 text-xl font-bold">Done</span>
                  ) : !isVerified ? (
                    <span className="text-amber-600 text-lg font-bold">Awaiting Verification</span>
                  ) : positionAhead <= 1 ? (
                    <span className="text-teal-600 text-xl font-bold">Next in Line!</span>
                  ) : (
                    <span>#{positionAhead}</span>
                  )}
                </div>

                <span className="text-xs text-slate-500 mt-1 block">
                  {patient.department}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Est. Wait Time
                </span>

                <div className="text-3xl font-extrabold text-teal-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <Clock className="w-5 h-5 text-teal-500" />
                  <span>
                    {patient.status === 'cancelled'
                      ? 'N/A'
                      : patient.status === 'with_doctor'
                      ? '0 mins'
                      : patient.status === 'completed'
                      ? 'Completed'
                      : `~${patient.estimatedWaitMinutes} mins`}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 mt-1 block">
                  {patient.doctor}
                </span>
              </div>

            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 flex-wrap gap-2">
                <span className={patient.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ? 'text-teal-600' : 'text-amber-600'}>
                  1. Token Issued
                </span>

                <span className={patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CONFIRMED ? 'text-teal-600' : 'text-slate-400'}>
                  2. Attendance
                </span>

                <span className={patient.arrivalStatus === ArrivalStatus.ARRIVED ? 'text-teal-600' : 'text-slate-400'}>
                  3. Arrival
                </span>

                <span className={patient.status === 'with_doctor' || patient.status === 'completed' ? 'text-teal-600' : 'text-slate-400'}>
                  4. Consultation
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width:
                      patient.status === 'completed'
                        ? '100%'
                        : patient.status === 'with_doctor'
                        ? '80%'
                        : patient.arrivalStatus === ArrivalStatus.ARRIVED
                        ? '65%'
                        : patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CONFIRMED
                        ? '45%'
                        : isVerified
                        ? '25%'
                        : '10%',
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-md mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Token Not Found
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              No patient record for <strong>{activeToken}</strong>.
            </p>
          </div>

          <Link
            to="/checkin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
          >
            Book a Token
          </Link>
        </div>
      )}

    </div>
  )
}
