-- NYAYASETU Initial Relational Schema
-- Version: 001_initial_schema.sql

-- Extensions (if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('citizen', 'advocate', 'law_student', 'admin')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Advocate Profiles & Verification
CREATE TABLE IF NOT EXISTS advocate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bar_registration_number VARCHAR(100) NOT NULL,
    state_bar_council VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    practice_areas TEXT[] DEFAULT '{}',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_advocate_user UNIQUE(user_id)
);

-- 3. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash VARCHAR(64) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- 4. Source Registry
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL CHECK (source_type IN ('government_portal', 'statute', 'court_judgment', 'scheme_guidelines', 'open_dataset')),
    publisher VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'India',
    categories TEXT[] DEFAULT '{}',
    official_url TEXT NOT NULL,
    license_or_reuse_notes TEXT,
    publication_date DATE,
    effective_from DATE,
    effective_to DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('unverified', 'verified', 'stale', 'quarantined')),
    ingestion_status VARCHAR(50) NOT NULL DEFAULT 'ready' CHECK (ingestion_status IN ('pending', 'in_progress', 'ready', 'failed')),
    authority_level INT NOT NULL DEFAULT 1 CHECK (authority_level BETWEEN 1 AND 5),
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_data_sources_categories ON data_sources USING GIN(categories);

-- 5. Legal Sources & Provisions
CREATE TABLE IF NOT EXISTS legal_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_title VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'India',
    publication_date DATE,
    effective_from DATE,
    official_url TEXT NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'verified',
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS legal_provisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_source_id UUID NOT NULL REFERENCES legal_sources(id) ON DELETE CASCADE,
    section_number VARCHAR(100) NOT NULL,
    section_title VARCHAR(255),
    content_text TEXT NOT NULL,
    explanation TEXT,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_legal_provisions_tsv ON legal_provisions USING GIN(search_vector);

-- 6. Court Judgments
CREATE TABLE IF NOT EXISTS judgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court VARCHAR(255) NOT NULL,
    case_title VARCHAR(255) NOT NULL,
    case_identifier VARCHAR(100) NOT NULL,
    judgment_date DATE,
    citation VARCHAR(255),
    source_url TEXT NOT NULL,
    case_summary TEXT,
    holding TEXT,
    full_text_extract TEXT NOT NULL,
    legal_topics TEXT[] DEFAULT '{}',
    search_vector tsvector,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_judgments_tsv ON judgments USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_judgments_topics ON judgments USING GIN(legal_topics);

-- 7. Government Dataset Records (e.g. PMFBY, PM-KISAN, Grievances)
CREATE TABLE IF NOT EXISTS government_dataset_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
    record_identifier VARCHAR(100),
    scheme_name VARCHAR(255) NOT NULL,
    state_or_region VARCHAR(100) DEFAULT 'National',
    topic VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    details_text TEXT NOT NULL,
    official_url TEXT NOT NULL,
    search_vector tsvector,
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gov_records_tsv ON government_dataset_records USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_gov_records_scheme ON government_dataset_records(scheme_name);
CREATE INDEX IF NOT EXISTS idx_gov_records_topic ON government_dataset_records(topic);

-- 8. Query Sessions, Messages, and Evidence Grounding
CREATE TABLE IF NOT EXISTS query_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS query_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES query_sessions(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    detected_language VARCHAR(20) DEFAULT 'en',
    predicted_category VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(5, 4),
    model_version VARCHAR(50),
    explanation_text TEXT NOT NULL,
    uncertainty_notes TEXT,
    clarifying_question TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answer_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_message_id UUID NOT NULL REFERENCES query_messages(id) ON DELETE CASCADE,
    source_type VARCHAR(100) NOT NULL,
    source_id UUID,
    source_title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    relevance_score NUMERIC(5, 4),
    authority_level INT DEFAULT 1,
    official_url TEXT NOT NULL,
    publication_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Case Rooms and Collaboration
CREATE TABLE IF NOT EXISTS case_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_room_id UUID NOT NULL REFERENCES case_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_room VARCHAR(50) NOT NULL CHECK (role_in_room IN ('owner', 'advocate', 'client', 'observer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_room_member UNIQUE(case_room_id, user_id)
);

CREATE TABLE IF NOT EXISTS invitation_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_room_id UUID NOT NULL REFERENCES case_rooms(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    intended_email VARCHAR(255) NOT NULL,
    role_in_room VARCHAR(50) NOT NULL DEFAULT 'advocate',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    redeemed_by UUID REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_room_id UUID NOT NULL REFERENCES case_rooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Documents and Verification Checks
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_room_id UUID REFERENCES case_rooms(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'passed', 'failed', 'review_required', 'indeterminate')),
    quarantine_status VARCHAR(50) NOT NULL DEFAULT 'quarantined' CHECK (quarantine_status IN ('quarantined', 'released', 'rejected')),
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_verification_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    check_type VARCHAR(100) NOT NULL, -- e.g. mime_validation, magic_bytes, sha256_integrity, ocr_extraction, digital_signature, malware_scan
    status VARCHAR(50) NOT NULL CHECK (status IN ('passed', 'failed', 'not_checked', 'indeterminate', 'review_required')),
    details_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Audit Events
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    metadata_json JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action);
