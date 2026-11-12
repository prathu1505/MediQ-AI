/**
 * MediQ AI System Domain Constants & Models
 * Supports Online Bookings, Walk-ins, 2-Stage Verification & Department Queues
 */

export const BookingType = {
  ONLINE: 'online',
  WALK_IN: 'walk_in',
}

export const QueueStatus = {
  WAITING: 'waiting',
  IN_TRIAGE: 'in_triage',
  WITH_DOCTOR: 'with_doctor',
  IN_LAB: 'in_lab',
  IN_PHARMACY: 'in_pharmacy',
  COMPLETED: 'completed',
  TRANSFERRED: 'transferred',
  CANCELLED: 'cancelled',
}

export const TriagePriority = {
  P1: { code: 'P1', label: 'Emergency / Resuscitation', color: 'red', bypassVerification: true },
  P2: { code: 'P2', label: 'Urgent Care', color: 'amber', bypassVerification: false },
  P3: { code: 'P3', label: 'Semi-Urgent', color: 'yellow', bypassVerification: false },
  P4: { code: 'P4', label: 'Standard / Routine', color: 'emerald', bypassVerification: false },
}

export const Stage1BookingStatus = {
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  FLAGGED_UNAUTHORIZED: 'flagged_unauthorized',
  EXPIRED: 'expired',
  BYPASSED_EMERGENCY: 'bypassed_emergency',
}

export const Stage2AttendanceStatus = {
  ATTENDANCE_PENDING: 'attendance_pending',
  ATTENDANCE_CONFIRMED: 'attendance_confirmed',
  ATTENDANCE_CANCELLED: 'attendance_cancelled',
  NO_SHOW: 'no_show',
}

export const ArrivalStatus = {
  NOT_ARRIVED: 'not_arrived',
  ARRIVED: 'arrived',
  LATE: 'late',
}

export const SlotStatus = {
  CLAIMED: 'claimed',
  RELEASED_AVAILABLE: 'released_available', // Unclaimed late online slot released for walk-in
  REASSIGNED_TO_WALKIN: 'reassigned_to_walkin',
}

export const DoctorStatus = {
  AVAILABLE: 'available',
  IN_CONSULTATION: 'in_consultation',
  ON_BREAK: 'on_break',
  OFF_DUTY: 'off_duty',
}

export const NotificationChannels = {
  IN_APP: 'in_app',
  SMS: 'sms',
  VOICE_CALL: 'voice_call',
}

export const HospitalDepartments = [
  'General Medicine',
  'Emergency Care',
  'Cardiology',
  'Orthopaedics',
  'Neurology',
  'Pediatrics',
  'ENT',
  'Dermatology',
]
