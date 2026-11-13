import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import {
  BookingType,
  Stage1BookingStatus,
  Stage2AttendanceStatus,
  ArrivalStatus,
  SlotStatus,
  DoctorStatus,
  TriagePriority,
} from '../types'
import {
  sendStage1VerificationNotification,
  sendStage2AttendanceNotification,
  triggerAutomatedVoiceCall,
} from '../services/notificationService'
import {
  searchPatientProfile,
  savePatientProfile,
  getLocalProfiles,
} from '../services/queueDatabaseService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const HOSPITALS = [
  {
    id: 'metro-central',
    name: 'Metro Central General Hospital',
    location: 'Downtown Campus',
    type: 'Multi-Speciality Hospital',
  },
  {
    id: 'st-jude',
    name: 'St. Jude Regional Pavilion',
    location: 'North Zone',
    type: 'General & Emergency Center',
  },
  {
    id: 'apex-health',
    name: 'Apex Health Clinic',
    location: 'East Pavilion',
    type: 'Outpatient & Urgent Care',
  },
  {
    id: 'west-valley',
    name: 'West Valley Memorial Hospital',
    location: 'West Campus',
    type: 'Community Hospital',
  },
]

// Departments with Active Doctors
export const DEPARTMENTS = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    avgTimePerPatient: 15,
    room: 'Room 204',
    doctors: [
      { id: 'doc-card-1', name: 'Dr. Sundar (Cardiologist)', status: DoctorStatus.AVAILABLE, room: 'Room 204' },
      { id: 'doc-card-2', name: 'Dr. Ananya Sen (Interventional)', status: DoctorStatus.AVAILABLE, room: 'Room 205' },
    ],
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    avgTimePerPatient: 15,
    room: 'Room 302',
    doctors: [
      { id: 'doc-ortho-1', name: 'Dr. Vikram (Orthopedic Surgeon)', status: DoctorStatus.AVAILABLE, room: 'Room 302' },
      { id: 'doc-ortho-2', name: 'Dr. Harish Nair (Joint Specialist)', status: DoctorStatus.AVAILABLE, room: 'Room 304' },
    ],
  },
  {
    id: 'neurology',
    name: 'Neurology',
    avgTimePerPatient: 18,
    room: 'Room 401',
    doctors: [
      { id: 'doc-neuro-1', name: 'Dr. Sanjay Roy (Neurologist)', status: DoctorStatus.AVAILABLE, room: 'Room 401' },
      { id: 'doc-neuro-2', name: 'Dr. Rohini V. (Neuro-Physician)', status: DoctorStatus.AVAILABLE, room: 'Room 402' },
    ],
  },
  {
    id: 'general',
    name: 'General Medicine',
    avgTimePerPatient: 10,
    room: 'Room 101',
    doctors: [
      { id: 'doc-gen-1', name: 'Dr. Anitha (General Physician)', status: DoctorStatus.AVAILABLE, room: 'Room 101' },
      { id: 'doc-gen-2', name: 'Dr. Deepan (Internal Medicine)', status: DoctorStatus.AVAILABLE, room: 'Room 102' },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    avgTimePerPatient: 5,
    room: 'Trauma Bay 1',
    doctors: [
      { id: 'doc-er-1', name: 'Dr. Rajesh (ER Lead)', status: DoctorStatus.AVAILABLE, room: 'Trauma Bay 1' },
      { id: 'doc-er-2', name: 'Dr. Farhan (Trauma Surgeon)', status: DoctorStatus.AVAILABLE, room: 'Trauma Bay 2' },
    ],
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    avgTimePerPatient: 12,
    room: 'Room 108',
    doctors: [
      { id: 'doc-ped-1', name: 'Dr. Meena (Pediatrician)', status: DoctorStatus.AVAILABLE, room: 'Room 108' },
    ],
  },
  {
    id: 'ent',
    name: 'ENT',
    avgTimePerPatient: 10,
    room: 'Room 105',
    doctors: [
      { id: 'doc-ent-1', name: 'Dr. Karthik (ENT Specialist)', status: DoctorStatus.AVAILABLE, room: 'Room 105' },
    ],
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    avgTimePerPatient: 10,
    room: 'Room 201',
    doctors: [
      { id: 'doc-derm-1', name: 'Dr. Priya (Dermatologist)', status: DoctorStatus.AVAILABLE, room: 'Room 201' },
    ],
  },
]

// Seed Bookings (Both Online & Walk-in represented)
const INITIAL_PATIENTS = [
  {
    id: 'ON-101',
    token: 'ON-101',
    bookingType: BookingType.ONLINE,
    patientId: 'PID-1001',
    patientName: 'Ravi Kumar',
    phone: '9840123456',
    age: '45',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'Metro Central General Hospital',
    department: 'Cardiology',
    priority: 'P2',
    priorityLabel: 'Urgent',
    symptoms: 'Chest tightness, elevated BP',
    status: 'with_doctor',
    doctor: 'Dr. Sundar (Cardiologist)',
    room: 'Room 204',
    createdAt: '09:30 AM',
    estimatedWaitMinutes: 0,
    // Stage 1 & 2
    bookingVerificationStatus: Stage1BookingStatus.VERIFIED,
    verificationToken: 'SEC-V-101',
    verificationExpiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
    bookingVerifiedAt: '09:31 AM',
    bookingVerifiedBy: 'patient',
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
    attendanceConfirmedAt: '09:35 AM',
    // Arrival & Grace
    arrivalStatus: ArrivalStatus.ARRIVED,
    arrivedAt: '09:38 AM',
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
  {
    id: 'ON-102',
    token: 'ON-102',
    bookingType: BookingType.ONLINE,
    patientId: 'PID-1002',
    patientName: 'Kavitha S.',
    phone: '9840987654',
    age: '32',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'Metro Central General Hospital',
    department: 'Cardiology',
    priority: 'P3',
    priorityLabel: 'Standard',
    symptoms: 'Routine ECG review',
    status: 'waiting',
    doctor: 'Dr. Sundar (Cardiologist)',
    room: 'Room 204',
    createdAt: '09:45 AM',
    estimatedWaitMinutes: 15,
    bookingVerificationStatus: Stage1BookingStatus.VERIFIED,
    verificationToken: 'SEC-V-102',
    verificationExpiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
    bookingVerifiedAt: '09:46 AM',
    bookingVerifiedBy: 'patient',
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
    attendanceConfirmedAt: '09:50 AM',
    arrivalStatus: ArrivalStatus.ARRIVED,
    arrivedAt: '09:55 AM',
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
  {
    id: 'ON-103',
    token: 'ON-103',
    bookingType: BookingType.ONLINE,
    patientId: 'PID-1003',
    patientName: 'Praveen Nathan',
    phone: '9789123456',
    age: '28',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'Metro Central General Hospital',
    department: 'General Medicine',
    priority: 'P4',
    priorityLabel: 'Routine',
    symptoms: 'Fever and cold for 2 days',
    status: 'waiting',
    doctor: 'Dr. Anitha (General Physician)',
    room: 'Room 101',
    createdAt: '10:00 AM',
    estimatedWaitMinutes: 10,
    bookingVerificationStatus: Stage1BookingStatus.PENDING_VERIFICATION,
    verificationToken: 'SEC-V-103',
    verificationExpiresAt: new Date(Date.now() + 12 * 60000).toISOString(),
    bookingVerifiedAt: null,
    bookingVerifiedBy: null,
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_PENDING,
    attendanceConfirmedAt: null,
    arrivalStatus: ArrivalStatus.NOT_ARRIVED,
    arrivedAt: null,
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
  {
    id: 'WK-201',
    token: 'WK-201',
    bookingType: BookingType.WALK_IN,
    patientId: 'PID-1004',
    patientName: 'Meenakshi Sundaram',
    phone: '9840555123',
    age: '62',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'Metro Central General Hospital',
    department: 'Orthopaedics',
    priority: 'P3',
    priorityLabel: 'Semi-Urgent',
    symptoms: 'Knee joint pain after slip and fall',
    status: 'waiting',
    doctor: 'Dr. Vikram (Orthopedic Surgeon)',
    room: 'Room 302',
    createdAt: '10:05 AM',
    estimatedWaitMinutes: 15,
    // Walk-ins are verified in-person at desk
    bookingVerificationStatus: Stage1BookingStatus.VERIFIED,
    verificationToken: 'WALK-IN-DESK-201',
    verificationExpiresAt: new Date(Date.now() + 60 * 60000).toISOString(),
    bookingVerifiedAt: '10:05 AM',
    bookingVerifiedBy: 'receptionist_walkin_intake',
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
    attendanceConfirmedAt: '10:05 AM',
    arrivalStatus: ArrivalStatus.ARRIVED,
    arrivedAt: '10:05 AM',
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
  {
    id: 'WK-202',
    token: 'WK-202',
    bookingType: BookingType.WALK_IN,
    patientId: 'PID-1005',
    patientName: 'Arjun Verma',
    phone: '9940123987',
    age: '39',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'Metro Central General Hospital',
    department: 'Neurology',
    priority: 'P2',
    priorityLabel: 'Urgent',
    symptoms: 'Persistent unilateral headache with dizziness and sensory numbness',
    status: 'waiting',
    doctor: 'Dr. Sanjay Roy (Neurologist)',
    room: 'Room 401',
    createdAt: '10:12 AM',
    estimatedWaitMinutes: 18,
    bookingVerificationStatus: Stage1BookingStatus.VERIFIED,
    verificationToken: 'WALK-IN-DESK-202',
    verificationExpiresAt: new Date(Date.now() + 60 * 60000).toISOString(),
    bookingVerifiedAt: '10:12 AM',
    bookingVerifiedBy: 'receptionist_walkin_intake',
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
    attendanceConfirmedAt: '10:12 AM',
    arrivalStatus: ArrivalStatus.ARRIVED,
    arrivedAt: '10:12 AM',
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
  {
    id: 'ON-104',
    token: 'ON-104',
    bookingType: BookingType.ONLINE,
    patientId: 'PID-1006',
    patientName: 'Sarah Jenkins',
    phone: '9123456789',
    age: '60',
    isMinor: false,
    guardianName: null,
    guardianPhone: null,
    guardianRelationship: null,
    hospital: 'St. Jude Regional Pavilion',
    department: 'Emergency Care',
    priority: 'P1',
    priorityLabel: 'Emergency / Trauma',
    symptoms: 'Severe respiratory distress, oxygen saturation dropping',
    status: 'waiting',
    doctor: 'Dr. Rajesh (ER Lead)',
    room: 'Trauma Bay 1',
    createdAt: '10:15 AM',
    estimatedWaitMinutes: 0,
    bookingVerificationStatus: Stage1BookingStatus.BYPASSED_EMERGENCY,
    verificationToken: 'SEC-V-104-EMERGENCY',
    verificationExpiresAt: new Date(Date.now() + 60 * 60000).toISOString(),
    bookingVerifiedAt: '10:15 AM',
    bookingVerifiedBy: 'emergency_auto_bypass',
    attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
    attendanceConfirmedAt: '10:15 AM',
    arrivalStatus: ArrivalStatus.ARRIVED,
    arrivedAt: '10:15 AM',
    slotStatus: SlotStatus.CLAIMED,
    gracePeriodMinutes: 15,
  },
]

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    token: 'ON-101',
    timestamp: '09:31 AM',
    actor: 'Patient (Ravi Kumar)',
    action: 'ONLINE_STAGE1_VERIFIED',
    details: 'Patient confirmed online booking authorization.',
    previousStatus: 'pending_verification',
    newStatus: 'verified',
  },
  {
    id: 'AUD-002',
    token: 'WK-201',
    timestamp: '10:05 AM',
    actor: 'Receptionist Sarah',
    action: 'WALKIN_PATIENT_REGISTERED',
    details: 'Walk-in patient registered at Orthopaedics reception desk. Patient Profile PID-1004 retrieved.',
    previousStatus: 'none',
    newStatus: 'arrived',
  },
  {
    id: 'AUD-003',
    token: 'WK-202',
    timestamp: '10:12 AM',
    actor: 'Receptionist Sarah',
    action: 'AI_SUGGESTION_CONFIRMED',
    details: 'AI suggested Neurology based on symptom "unilateral headache with numbness". Staff confirmed assignment.',
    previousStatus: 'none',
    newStatus: 'verified',
  },
]

const QueueContext = createContext(null)

export function QueueProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('mediq_patients_v3')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved patients', e)
      }
    }
    return []
  })
  const [queueDatabaseReady, setQueueDatabaseReady] = useState(false)

const queueSyncTimeoutRef = useRef(null)
const queueChannelRef = useRef(null)
const isInitialQueueLoadRef = useRef(true)
const isApplyingRemoteUpdateRef = useRef(false)

  // Doctors Roster with Realtime Status
  const [departmentsList, setDepartmentsList] = useState(() => {
    const saved = localStorage.getItem('mediq_departments_roster')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved roster', e)
      }
    }
    return DEPARTMENTS
  })

  // Global Configurable Grace Period (minutes)
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(() => {
    const saved = localStorage.getItem('mediq_grace_period')
    return saved ? parseInt(saved, 10) : 15
  })

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('mediq_audit_logs_v3')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse audit logs', e)
      }
    }
    return INITIAL_AUDIT_LOGS
  })

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('mediq_notifications_v3')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse notifications', e)
      }
    }
    return [
      {
        id: 'NOTIF-INIT-1',
        bookingToken: 'ON-103',
        recipientType: 'patient',
        recipientName: 'Praveen Nathan',
        recipientPhone: '9789123456',
        channel: 'in_app',
        stage: 'stage1_booking',
        message: 'MediQ AI Verification: Did you or your guardian request this hospital appointment at Metro Central General Hospital (General Medicine)? Please confirm: YES or NO.',
        actionOptions: ['YES', 'NO'],
        status: 'delivered',
        createdAt: '10:00 AM',
        timestamp: new Date().toISOString(),
        isExternalDelivered: false,
        externalNotice: 'In-App SMS Engine Active',
      },
    ]
  })

 useEffect(() => {
  let isMounted = true

  const loadQueueFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setQueueDatabaseReady(true)
      return
    }

    try {
      // Read this device's existing patients
      let localPatients = []

      try {
        const saved = localStorage.getItem('mediq_patients_v3')
        localPatients = saved ? JSON.parse(saved) : []
      } catch (error) {
        console.error('Local queue read failed:', error)
      }

      // Read shared patients from Supabase
      const { data, error } = await supabase
        .from('queue_patients')
        .select('token, patient_data')

      if (error) throw error

      const DEMO_TOKENS = [
  'ON-101',
  'ON-102',
  'ON-103',
  'ON-104',
  'WK-201',
  'WK-202',
]

const remotePatients = (data || [])
  .map((row) => row.patient_data)
  .filter(
    (patient) => patient && !DEMO_TOKENS.includes(patient.token)
  )

      const remoteTokens = new Set(
        remotePatients.map((patient) => patient.token)
      )

      // Keep local patients that are not yet in the shared database
      const localOnlyPatients = localPatients.filter(
  (patient) =>
    patient &&
    !DEMO_TOKENS.includes(patient.token) &&
    !remoteTokens.has(patient.token)
)

      let mergedPatients

      if (remotePatients.length === 0) {
  // First device: migrate only genuine patient records
  mergedPatients = localOnlyPatients
} else {
  // Other devices: use shared data and add missing local records
  mergedPatients = [...remotePatients, ...localOnlyPatients]
}

      if (mergedPatients.length > 0) {
        const rowsToSave =
          remotePatients.length === 0
            ? mergedPatients
            : localOnlyPatients

        if (rowsToSave.length > 0) {
          const { error: saveError } = await supabase
            .from('queue_patients')
            .upsert(
              rowsToSave.map((patient) => ({
                token: patient.token,
                patient_data: patient,
                updated_at: new Date().toISOString(),
              })),
              { onConflict: 'token' }
            )

          if (saveError) throw saveError
        }
      }

      if (!isMounted) return

      setPatients(mergedPatients)
      setQueueDatabaseReady(true)

      // Listen for changes made by other devices
      queueChannelRef.current = supabase
        .channel('mediq-queue-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'queue_patients',
          },
          async () => {
            const { data: latestData, error: latestError } = await supabase
              .from('queue_patients')
              .select('token, patient_data')

            if (latestError) {
              console.error('Realtime queue refresh failed:', latestError)
              return
            }

           if (isMounted) {
  const latestPatients = (latestData || [])
  .map((row) => row.patient_data)
  .filter(
    (patient) =>
      patient &&
      !DEMO_TOKENS.includes(patient.token)
  )
  isApplyingRemoteUpdateRef.current = true
  setPatients(latestPatients)
}
          }
        )
        .subscribe()

    } catch (error) {
      console.error('Supabase queue loading failed:', error)
      setQueueDatabaseReady(false)
    }
  }

  loadQueueFromSupabase()

  return () => {
    isMounted = false

    if (queueChannelRef.current) {
      supabase.removeChannel(queueChannelRef.current)
      queueChannelRef.current = null
    }
  }
}, [])

useEffect(() => {
  // Always maintain a local backup
  localStorage.setItem('mediq_patients_v3', JSON.stringify(patients))

  if (!queueDatabaseReady || !isSupabaseConfigured()) return
  if (isApplyingRemoteUpdateRef.current) {
  isApplyingRemoteUpdateRef.current = false
  return
}

  // Avoid sending too many requests for rapid changes
  if (queueSyncTimeoutRef.current) {
    clearTimeout(queueSyncTimeoutRef.current)
  }

  queueSyncTimeoutRef.current = setTimeout(async () => {
    const rows = patients.map((patient) => ({
      token: patient.token,
      patient_data: patient,
      updated_at: new Date().toISOString(),
    }))

    if (rows.length === 0) return

    const { error } = await supabase
      .from('queue_patients')
      .upsert(rows, { onConflict: 'token' })

    if (error) {
      console.error('Supabase queue sync failed:', error)
    }
  }, 500)

  return () => {
    if (queueSyncTimeoutRef.current) {
      clearTimeout(queueSyncTimeoutRef.current)
    }
  }
}, [patients, queueDatabaseReady])

  useEffect(() => {
    localStorage.setItem('mediq_departments_roster', JSON.stringify(departmentsList))
  }, [departmentsList])

  useEffect(() => {
    localStorage.setItem('mediq_grace_period', gracePeriodMinutes.toString())
  }, [gracePeriodMinutes])

  useEffect(() => {
    localStorage.setItem('mediq_audit_logs_v3', JSON.stringify(auditLogs))
  }, [auditLogs])

  useEffect(() => {
    localStorage.setItem('mediq_notifications_v3', JSON.stringify(notifications))
  }, [notifications])

  // Helper to log audit record
  const logAuditAction = ({ token, actor, action, details, previousStatus, newStatus }) => {
    const newLog = {
      id: 'AUD-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      token: token || 'N/A',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: actor || 'Staff Member',
      action,
      details,
      previousStatus: previousStatus || 'N/A',
      newStatus: newStatus || 'N/A',
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }

  // Token Generator for Online vs Walk-in
  const generateTokenNumber = (type = BookingType.ONLINE) => {
    const prefix = type === BookingType.WALK_IN ? 'WK' : 'ON'
    const existing = patients
      .filter((p) => p.token.startsWith(prefix))
      .map((p) => {
        const match = p.token.match(/\d+/)
        return match ? parseInt(match[0], 10) : 100
      })
    const maxNum =
  existing.length > 0
    ? Math.max(...existing)
    : type === BookingType.WALK_IN
      ? 202
      : 104
    return `${prefix}-${maxNum + 1}`
  }

  // Doctor Availability Toggle
  const updateDoctorAvailability = (deptId, doctorId, newStatus) => {
    setDepartmentsList((prevDepts) =>
      prevDepts.map((d) => {
        if (d.id === deptId) {
          return {
            ...d,
            doctors: d.doctors.map((doc) => {
              if (doc.id === doctorId) {
                return { ...doc, status: newStatus }
              }
              return doc
            }),
          }
        }
        return d
      })
    )

    logAuditAction({
      token: 'SYSTEM',
      actor: 'Department Supervisor',
      action: 'DOCTOR_AVAILABILITY_CHANGED',
      details: `Doctor ID ${doctorId} in department ${deptId} set to status: ${newStatus}`,
      previousStatus: 'roster_sync',
      newStatus,
    })
  }

  /**
   * REGISTER WALK-IN PATIENT AT RECEPTION DESK
   */
  const registerWalkInPatient = async ({
    patientId,
    patientName,
    phone,
    age,
    gender,
    bloodGroup,
    isMinor,
    guardianName,
    guardianPhone,
    guardianRelationship,
    hospital,
    department,
    assignedDoctor,
    priority = 'P4',
    symptoms,
    aiSuggestedDept = null,
    aiConfidence = null,
    staffName = 'Receptionist Desk',
  }) => {
    const deptConfig = departmentsList.find((d) => d.name === department) || departmentsList[0]
    const assignedDoc = assignedDoctor || deptConfig.doctors.find((doc) => doc.status === DoctorStatus.AVAILABLE)?.name || deptConfig.doctors[0]?.name || 'On-Call Specialist'
    const assignedRoom = deptConfig.doctors.find((doc) => doc.name === assignedDoc)?.room || deptConfig.room
    const isEmergency = priority === 'P1'
    const newToken = generateTokenNumber(BookingType.WALK_IN)
    const effectivePatientId = patientId || `PID-${Math.floor(1000 + Math.random() * 9000)}`

    // Save profile to directory
    await savePatientProfile({
      patientId: effectivePatientId,
      patientName,
      phone,
      age: parseInt(age, 10) || 0,
      gender: gender || 'Unspecified',
      bloodGroup: bloodGroup || 'Unknown',
      allergies: 'None recorded',
      medicalHistory: symptoms,
      emergency_contact: phone,
      registeredAt: new Date().toISOString().split('T')[0],
    })

    const newPatient = {
      id: newToken,
      token: newToken,
      bookingType: BookingType.WALK_IN,
      patientId: effectivePatientId,
      patientName,
      phone: phone || '',
      age: age || '',
      gender: gender || 'Unspecified',
      bloodGroup: bloodGroup || 'Unknown',
      isMinor: Boolean(isMinor),
      guardianName: isMinor ? guardianName : null,
      guardianPhone: isMinor ? guardianPhone : null,
      guardianRelationship: isMinor ? guardianRelationship : null,
      hospital,
      department,
      doctor: assignedDoc,
      room: assignedRoom,
      priority,
      priorityLabel: priority === 'P1' ? 'Emergency / Trauma' : priority === 'P2' ? 'Urgent' : priority === 'P3' ? 'Semi-Urgent' : 'Standard Care',
      symptoms: symptoms || 'Walk-in General Intake',
      status: 'waiting',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: isEmergency ? 0 : 15,

      // Walk-ins are authenticated in person by receptionist
      bookingVerificationStatus: isEmergency ? Stage1BookingStatus.BYPASSED_EMERGENCY : Stage1BookingStatus.VERIFIED,
      verificationToken: `DESK-WALKIN-${newToken}`,
      verificationExpiresAt: new Date(Date.now() + 120 * 60000).toISOString(),
      bookingVerifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bookingVerifiedBy: `receptionist_walkin:${staffName}`,

      // Attendance is confirmed in person
      attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
      attendanceConfirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

      // Physical Arrival is immediate
      arrivalStatus: ArrivalStatus.ARRIVED,
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

      slotStatus: SlotStatus.CLAIMED,
      gracePeriodMinutes,
      aiSuggestedDepartment: aiSuggestedDept,
      aiConfidenceScore: aiConfidence,
      clinicalStaffConfirmedBy: staffName,
    }

    setPatients((prev) => [newPatient, ...prev])

    logAuditAction({
      token: newToken,
      actor: staffName,
      action: isEmergency ? 'EMERGENCY_WALKIN_REGISTERED' : 'WALKIN_PATIENT_REGISTERED',
      details: isEmergency
        ? `EMERGENCY ALERT: P1 Walk-in registered for immediate resuscitation in Emergency Care.`
        : `Walk-in patient registered directly for ${department} assigned to ${assignedDoc}. Profile: ${effectivePatientId}.`,
      previousStatus: 'none',
      newStatus: 'arrived',
    })

    return newPatient
  }

  /**
   * ONLINE APPOINTMENT REQUEST (STAGE 1 TRIGGER)
   */
  const addPatient = async ({
    patientName,
    phone,
    age,
    isMinor,
    guardianName,
    guardianPhone,
    guardianRelationship,
    hospital,
    department,
    priority = 'P4',
    symptoms,
  }) => {
    const deptConfig = departmentsList.find((d) => d.name === department) || departmentsList[0]
    const assignedDoc = deptConfig.doctors.find((doc) => doc.status === DoctorStatus.AVAILABLE)?.name || deptConfig.doctors[0]?.name || 'Specialist Physician'
    const assignedRoom = deptConfig.doctors.find((doc) => doc.name === assignedDoc)?.room || deptConfig.room
    const newToken = generateTokenNumber(BookingType.ONLINE)
    const isEmergency = priority === 'P1'
    const verificationToken = `SEC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const expiresAt = new Date(Date.now() + gracePeriodMinutes * 60000).toISOString()
    const autoPatientId = `PID-${Math.floor(1000 + Math.random() * 9000)}`

    const initialBookingStatus = isEmergency
      ? Stage1BookingStatus.BYPASSED_EMERGENCY
      : Stage1BookingStatus.PENDING_VERIFICATION

    const initialAttendanceStatus = isEmergency
      ? Stage2AttendanceStatus.ATTENDANCE_CONFIRMED
      : Stage2AttendanceStatus.ATTENDANCE_PENDING

    const initialArrivalStatus = isEmergency
      ? ArrivalStatus.ARRIVED
      : ArrivalStatus.NOT_ARRIVED

    const newPatient = {
      id: newToken,
      token: newToken,
      bookingType: BookingType.ONLINE,
      patientId: autoPatientId,
      patientName,
      phone: phone || '',
      age: age || '',
      isMinor: Boolean(isMinor),
      guardianName: isMinor ? guardianName : null,
      guardianPhone: isMinor ? guardianPhone : null,
      guardianRelationship: isMinor ? guardianRelationship : null,
      hospital,
      department,
      doctor: assignedDoc,
      room: assignedRoom,
      priority,
      priorityLabel: priority === 'P1' ? 'Emergency / Trauma' : priority === 'P2' ? 'Urgent' : priority === 'P3' ? 'Semi-Urgent' : 'Standard',
      symptoms: symptoms || 'Online Booking Checkup',
      status: 'waiting',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: isEmergency ? 0 : 15,

      bookingVerificationStatus: initialBookingStatus,
      verificationToken,
      verificationExpiresAt: expiresAt,
      bookingVerifiedAt: isEmergency ? new Date().toLocaleTimeString() : null,
      bookingVerifiedBy: isEmergency ? 'emergency_auto_bypass' : null,

      attendanceStatus: initialAttendanceStatus,
      attendanceConfirmedAt: isEmergency ? new Date().toLocaleTimeString() : null,

      arrivalStatus: initialArrivalStatus,
      arrivedAt: isEmergency ? new Date().toLocaleTimeString() : null,

      slotStatus: SlotStatus.CLAIMED,
      gracePeriodMinutes,
    }

    setPatients((prev) => [newPatient, ...prev])

    logAuditAction({
      token: newToken,
      actor: isMinor ? `Guardian (${guardianName})` : `Patient (${patientName})`,
      action: isEmergency ? 'EMERGENCY_ONLINE_BYPASS' : 'ONLINE_BOOKING_STAGE1_PENDING',
      details: isEmergency
        ? `Priority 1 (Emergency) automatically bypasses booking verification delay.`
        : `Online appointment requested. Stage 1 verification notification dispatched.`,
      previousStatus: 'none',
      newStatus: initialBookingStatus,
    })

    if (!isEmergency) {
      const notif = await sendStage1VerificationNotification({
        patient: newPatient,
        verificationToken,
      })
      setNotifications((prev) => [notif, ...prev])
    }

    return newPatient
  }

  /**
   * RECEPTIONIST ARRIVAL TOGGLE (ARRIVED / NOT ARRIVED / LATE)
   */
  const updateArrivalStatus = (tokenId, newArrivalStatus, staffName = 'Reception Desk') => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === tokenId) {
          return {
            ...pat,
            arrivalStatus: newArrivalStatus,
            arrivedAt: newArrivalStatus === ArrivalStatus.ARRIVED ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : pat.arrivedAt,
          }
        }
        return pat
      })
    )

    logAuditAction({
      token: tokenId,
      actor: staffName,
      action: 'ARRIVAL_STATUS_UPDATED',
      details: `Arrival status changed to "${newArrivalStatus.toUpperCase()}" by ${staffName}.`,
      previousStatus: p.arrivalStatus,
      newStatus: newArrivalStatus,
    })

    return { success: true, message: `Arrival status updated to ${newArrivalStatus}.` }
  }

  /**
   * GRACE PERIOD EXPIRY & SLOT RELEASE RULE
   * IMPORTANT: Never automatically remove a patient who has already been called or whose consultation has started!
   */
  const releaseUnclaimedSlot = (tokenId, staffName = 'Reception Supervisor') => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    // Safety check: Never remove patient who has already been called or consultation started!
    if (p.status === 'with_doctor' || p.status === 'completed' || p.status === 'in_triage') {
      return {
        success: false,
        message: 'SAFETY PROTECTION: Patient has already been called into consultation. Active consultation slots cannot be released.',
      }
    }

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === tokenId) {
          return {
            ...pat,
            slotStatus: SlotStatus.RELEASED_AVAILABLE,
            status: 'cancelled', // release from doctor's active call queue
            slotReleasedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return pat
      })
    )

    logAuditAction({
      token: tokenId,
      actor: staffName,
      action: 'UNCLAIMED_SLOT_RELEASED',
      details: `Grace period (${p.gracePeriodMinutes || gracePeriodMinutes} mins) expired for unclaimed online appointment. Slot released and available for walk-in assignment.`,
      previousStatus: p.slotStatus,
      newStatus: SlotStatus.RELEASED_AVAILABLE,
    })

    return { success: true, message: `Slot for token ${tokenId} released. Eligible for waiting walk-in reassignment.` }
  }

  /**
   * REASSIGN RELEASED SLOT TO WAITING WALK-IN PATIENT
   * Does NOT displace any already arrived or confirmed patient!
   */
  const assignReleasedSlotToWalkIn = (releasedTokenId, walkInTokenId, staffName = 'Reception Desk') => {
    const released = patients.find((p) => p.token === releasedTokenId)
    const walkIn = patients.find((p) => p.token === walkInTokenId)

    if (!released || !walkIn) return { success: false, message: 'Invalid token identifiers' }

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === releasedTokenId) {
          return {
            ...pat,
            slotStatus: SlotStatus.REASSIGNED_TO_WALKIN,
            reassignedToToken: walkInTokenId,
          }
        }
        if (pat.token === walkInTokenId) {
          return {
            ...pat,
            // Fast track walk-in into the released slot with current doctor
            doctor: released.doctor,
            room: released.room,
            department: released.department,
            estimatedWaitMinutes: 5, // Immediate upcoming slot
            fastTrackedFromSlot: releasedTokenId,
          }
        }
        return pat
      })
    )

    logAuditAction({
      token: walkInTokenId,
      actor: staffName,
      action: 'RELEASED_SLOT_REASSIGNED',
      details: `Walk-in patient ${walkIn.patientName} (${walkInTokenId}) fast-tracked into released slot from absent token ${releasedTokenId} in ${released.department}.`,
      previousStatus: walkIn.status,
      newStatus: 'fast_tracked_slot',
    })

    return { success: true, message: `Walk-in patient ${walkInTokenId} assigned to released slot under ${released.doctor}.` }
  }

  /**
   * DEPARTMENT TRANSFER WITH QUEUE REASSIGNMENT & NOTIFICATION
   */
  const transferPatientDepartment = async ({
    tokenId,
    fromDept,
    toDept,
    targetDoctor,
    reason,
    transferredBy = 'Clinical Triage Nurse',
  }) => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    const targetDeptConfig = departmentsList.find((d) => d.name === toDept) || departmentsList[0]
    const assignedDoc = targetDoctor || targetDeptConfig.doctors.find((d) => d.status === DoctorStatus.AVAILABLE)?.name || targetDeptConfig.doctors[0]?.name || 'Specialist'
    const assignedRoom = targetDeptConfig.doctors.find((d) => d.name === assignedDoc)?.room || targetDeptConfig.room

    // Recalculate wait time in target department
    const targetDeptWaiting = patients.filter(
      (pat) => pat.hospital === p.hospital && pat.department === toDept && pat.status === 'waiting'
    ).length
    const newWaitTime = Math.max(5, targetDeptWaiting * targetDeptConfig.avgTimePerPatient)

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === tokenId) {
          return {
            ...pat,
            department: toDept,
            doctor: assignedDoc,
            room: assignedRoom,
            estimatedWaitMinutes: newWaitTime,
            status: 'waiting',
            lastTransferredFrom: fromDept,
            transferReason: reason,
          }
        }
        return pat
      })
    )

    // Log Audit Trail
    logAuditAction({
      token: tokenId,
      actor: transferredBy,
      action: 'DEPARTMENT_TRANSFER_COMPLETED',
      details: `Transferred from ${fromDept} to ${toDept} under ${assignedDoc} (${assignedRoom}). Clinical reason: "${reason}".`,
      previousStatus: fromDept,
      newStatus: toDept,
    })

    // Send Updated Notification to Patient
    const transferNotif = {
      id: 'NOTIF-TRANSFER-' + Math.random().toString(36).substr(2, 7),
      bookingToken: tokenId,
      recipientType: p.isMinor ? 'guardian' : 'patient',
      recipientName: p.isMinor ? p.guardianName : p.patientName,
      recipientPhone: p.isMinor ? p.guardianPhone : p.phone,
      channel: 'in_app',
      stage: 'department_transfer',
      message: `TRANSFER UPDATE: Token ${tokenId} has been transferred from ${fromDept} to ${toDept} under ${assignedDoc} in ${assignedRoom}. Reason: ${reason}. Please proceed to ${assignedRoom}.`,
      actionOptions: ['OK'],
      status: 'delivered',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      isExternalDelivered: false,
      externalNotice: 'Live Department Transfer Dispatched',
    }

    setNotifications((prev) => [transferNotif, ...prev])

    return {
      success: true,
      message: `Patient ${tokenId} transferred to ${toDept} (${assignedDoc}, ${assignedRoom}). Queue recalculated.`,
    }
  }

  /**
   * STAGE 1: ANSWER BOOKING VERIFICATION (YES / NO)
   */
  const answerStage1Verification = async (tokenId, responseAnswer, actor = 'patient') => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    if (p.bookingVerificationStatus === Stage1BookingStatus.VERIFIED) {
      return { success: false, message: 'Booking already verified.' }
    }
    if (p.bookingVerificationStatus === Stage1BookingStatus.FLAGGED_UNAUTHORIZED) {
      return { success: false, message: 'Booking has already been flagged as unauthorized.' }
    }

    const previousStatus = p.bookingVerificationStatus

    if (responseAnswer === 'YES') {
      setPatients((prev) =>
        prev.map((pat) => {
          if (pat.token === tokenId) {
            return {
              ...pat,
              bookingVerificationStatus: Stage1BookingStatus.VERIFIED,
              bookingVerifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              bookingVerifiedBy: p.isMinor ? 'guardian' : actor,
            }
          }
          return pat
        })
      )

      logAuditAction({
        token: tokenId,
        actor: p.isMinor ? `Guardian (${p.guardianName})` : `Patient (${p.patientName})`,
        action: 'STAGE1_VERIFIED_YES',
        details: 'Booking confirmed as authorized. Token activated into active hospital queue.',
        previousStatus,
        newStatus: Stage1BookingStatus.VERIFIED,
      })

      const notif2 = await sendStage2AttendanceNotification({ patient: p })
      setNotifications((prev) => [notif2, ...prev])

      return { success: true, status: 'verified', message: 'Booking successfully verified and activated!' }
    } else {
      setPatients((prev) =>
        prev.map((pat) => {
          if (pat.token === tokenId) {
            return {
              ...pat,
              bookingVerificationStatus: Stage1BookingStatus.FLAGGED_UNAUTHORIZED,
              status: 'cancelled',
              slotStatus: SlotStatus.RELEASED_AVAILABLE,
              attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CANCELLED,
            }
          }
          return pat
        })
      )

      logAuditAction({
        token: tokenId,
        actor: p.isMinor ? `Guardian (${p.guardianName})` : `Patient (${p.patientName})`,
        action: 'STAGE1_FLAGGED_UNAUTHORIZED_NO',
        details: 'User answered NO. Flagged as unauthorized appointment. Active queue slot released. Hospital reception alerted.',
        previousStatus,
        newStatus: Stage1BookingStatus.FLAGGED_UNAUTHORIZED,
      })

      const alertNotif = {
        id: 'NOTIF-ALERT-' + Math.random().toString(36).substr(2, 7),
        bookingToken: tokenId,
        recipientType: 'hospital_reception',
        recipientName: `${p.hospital} Reception Desk`,
        recipientPhone: 'Reception Internal',
        channel: 'in_app',
        stage: 'unauthorized_alert',
        message: `SECURITY ALERT: Token ${tokenId} (${p.patientName}) answered NO to booking verification. Flagged as potentially unauthorized. Slot released.`,
        status: 'delivered',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
      }
      setNotifications((prev) => [alertNotif, ...prev])

      return {
        success: true,
        status: 'flagged_unauthorized',
        message: 'Booking flagged as unauthorized. Queue slot released and reception notified.',
      }
    }
  }

  /**
   * STAGE 1: EXPIRE BOOKING (WHEN GRACE PERIOD RUNS OUT)
   */
  const expireBooking = (tokenId) => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return

    if (p.bookingVerificationStatus !== Stage1BookingStatus.PENDING_VERIFICATION) return

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === tokenId) {
          return {
            ...pat,
            bookingVerificationStatus: Stage1BookingStatus.EXPIRED,
            status: 'cancelled',
            slotStatus: SlotStatus.RELEASED_AVAILABLE,
          }
        }
        return pat
      })
    )

    logAuditAction({
      token: tokenId,
      actor: 'MediQ AI System Expiry Daemon',
      action: 'STAGE1_GRACE_PERIOD_EXPIRED',
      details: 'Verification grace period elapsed without response. Slot released. Authorized staff can reactivate if required.',
      previousStatus: Stage1BookingStatus.PENDING_VERIFICATION,
      newStatus: Stage1BookingStatus.EXPIRED,
    })
  }

  /**
   * STAFF OVERRIDE BOOKING STATUS
   */
  const staffOverrideBookingStatus = (tokenId, newStatus, staffName, justificationReason) => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    const prevStatus = p.bookingVerificationStatus

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.token === tokenId) {
          return {
            ...pat,
            bookingVerificationStatus: newStatus,
            status: newStatus === Stage1BookingStatus.VERIFIED ? 'waiting' : pat.status,
            slotStatus: newStatus === Stage1BookingStatus.VERIFIED ? SlotStatus.CLAIMED : pat.slotStatus,
            bookingVerifiedBy: `staff_override:${staffName}`,
            bookingVerifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return pat
      })
    )

    logAuditAction({
      token: tokenId,
      actor: `Staff Override: ${staffName || 'Receptionist'}`,
      action: 'STAFF_STATUS_OVERRIDE',
      details: `Staff overrode status to ${newStatus}. Justification: "${justificationReason || 'Manual patient identity verification at reception'}"`,
      previousStatus: prevStatus,
      newStatus,
    })

    return { success: true, message: `Status updated to ${newStatus} with audit record.` }
  }

  /**
   * STAGE 2: ANSWER ATTENDANCE (YES / NO)
   */
  const answerStage2Attendance = (tokenId, responseAnswer) => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    const prevStatus = p.attendanceStatus

    if (responseAnswer === 'YES') {
      setPatients((prev) =>
        prev.map((pat) => {
          if (pat.token === tokenId) {
            return {
              ...pat,
              attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
              attendanceConfirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          }
          return pat
        })
      )

      logAuditAction({
        token: tokenId,
        actor: p.isMinor ? `Guardian (${p.guardianName})` : `Patient (${p.patientName})`,
        action: 'STAGE2_ATTENDANCE_CONFIRMED',
        details: 'Patient confirmed they will attend the scheduled consultation.',
        previousStatus: prevStatus,
        newStatus: Stage2AttendanceStatus.ATTENDANCE_CONFIRMED,
      })

      return { success: true, message: 'Attendance confirmed successfully.' }
    } else {
      setPatients((prev) =>
        prev.map((pat) => {
          if (pat.token === tokenId) {
            return {
              ...pat,
              attendanceStatus: Stage2AttendanceStatus.ATTENDANCE_CANCELLED,
              status: 'cancelled',
              slotStatus: SlotStatus.RELEASED_AVAILABLE,
            }
          }
          return pat
        })
      )

      logAuditAction({
        token: tokenId,
        actor: p.isMinor ? `Guardian (${p.guardianName})` : `Patient (${p.patientName})`,
        action: 'STAGE2_ATTENDANCE_CANCELLED',
        details: 'Patient indicated they cannot attend. Slot released; available for walk-in or queue advancement.',
        previousStatus: prevStatus,
        newStatus: Stage2AttendanceStatus.ATTENDANCE_CANCELLED,
      })

      return { success: true, message: 'Appointment cancelled. Your reserved slot has been released.' }
    }
  }

  /**
   * MARK HOSPITAL ARRIVAL (By Receptionist or Self-Arrival)
   */
  const markHospitalArrival = (tokenId, actor = 'Receptionist') => {
    return updateArrivalStatus(tokenId, ArrivalStatus.ARRIVED, actor)
  }

  /**
   * TRIGGER AUTOMATED VOICE CALL
   */
  const sendVoiceCallReminder = async (tokenId) => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    const res = await triggerAutomatedVoiceCall({ patient: p })

    logAuditAction({
      token: tokenId,
      actor: 'Receptionist / Auto-Caller',
      action: 'AUTOMATED_VOICE_CALL_TRIGGERED',
      details: res.message,
      previousStatus: p.attendanceStatus,
      newStatus: p.attendanceStatus,
    })

    return res
  }

  /**
   * SEND REMINDER NOTIFICATION
   */
  const sendReminderNotification = async (tokenId, stage = 'stage1') => {
    const p = patients.find((pat) => pat.token === tokenId)
    if (!p) return { success: false, message: 'Patient not found' }

    const notif = {
      id: 'NOTIF-REM-' + Math.random().toString(36).substr(2, 7),
      bookingToken: tokenId,
      recipientType: p.isMinor ? 'guardian' : 'patient',
      recipientName: p.isMinor ? p.guardianName : p.patientName,
      recipientPhone: p.isMinor ? p.guardianPhone : p.phone,
      channel: 'in_app',
      stage: stage === 'stage1' ? 'stage1_booking' : 'stage2_attendance',
      message:
        stage === 'stage1'
          ? `REMINDER: Please verify your appointment request for Token ${tokenId}. Reply YES to confirm or NO to cancel.`
          : `REMINDER: Your appointment for Token ${tokenId} is upcoming. Reply YES if attending or NO to cancel.`,
      actionOptions: ['YES', 'NO'],
      status: 'delivered',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
    }

    setNotifications((prev) => [notif, ...prev])

    logAuditAction({
      token: tokenId,
      actor: 'Receptionist / Notification Service',
      action: 'VERIFICATION_REMINDER_SENT',
      details: `Follow-up reminder sent for ${stage}.`,
      previousStatus: p.bookingVerificationStatus,
      newStatus: p.bookingVerificationStatus,
    })

    return { success: true, message: 'Reminder sent successfully.' }
  }

  /**
   * UPDATE CLINICAL QUEUE STATUS (Doctor Consultation)
   */
  
const updatePatientStatus = (tokenId, newStatus) => {
  const patient = patients.find((p) => p.token === tokenId)

  if (!patient) {
    return { success: false, message: 'Patient not found' }
  }

  setPatients((prev) =>
    prev.map((pat) =>
      pat.token === tokenId
        ? { ...pat, status: newStatus }
        : pat
    )
  )

  logAuditAction({
    token: tokenId,
    actor: 'Doctor / Clinical Staff',
    action: `CLINICAL_QUEUE_${newStatus.toUpperCase()}`,
    details: `Patient moved from ${patient.status} to ${newStatus}.`,
    previousStatus: patient.status,
    newStatus,
  })

  return {
    success: true,
    message: `Patient status updated to ${newStatus}.`,
  }
}


  /**
   * DYNAMIC DEPARTMENT STATS CALCULATION
   * Dynamically factors in: Active Doctors, Arrived/Verified Patients, and Walk-ins
   */
  const getDepartmentStats = (hospitalName, departmentName) => {
    const deptPatients = patients.filter(
      (p) => p.hospital === hospitalName && p.department === departmentName
    )

    const activeWaiting = deptPatients.filter(
      (p) =>
        p.status === 'waiting' &&
        p.slotStatus !== SlotStatus.RELEASED_AVAILABLE &&
        (p.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ||
          p.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ||
          p.bookingType === BookingType.WALK_IN)
    )

    const onlineCount = deptPatients.filter((p) => p.bookingType === BookingType.ONLINE && p.status === 'waiting').length
    const walkInCount = deptPatients.filter((p) => p.bookingType === BookingType.WALK_IN && p.status === 'waiting').length
    const releasedSlotsCount = deptPatients.filter((p) => p.slotStatus === SlotStatus.RELEASED_AVAILABLE).length

    const deptConfig = departmentsList.find((d) => d.name === departmentName) || departmentsList[0]
    const availableDocs = deptConfig.doctors.filter((d) => d.status === DoctorStatus.AVAILABLE).length
    const activeDocCount = availableDocs > 0 ? availableDocs : 1

    // Estimated wait time divided by active doctors
    const estWait = Math.ceil((activeWaiting.length * deptConfig.avgTimePerPatient) / activeDocCount)

    return {
      waitingCount: activeWaiting.length,
      onlineCount,
      walkInCount,
      releasedSlotsCount,
      totalCount: deptPatients.length,
      estimatedWait: estWait === 0 ? '5 mins' : `${estWait} mins`,
      activeDoctorCount: availableDocs,
      doctors: deptConfig.doctors,
      room: deptConfig.room,
    }
  }

  // Get patient by token
  const getPatientByToken = (tokenQuery) => {
    if (!tokenQuery) return null
    const cleaned = tokenQuery.trim().toUpperCase()
    return patients.find((p) => p.token.toUpperCase() === cleaned) || null
  }

  // Get patient position in their department queue
  const getPatientQueuePosition = (patient) => {
    if (!patient || patient.status !== 'waiting') return 0

    const activeWaitingList = patients
      .filter(
        (p) =>
          p.hospital === patient.hospital &&
          p.department === patient.department &&
          p.status === 'waiting' &&
          p.slotStatus !== SlotStatus.RELEASED_AVAILABLE &&
          (p.bookingVerificationStatus === Stage1BookingStatus.VERIFIED ||
            p.bookingVerificationStatus === Stage1BookingStatus.BYPASSED_EMERGENCY ||
            p.bookingType === BookingType.WALK_IN)
      )
      .reverse()

    const idx = activeWaitingList.findIndex((p) => p.token === patient.token)
    return idx >= 0 ? idx + 1 : 1
  }

  return (
    <QueueContext.Provider
      value={{
        hospitals: HOSPITALS,
        departments: departmentsList,
        patients,
        auditLogs,
        notifications,
        gracePeriodMinutes,
        setGracePeriodMinutes,
        registerWalkInPatient,
        addPatient,
        updateArrivalStatus,
        releaseUnclaimedSlot,
        assignReleasedSlotToWalkIn,
        transferPatientDepartment,
        updateDoctorAvailability,
        answerStage1Verification,
        expireBooking,
        staffOverrideBookingStatus,
        answerStage2Attendance,
        markHospitalArrival,
        sendVoiceCallReminder,
        sendReminderNotification,
        updatePatientStatus,
        getDepartmentStats,
        getPatientByToken,
        getPatientQueuePosition,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
