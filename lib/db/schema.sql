-- Mentors table (for Admin access)
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS dj_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id TEXT UNIQUE NOT NULL, -- Human-readable ID (e.g., TEAM-01)
    password TEXT NOT NULL,
    team_name TEXT NOT NULL,
    member1_name TEXT NOT NULL,
    member2_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    
    current_round INTEGER DEFAULT 0, -- 0: Registration, 1: Round 1, 2: Round 2, 3: Final
    round1_completed_at TIMESTAMPTZ,
    round2_completed_at TIMESTAMPTZ,
    
    score_round1 INTEGER DEFAULT 0,
    score_round2 INTEGER DEFAULT 0,
    score_final INTEGER DEFAULT 0,
    total_score INTEGER GENERATED ALWAYS AS (score_round1 + score_round2 + score_final) STORED,
    
    is_finalist BOOLEAN DEFAULT FALSE,
    assigned_questions JSONB DEFAULT '[]', -- Array of question IDs assigned to this team (e.g. [2, 7, 4])
    registration_timestamp TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Event state / Configuration
CREATE TABLE IF NOT EXISTS dj_event_state (
    id TEXT PRIMARY KEY DEFAULT 'global_config',
    is_round1_locked BOOLEAN DEFAULT FALSE,
    is_round2_unlocked BOOLEAN DEFAULT FALSE,
    is_leaderboard_frozen BOOLEAN DEFAULT FALSE,
    r1_start_time TIMESTAMPTZ,
    r2_start_time TIMESTAMPTZ,
    r1_duration_mins INTEGER DEFAULT 60,
    r2_duration_mins INTEGER DEFAULT 60
);

-- Submissions table for tracking detailed responses
CREATE TABLE IF NOT EXISTS dj_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_uuid UUID REFERENCES dj_teams(id),
    round_number INTEGER NOT NULL,
    submission_content JSONB, -- For Round 1 logic expressions or Round 2 metadata
    file_path TEXT, -- For Round 2 audio files
    score INTEGER,
    judge_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Initial setup (disable during dev if needed, but good to have)
ALTER TABLE dj_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_event_state ENABLE ROW LEVEL SECURITY;

-- Simple policies for anon access (enable full CRUD for event use)
CREATE POLICY "Public read for teams" ON dj_teams FOR SELECT USING (true);
CREATE POLICY "Public insert for teams" ON dj_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for teams" ON dj_teams FOR UPDATE USING (true);

CREATE POLICY "Public read for state" ON dj_event_state FOR SELECT USING (true);
CREATE POLICY "Public update for state" ON dj_event_state FOR UPDATE USING (true);

CREATE POLICY "Public read for submissions" ON dj_submissions FOR SELECT USING (true);
CREATE POLICY "Public insert for submissions" ON dj_submissions FOR INSERT WITH CHECK (true);

-- INITIAL DATA
INSERT INTO dj_event_state (id, is_round1_locked, is_round2_unlocked, is_leaderboard_frozen)
VALUES ('global_config', false, false, false)
ON CONFLICT (id) DO NOTHING;

-- NOTE: You must also create a PUBLIC storage bucket named 'dj-submissions' 
-- in the Supabase Storage dashboard for Round 2 uploads to work.
