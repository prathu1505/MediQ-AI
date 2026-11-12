/**
 * AI Department Advisor for MediQ AI
 * 
 * Analyzes reported symptoms and suggests the most appropriate clinical department.
 * IMPORTANT: Strictly an administrative queue routing heuristic.
 * NEVER a medical diagnosis. Receptionist or clinical confirmation is mandatory.
 */

const DEPARTMENT_RULES = [
  {
    department: 'Emergency Care',
    priority: 'P1',
    keywords: [
      'unconscious', 'severe bleeding', 'chest pain and collapse', 'cardiac arrest',
      'deep wound', 'massive trauma', 'choking', 'poisoning', 'snake bite', 'electrocution',
      'severe burn', 'head injury with blackout', 'respiratory failure', 'vomiting blood'
    ],
    confidenceBase: 98,
    reasoning: 'Critical red-flag symptoms indicating life-threatening emergency. Directing to Emergency Care immediately without queue delay.'
  },
  {
    department: 'Neurology',
    priority: 'P2',
    keywords: [
      'headache', 'migraine', 'seizure', 'convulsion', 'numbness', 'tingling',
      'stroke', 'facial droop', 'loss of balance', 'memory loss', 'tremor', 'parkinson',
      'dizziness', 'paralysis', 'vertigo', 'nerve pain', 'fainting spell'
    ],
    confidenceBase: 92,
    reasoning: 'Neurological symptoms affecting cranial nerves, motor control, sensory balance, or central nervous system.'
  },
  {
    department: 'Cardiology',
    priority: 'P2',
    keywords: [
      'chest pain', 'chest tightness', 'heart', 'palpitations', 'high bp', 'hypertension',
      'shortness of breath on exertion', 'irregular heartbeat', 'ecg', 'angina', 'swollen ankles with breathlessness'
    ],
    confidenceBase: 94,
    reasoning: 'Cardiovascular symptoms suggesting myocardial ischemia, rhythm disturbance, or hemodynamic assessment.'
  },
  {
    department: 'Orthopaedics',
    priority: 'P3',
    keywords: [
      'fracture', 'bone', 'joint', 'knee', 'hip', 'shoulder', 'back pain', 'spine',
      'sprain', 'ligament', 'ankle twist', 'arthritis', 'swollen knee', 'dislocation', 'fall on arm'
    ],
    confidenceBase: 91,
    reasoning: 'Musculoskeletal presentation involving bones, joints, ligaments, or spinal vertebrae.'
  },
  {
    department: 'Pediatrics',
    priority: 'P3',
    keywords: [
      'baby', 'infant', 'child', 'toddler', 'pediatric', 'vaccination', 'childhood fever',
      'rash in newborn', 'child cough', 'teething'
    ],
    confidenceBase: 95,
    reasoning: 'Age-specific pediatric presentation requiring specialized neonatal/childhood clinical protocols.'
  },
  {
    department: 'ENT',
    priority: 'P4',
    keywords: [
      'ear pain', 'ear discharge', 'hearing loss', 'throat pain', 'tonsil', 'sinus',
      'nasal congestion', 'nose bleed', 'voice hoarseness', 'difficulty swallowing'
    ],
    confidenceBase: 90,
    reasoning: 'Otorhinolaryngological presentation involving ears, nasal passages, larynx, or pharynx.'
  },
  {
    department: 'Dermatology',
    priority: 'P4',
    keywords: [
      'skin rash', 'itching', 'eczema', 'psoriasis', 'acne', 'fungal infection',
      'skin allergy', 'boil', 'mole check', 'hair loss', 'hives'
    ],
    confidenceBase: 89,
    reasoning: 'Dermatological condition of the epidermis, hair, nails, or subcutaneous tissue.'
  },
  {
    department: 'General Medicine',
    priority: 'P4',
    keywords: [
      'fever', 'cold', 'cough', 'flu', 'weakness', 'fatigue', 'body pain', 'stomach ache',
      'diarrhea', 'vomiting', 'diabetes checkup', 'general health', 'routine check', 'loss of appetite'
    ],
    confidenceBase: 86,
    reasoning: 'General systemic or internal medicine complaint suitable for primary consultation and triage.'
  }
]

export const MANDATORY_MEDICAL_DISCLAIMER =
  'MediQ AI Advisory Notice: Department suggestions are algorithmic routing recommendations based on reported chief complaints. This is NOT a medical diagnosis or clinical prescription. Confirmation by hospital receptionist, triage nurse, or qualified clinical staff is mandatory before queue assignment.'

/**
 * Suggests department from symptom text
 * @param {string} symptomText
 * @param {number|string} patientAge
 * @returns {object} suggestion
 */
export function suggestDepartmentFromSymptoms(symptomText = '', patientAge = null) {
  if (!symptomText || typeof symptomText !== 'string' || symptomText.trim().length === 0) {
    return {
      department: 'General Medicine',
      confidence: 60,
      matchedKeywords: [],
      reasoning: 'Standard general medicine intake for routine evaluation.',
      disclaimer: MANDATORY_MEDICAL_DISCLAIMER,
      isEmergency: false,
    }
  }

  const normalized = symptomText.toLowerCase()
  const age = patientAge !== null && patientAge !== '' ? parseInt(patientAge, 10) : null

  // If age < 12 and not emergency trauma, high affinity for Pediatrics
  if (age !== null && age < 12 && !normalized.includes('trauma') && !normalized.includes('bleeding')) {
    const matched = []
    DEPARTMENT_RULES[4].keywords.forEach((kw) => {
      if (normalized.includes(kw)) matched.push(kw)
    })
    return {
      department: 'Pediatrics',
      confidence: 95,
      matchedKeywords: matched.length > 0 ? matched : ['Patient is under 12 years of age'],
      reasoning: 'Patient is a child (under 12 years). Routed to specialized Pediatric care.',
      disclaimer: MANDATORY_MEDICAL_DISCLAIMER,
      isEmergency: false,
    }
  }

  // Check matching rules
  let bestMatch = null
  let maxScore = 0

  for (const rule of DEPARTMENT_RULES) {
    let matches = []
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        matches.push(kw)
      }
    }

    if (matches.length > 0) {
      // Score based on keyword hits and rule confidence
      const score = matches.length * 10 + rule.confidenceBase
      if (score > maxScore) {
        maxScore = score
        bestMatch = {
          department: rule.department,
          priority: rule.priority,
          confidence: Math.min(99, rule.confidenceBase + (matches.length - 1) * 2),
          matchedKeywords: matches,
          reasoning: rule.reasoning,
          isEmergency: rule.priority === 'P1',
        }
      }
    }
  }

  if (bestMatch) {
    return {
      ...bestMatch,
      disclaimer: MANDATORY_MEDICAL_DISCLAIMER,
    }
  }

  // Fallback to General Medicine
  return {
    department: 'General Medicine',
    priority: 'P4',
    confidence: 70,
    matchedKeywords: [],
    reasoning: 'Symptom profile is non-specific or multi-systemic. Initial General Medicine consultation recommended.',
    disclaimer: MANDATORY_MEDICAL_DISCLAIMER,
    isEmergency: false,
  }
}
