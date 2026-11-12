-- MediQ AI: Comprehensive Database Schema (Online & Walk-In Patients, Multi-Department Queues)
-- PostgreSQL / Supabase Compatible

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patient Profiles Directory (Reusable across visits)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. PID-1001
    patient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    allergies TEXT,
    medical_history TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Doctor Roster & Availability
CREATE TABLE IF NOT EXISTS doctor_roster (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    hospital_name VARCHAR(255) NOT NULL,
    availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'in_consultation', 'on_break', 'off_duty'
    current_patient_token VARCHAR(50),
    last_status_change TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patient Bookings & Walk-In Queues
CREATE TABLE IF NOT EXISTS patient_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. ON-101 (Online), WK-201 (Walk-in)
    booking_type VARCHAR(50) NOT NULL DEFAULT 'online', -- 'online' or 'walk_in'
    patient_profile_id UUID REFERENCES patient_profiles(id),
    patient_id VARCHAR(50),
    
    hospital_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    assigned_doctor_name VARCHAR(255),
    assigned_room VARCHAR(50),
    
    -- Patient Basic Info
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_age INT NOT NULL,
    is_minor BOOLEAN DEFAULT FALSE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(50),
    guardian_relationship VARCHAR(100),
    
    -- Clinical Details & AI Suggestion
    triage_priority VARCHAR(20) DEFAULT 'P4', -- P1 (Emergency), P2, P3, P4
    chief_complaint TEXT,
    ai_suggested_department VARCHAR(100),
    ai_confidence_score INT,
    clinical_staff_confirmed_by VARCHAR(100),
    
    -- STAGE 1: BOOKING VERIFICATION (For Online Bookings)
    booking_verification_status VARCHAR(50) DEFAULT 'verified',
    -- 'pending_verification', 'verified', 'flagged_unauthorized', 'expired', 'bypassed_emergency'
    verification_token VARCHAR(255),
    verification_expires_at TIMESTAMPTZ,
    
    -- STAGE 2: ATTENDANCE & ARRIVAL
    attendance_status VARCHAR(50) DEFAULT 'attendance_confirmed',
    -- 'attendance_pending', 'attendance_confirmed', 'attendance_cancelled', 'no_show'
    arrival_status VARCHAR(50) DEFAULT 'not_arrived',
    -- 'not_arrived', 'arrived', 'late'
    arrived_at TIMESTAMPTZ,
    
    -- GRACE PERIOD & RELEASED SLOT RECYCLING
    grace_period_minutes INT DEFAULT 15,
    slot_status VARCHAR(50) DEFAULT 'claimed',
    -- 'claimed', 'released_available', 'reassigned_to_walkin'
    slot_released_at TIMESTAMPTZ,
    reassigned_to_token VARCHAR(50),
    
    -- CLINICAL QUEUE EXECUTION
    queue_status VARCHAR(50) DEFAULT 'waiting',
    -- 'waiting', 'with_doctor', 'completed', 'transferred', 'cancelled'
    estimated_wait_minutes INT DEFAULT 10,
    consultation_started_at TIMESTAMPTZ,
    consultation_completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Department Transfer Records
CREATE TABLE IF NOT EXISTS department_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES patient_bookings(id) ON DELETE CASCADE,
    token_number VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    from_department VARCHAR(100) NOT NULL,
    to_department VARCHAR(100) NOT NULL,
    from_doctor VARCHAR(255),
    to_doctor VARCHAR(255) NOT NULL,
    transfer_reason TEXT NOT NULL,
    transferred_by VARCHAR(100) NOT NULL, -- staff member name
    transferred_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Verification & Operational Audit Trail
CREATE TABLE IF NOT EXISTS verification_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID,
    token_number VARCHAR(50) NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    actor_identifier VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications History
CREATE TABLE IF NOT EXISTS notification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_token VARCHAR(50) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    message_content TEXT NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'delivered',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_dept_queue ON patient_bookings (hospital_name, department_name, queue_status);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON patient_bookings (booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_arrival ON patient_bookings (arrival_status);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON patient_profiles (phone);
CREATE INDEX IF NOT EXISTS idx_profiles_patient_id ON patient_profiles (patient_id);
