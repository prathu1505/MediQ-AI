import React, { useState } from 'react'
import {
  Bell,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Send,
  Sparkles
} from 'lucide-react'
import { useQueue } from '../../context/QueueContext'
import { Stage1BookingStatus, Stage2AttendanceStatus } from '../../types'

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, patients, answerStage1Verification, answerStage2Attendance } = useQueue()

  const [actionFeedback, setActionFeedback] = useState('')

  const handleStage1Response = async (tokenId, response) => {
    const res = await answerStage1Verification(tokenId, response)
    setActionFeedback(`Token ${tokenId}: ${res.message}`)
    setTimeout(() => setActionFeedback(''), 4000)
  }

  const handleStage2Response = async (tokenId, response) => {
    const res = await answerStage2Attendance(tokenId, response)
    setActionFeedback(`Token ${tokenId}: ${res.message}`)
    setTimeout(() => setActionFeedback(''), 4000)
  }

  const unreadCount = notifications.length

  return (
    <>
      {/* Floating Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 transition-all hover:scale-105 group"
        title="Patient Mobile Phone / SMS Simulator"
      >
        <div className="relative">
          <Smartphone className="w-5 h-5 text-teal-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-teal-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs font-bold hidden sm:inline">
          Patient SMS Center
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Patient Mobile SMS Simulator</h3>
                  <p className="text-[11px] text-slate-400">Incoming 2-Stage Verification Notifications</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Provider Status Banner */}
            <div className="px-4 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center justify-between text-xs text-teal-900">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                In-App SMS Engine Active
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">
                Telco Gateway Standby
              </span>
            </div>

            {/* Feedback Alert */}
            {actionFeedback && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs font-semibold text-emerald-800">
                {actionFeedback}
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">No notifications yet. Book a token to test!</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const patient = patients.find((p) => p.token === notif.bookingToken)
                  const isStage1 = notif.stage === 'stage1_booking'
                  const isStage2 = notif.stage === 'stage2_attendance'
                  const isAlert = notif.stage === 'unauthorized_alert'

                  const isAlreadyVerified =
                    patient && patient.bookingVerificationStatus === Stage1BookingStatus.VERIFIED
                  const isFlaggedUnauthorized =
                    patient && patient.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED
                  const isAttendanceConfirmed =
                    patient && patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CONFIRMED
                  const isAttendanceCancelled =
                    patient && patient.attendanceStatus === Stage2AttendanceStatus.ATTENDANCE_CANCELLED

                  return (
                    <div
                      key={notif.id}
                      className={`rounded-2xl p-4 border text-xs space-y-2.5 transition-all ${
                        isAlert
                          ? 'bg-red-50 border-red-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="font-mono text-teal-700 font-extrabold">{notif.bookingToken}</span>
                          <span className="text-[10px] text-slate-400">({notif.recipientType.toUpperCase()})</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                      </div>

                      <p className="text-slate-700 leading-relaxed font-medium">
                        {notif.message}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span>To: {notif.recipientName} ({notif.recipientPhone})</span>
                        <span className="italic">{notif.externalNotice}</span>
                      </div>

                      {/* Interactive Stage 1 Response Buttons */}
                      {isStage1 && patient && (
                        <div className="pt-2">
                          {isAlreadyVerified ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified: Booking Authorized (Answered YES)</span>
                            </div>
                          ) : isFlaggedUnauthorized ? (
                            <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Flagged as Unauthorized (Answered NO)</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-bold text-slate-700">
                                Stage 1: Did you or your guardian request this appointment?
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleStage1Response(notif.bookingToken, 'YES')}
                                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>YES, Authorize</span>
                                </button>
                                <button
                                  onClick={() => handleStage1Response(notif.bookingToken, 'NO')}
                                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>NO, Cancel</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Stage 2 Attendance Buttons */}
                      {isStage2 && patient && (
                        <div className="pt-2">
                          {isAttendanceConfirmed ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Stage 2 Confirmed: Attending Appointment</span>
                            </div>
                          ) : isAttendanceCancelled ? (
                            <div className="flex items-center gap-1.5 text-slate-600 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Stage 2: Appointment Cancelled by Patient</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-bold text-slate-700">
                                Stage 2: Will you attend your appointment?
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleStage2Response(notif.bookingToken, 'YES')}
                                  className="py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>YES, I will attend</span>
                                </button>
                                <button
                                  onClick={() => handleStage2Response(notif.bookingToken, 'NO')}
                                  className="py-2 px-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>NO, Cancel Slot</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Bottom info */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
              <span>This panel simulates SMS notifications delivered to registered patient/guardian mobile devices.</span>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
