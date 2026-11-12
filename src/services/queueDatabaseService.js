/**
 * Queue Database Service for MediQ AI
 * 
 * Provides Supabase persistent database integration with automatic local fallback
 * for Patient Profiles, Bookings, Walk-ins, Doctor Rosters, and Department Transfers.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Seed Profiles Directory
export const INITIAL_PROFILES = [
  {
    patientId: 'PID-1001',
    patientName: 'Ravi Kumar',
    phone: '9840123456',
    age: 45,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: 'Penicillin',
    medicalHistory: 'Mild Hypertension (since 2021)',
    registeredAt: '2024-01-15',
  },
  {
    patientId: 'PID-1002',
    patientName: 'Kavitha S.',
    phone: '9840987654',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: 'None',
    medicalHistory: 'Gestational diabetes (resolved)',
    registeredAt: '2024-03-20',
  },
  {
    patientId: 'PID-1003',
    patientName: 'Praveen Nathan',
    phone: '9789123456',
    age: 28,
    gender: 'Male',
    bloodGroup: 'A+',
    allergies: 'Sulfa drugs',
    medicalHistory: 'Asthma in childhood',
    registeredAt: '2024-06-10',
  },
  {
    patientId: 'PID-1004',
    patientName: 'Meenakshi Sundaram',
    phone: '9840555123',
    age: 62,
    gender: 'Female',
    bloodGroup: 'AB+',
    allergies: 'Aspirin',
    medicalHistory: 'Type 2 Diabetes, Knee Osteoarthritis',
    registeredAt: '2024-07-02',
  },
  {
    patientId: 'PID-1005',
    patientName: 'Arjun Verma',
    phone: '9940123987',
    age: 39,
    gender: 'Male',
    bloodGroup: 'O-',
    allergies: 'None',
    medicalHistory: 'Migraine episodes',
    registeredAt: '2024-08-14',
  },
]

/**
 * Searches patient profiles by Patient ID or Mobile Number
 */
export async function searchPatientProfile(query) {
  if (!query || typeof query !== 'string' || !query.trim()) return null
  const cleaned = query.trim().toUpperCase()
  const phoneClean = query.replace(/\D/g, '')

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .or(`patient_id.eq.${cleaned},phone.eq.${phoneClean}`)
        .maybeSingle()

      if (!error && data) {
        return data
      }
    } catch (e) {
      console.warn('Supabase profile query fallback to local cache:', e)
    }
  }

  // 2. Query Local Persistent Cache
  const localProfiles = getLocalProfiles()
  const match = localProfiles.find(
    (p) =>
      p.patientId.toUpperCase() === cleaned ||
      p.phone.replace(/\D/g, '') === phoneClean ||
      p.patientName.toUpperCase().includes(cleaned)
  )

  return match || null
}

/**
 * Saves or updates patient profile in persistent store
 */
export async function savePatientProfile(profile) {
  const local = getLocalProfiles()
  const existingIdx = local.findIndex(
    (p) => p.patientId === profile.patientId || p.phone === profile.phone
  )

  let updatedList = []
  if (existingIdx >= 0) {
    updatedList = [...local]
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...profile }
  } else {
    updatedList = [profile, ...local]
  }

  localStorage.setItem('mediq_patient_profiles', JSON.stringify(updatedList))

  // Sync to Supabase if available
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('patient_profiles').upsert([profile])
    } catch (e) {
      console.warn('Supabase upsert profile queued locally:', e)
    }
  }

  return profile
}

export function getLocalProfiles() {
  const saved = localStorage.getItem('mediq_patient_profiles')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse patient profiles', e)
    }
  }
  return INITIAL_PROFILES
}

/**
 * Syncs booking record to Supabase
 */
export async function syncBookingRecord(booking) {
  if (!isSupabaseConfigured()) return booking

  try {
    const { error } = await supabase.from('patient_bookings').upsert([booking])
    if (error) {
      console.warn('Supabase booking sync warning:', error.message)
    }
  } catch (err) {
    console.warn('Supabase booking sync offline fallback:', err)
  }

  return booking
}
