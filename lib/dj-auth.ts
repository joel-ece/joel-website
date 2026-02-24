import { supabase } from './supabase';

export interface DJTeam {
    id: string;
    team_id: string;
    team_name: string;
    member1_name: string;
    member2_name: string;
    current_round: number;
    score_round1: number;
    score_round2: number;
    score_final: number;
    total_score: number;
    is_finalist: boolean;
    assigned_questions: number[];
}

export type DJEventState = {
    is_round1_locked: boolean;
    is_round2_unlocked: boolean;
    is_leaderboard_frozen: boolean;
    event_start_time: string | null;
    r1_start_time: string | null;
    r2_start_time: string | null;
    r1_duration_mins: number;
    r2_duration_mins: number;
}

export function isTimerActive(startTime: string | null, durationMins: number): boolean {
    if (!startTime) return false;
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const durationMs = durationMins * 60 * 1000;
    return now >= start && now <= start + durationMs;
}

/**
 * Since we are using a custom teams table for the event to avoid 
 * standard auth friction, we'll manage a local storage token.
 */
export const DJ_TEAM_TOKEN_KEY = 'dj_team_token';

export async function getDJTeamByToken() {
    if (typeof window === 'undefined') return null;
    const teamId = localStorage.getItem(DJ_TEAM_TOKEN_KEY);
    if (!teamId) return null;

    const { data, error } = await supabase
        .from('dj_teams')
        .select('*')
        .eq('team_id', teamId)
        .single();

    if (error || !data) {
        localStorage.removeItem(DJ_TEAM_TOKEN_KEY);
        return null;
    }

    return data as DJTeam;
}

export async function loginDJTeam(teamId: string, teamIdInput: string) {
    // Simple check for event (in production, use hashed passwords)
    const { data, error } = await supabase
        .from('dj_teams')
        .select('*')
        .eq('team_id', teamId)
        .single();

    if (error || !data) {
        return { error: 'Team not found' };
    }

    // Check if teamId matches password (for simplicity/simultaneous login in lab)
    // In a real scenario, we'd have a separate password field.
    // Given the request: "Secure login credentials", we'll check the 'password' field.
    if (data.password !== teamIdInput) {
        return { error: 'Invalid credentials' };
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(DJ_TEAM_TOKEN_KEY, data.team_id);
    }

    return { team: data as DJTeam };
}

export async function logoutDJTeam() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(DJ_TEAM_TOKEN_KEY);
    }
}

export async function getEventState() {
    const { data, error } = await supabase
        .from('dj_event_state')
        .select('*')
        .eq('id', 'global_config')
        .single();

    if (error) return null;
    return data as DJEventState;
}
