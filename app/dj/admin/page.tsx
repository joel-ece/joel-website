'use client';

import React, { useEffect, useState } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { supabase } from '@/lib/supabase';
import { DJTeam, getEventState, DJEventState } from '@/lib/dj-auth';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, LogIn, LogOut } from 'lucide-react';
import { QUESTION_BANK } from '@/lib/dj-questions';
import { judgeAudio } from '@/lib/dj-audio-judge';

export default function AdminDashboard() {
    const { user, mentor, loading: authLoading, signIn, signUp, signOut } = useAuth();
    const [teams, setTeams] = useState<DJTeam[]>([]);
    const [eventState, setEventState] = useState<DJEventState | null>(null);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [editingScore, setEditingScore] = useState<{ id: string, round: string, value: number } | null>(null);
    const [judgingTeamId, setJudgingTeamId] = useState<string | null>(null);

    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const fetchData = async () => {
        const { data: teamData } = await supabase.from('dj_teams').select('*').order('team_id');
        const { data: subData } = await supabase.from('dj_submissions').select('*, dj_teams(team_name, team_id)');
        const state = await getEventState();

        setTeams(teamData || []);
        setSubmissions(subData || []);
        setEventState(state);
        setLoading(false);
    };

    useEffect(() => {
        if (!mentor) return;
        fetchData();

        // Subscribe to changes
        const teamsSub = supabase.channel('admin_changes')
            .on('postgres_changes', { event: '*', table: 'dj_teams', schema: 'public' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(teamsSub); };
    }, [mentor]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        const { error } = isSignUp
            ? await signUp!(email, password)
            : await signIn(email, password);

        if (error) {
            setLoginError(error.message);
            setLoginLoading(false);
        }
    };

    const updateScore = async (teamId: string, round: string, score: number) => {
        const { error } = await supabase
            .from('dj_teams')
            .update({ [`score_round${round}`]: score })
            .eq('id', teamId);

        if (!error) {
            setEditingScore(null);
            // Re-fetch data to update the UI with the new score
            const { data: teamData } = await supabase.from('dj_teams').select('*').order('team_id');
            setTeams(teamData || []);
        }
    };

    const autoJudgeTeam = async (teamId: string, filePath: string) => {
        setJudgingTeamId(teamId);
        try {
            // 1. Fetch original track
            const origRes = await fetch('/assets/dj/original_heatwaves.mp3');
            if (!origRes.ok) throw new Error('Original track 404');
            const origArrayBuffer = await origRes.arrayBuffer();

            // 2. Fetch submission from Supabase Storage
            const { data: subData, error: subError } = await supabase.storage
                .from('dj-submissions')
                .download(filePath);
            if (subError) throw new Error('Submission fetch error');
            const subArrayBuffer = await subData.arrayBuffer();

            // 3. Decode both
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const [origBuffer, subBuffer] = await Promise.all([
                audioCtx.decodeAudioData(origArrayBuffer),
                audioCtx.decodeAudioData(subArrayBuffer)
            ]);

            // 4. JUDGE
            const result = await judgeAudio(subBuffer, origBuffer);

            // 5. Update Database
            await updateScore(teamId, '2', result.total);
            alert(`Auto-Judge Complete for ${teams.find(t => t.id === teamId)?.team_name}:\n\nTotal Score: ${result.total}/100\nSimilarity: ${result.similarity}%\nAlignment: ${result.alignment}%\nCleanliness: ${result.cleanliness}%`);

            audioCtx.close();
        } catch (err: any) {
            console.error(err);
            alert('Judging failed: ' + err.message);
        } finally {
            setJudgingTeamId(null);
        }
    };
    const setTimerField = (field: keyof DJEventState, value: string | number) => {
        setEventState(prev => ({ ...prev, [field]: value } as DJEventState));
    };

    const saveTimer = async (startField: keyof DJEventState, durationField: keyof DJEventState) => {
        if (!eventState) return;
        const updates: Partial<DJEventState> = {
            [startField]: eventState[startField],
            [durationField]: eventState[durationField],
        } as any;
        const { error } = await supabase.from('dj_event_state').upsert({ id: 'global_config', ...updates }, { onConflict: 'id' });
        if (error) console.error('Timer save error', error);
        else await fetchData();
    };

    const toggleRoundLock = async (field: keyof DJEventState, value: boolean) => {
        await supabase.from('dj_event_state').update({ [field]: value }).eq('id', 'global_config');
        const newState = await getEventState();
        setEventState(newState);
    };


    if (authLoading) return <DJLayout><div className="flex justify-center py-20">AUTHENTICATING...</div></DJLayout>;

    if (!mentor) {
        return (
            <DJLayout title={isSignUp ? "Admin Registration" : "Admin Auth Required"}>
                <div className="max-w-md mx-auto py-24">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                            {isSignUp ? 'New Admin Entry' : 'Admin Access'}
                        </h1>
                        <p className="text-white/40 text-sm">
                            {isSignUp ? 'Register your mentor credentials.' : 'JoEL Mentor credentials required for entry.'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Mentor Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 focus:border-purple-500 outline-none transition-colors"
                                        placeholder="mentor@pes.edu"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Security Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 focus:border-purple-500 outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {loginError && <div className="text-red-400 text-sm font-medium">{loginError}</div>}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            {loginLoading ? 'VERIFYING...' : (isSignUp ? 'REGISTER & ENTER' : 'AUTHORIZE ENTRY')}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setLoginError(''); }}
                            className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                        >
                            {isSignUp ? 'Back to Login' : 'First time? Create Admin ID'}
                        </button>
                    </form>
                </div>
            </DJLayout>
        );
    }

    if (loading) return <DJLayout><div className="flex justify-center py-20">LOAD_ADMIN_PROTOCOL...</div></DJLayout>;

    return (
        <DJLayout title="Control Center: Administrative Override">
            <div className="space-y-12 py-8">

                {/* Header with Logout */}
                <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-white/30">Logged in as <span className="text-white/50">{mentor?.name || user?.email}</span></div>
                    <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-red-900/20 hover:border-red-500/30 hover:text-red-400 transition-all">
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </div>

                {/* Global Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <button
                        onClick={() => toggleRoundLock('is_round1_locked', !eventState?.is_round1_locked)}
                        className={`p-6 border rounded-2xl transition-all ${eventState?.is_round1_locked ? 'bg-red-900/20 border-red-500/50 text-red-400' : 'bg-green-900/20 border-green-500/50 text-green-400'}`}
                    >
                        <div className="text-xs uppercase font-black tracking-widest mb-1">Round 1 Access</div>
                        <div className="text-xl font-bold">{eventState?.is_round1_locked ? 'HALTED' : 'ACTIVE'}</div>
                    </button>

                    <button
                        onClick={() => toggleRoundLock('is_round2_unlocked', !eventState?.is_round2_unlocked)}
                        className={`p-6 border rounded-2xl transition-all ${eventState?.is_round2_unlocked ? 'bg-blue-900/20 border-blue-500/50 text-blue-400' : 'bg-black border-white/10 text-white/40'}`}
                    >
                        <div className="text-xs uppercase font-black tracking-widest mb-1">Round 2 Reveal</div>
                        <div className="text-xl font-bold">{eventState?.is_round2_unlocked ? 'VISIBLE' : 'HIDDEN'}</div>
                    </button>

                    <button
                        onClick={() => toggleRoundLock('is_leaderboard_frozen', !eventState?.is_leaderboard_frozen)}
                        className={`p-6 border rounded-2xl transition-all ${eventState?.is_leaderboard_frozen ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-black border-white/10 text-white/40'}`}
                    >
                        <div className="text-xs uppercase font-black tracking-widest mb-1">Scoreboard</div>
                        <div className="text-xl font-bold">{eventState?.is_leaderboard_frozen ? 'FROZEN' : 'LIVE'}</div>
                    </button>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                        <div className="text-xs uppercase font-black tracking-widest mb-1 text-white/30">Active Teams</div>
                        <div className="text-xl font-bold">{teams.length} / 30</div>
                    </div>
                </div>

                {/* Timer Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-purple-400">⏱ Round 1 Timer</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono focus:border-purple-500 outline-none"
                                    value={eventState?.r1_duration_mins ?? 60}
                                    onChange={e => setTimerField('r1_duration_mins', parseInt(e.target.value) || 60)}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={async () => {
                                        const now = new Date().toISOString();
                                        await supabase.from('dj_event_state').update({
                                            r1_start_time: now,
                                            r1_duration_mins: eventState?.r1_duration_mins ?? 60
                                        }).eq('id', 'global_config');
                                        await fetchData();
                                    }}
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    {eventState?.r1_start_time ? 'RESTART R1' : 'START R1'}
                                </button>
                            </div>
                        </div>
                        {eventState?.r1_start_time && (
                            <div className="text-[10px] text-white/30 font-mono">
                                Started: {new Date(eventState.r1_start_time).toLocaleString()}
                                <span className="ml-2">• Ends: {new Date(new Date(eventState.r1_start_time).getTime() + (eventState.r1_duration_mins ?? 60) * 60000).toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">⏱ Round 2 Timer</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono focus:border-blue-500 outline-none"
                                    value={eventState?.r2_duration_mins ?? 60}
                                    onChange={e => setTimerField('r2_duration_mins', parseInt(e.target.value) || 60)}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={async () => {
                                        const now = new Date().toISOString();
                                        await supabase.from('dj_event_state').update({
                                            r2_start_time: now,
                                            r2_duration_mins: eventState?.r2_duration_mins ?? 60
                                        }).eq('id', 'global_config');
                                        await fetchData();
                                    }}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    {eventState?.r2_start_time ? 'RESTART R2' : 'START R2'}
                                </button>
                            </div>
                        </div>
                        {eventState?.r2_start_time && (
                            <div className="text-[10px] text-white/30 font-mono">
                                Started: {new Date(eventState.r2_start_time).toLocaleString()}
                                <span className="ml-2">• Ends: {new Date(new Date(eventState.r2_start_time).getTime() + (eventState.r2_duration_mins ?? 60) * 60000).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mentor Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a href="/dj/round1" className="p-6 bg-purple-900/10 border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all group block">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs uppercase font-black tracking-widest text-purple-400/60">Preview Round 1</div>
                            <svg className="w-4 h-4 text-purple-400/40 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </div>
                        <div className="text-white font-bold">Access Override — Logic Gate Challenge</div>
                        <div className="text-xs text-white/30 mt-1">Uses Logisim Evolution</div>
                    </a>
                    <a href="/dj/round2" className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 transition-all group block">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs uppercase font-black tracking-widest text-blue-400/60">Preview Round 2</div>
                            <svg className="w-4 h-4 text-blue-400/40 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </div>
                        <div className="text-white font-bold">Signal Repair — Audio Reconstruction</div>
                        <div className="text-xs text-white/30 mt-1">Uses Audacity</div>
                    </a>
                </div>

                {/* Solution Reference */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h2 className="font-bold text-lg">🔑 Solution Reference <span className="text-xs text-white/20 font-normal ml-2">(Mentor Eyes Only)</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* Round 1 Solution — Full Question Bank */}
                        <div className="p-8 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-purple-400/60 mb-4">Round 1 — All 10 Questions</h3>
                            <p className="text-xs text-white/30 mb-4">Each team is randomly assigned 3 of these. They must solve all 3 to advance.</p>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {QUESTION_BANK.map(q => (
                                    <div key={q.id} className="p-3 bg-black/50 border border-purple-500/10 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-purple-400">Q{q.id}: {q.outputName}</span>
                                        </div>
                                        <div className="font-mono text-xs text-white/60">{q.correctExpression}</div>
                                        <div className="text-[10px] text-white/25 mt-1">{q.narrative}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Round 2 Solution */}
                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-blue-400/60 mb-4">Round 2 — Audio Repair (Heatwaves)</h3>
                                <div className="p-4 bg-black rounded-xl border border-blue-500/20">
                                    <div className="text-blue-400 font-bold text-center">In-Browser Signal Reconstruction</div>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs text-white/40">
                                <p><span className="text-white/60 font-bold">Corruption Applied (in Audacity):</span></p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Gain boosted +8dB → causes clipping</li>
                                    <li>Speed changed to 110% (1.1x)</li>
                                    <li>Bass EQ boosted +6dB</li>
                                    <li>Treble EQ reduced -4dB</li>
                                </ul>
                                <p className="mt-3"><span className="text-white/60 font-bold">How to corrupt in Audacity:</span></p>
                                <ol className="list-decimal pl-4 space-y-1">
                                    <li>Open original Heatwaves in Audacity</li>
                                    <li>Select All → Effect → Amplify → +8dB</li>
                                    <li>Effect → Change Speed → +10%</li>
                                    <li>Effect → Bass and Treble → Bass +6, Treble -4</li>
                                    <li>Export as corrupted_heatwaves.mp3</li>
                                </ol>
                                <p className="mt-3"><span className="text-white/60 font-bold">Teams must fix using the web tools:</span></p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Reduce gain (0.40x) to undo clipping</li>
                                    <li>Apply speed 0.91x to undo the +10%</li>
                                    <li>EQ: Bass -6dB, Treble +4dB</li>
                                    <li>Normalize to clean up levels</li>
                                </ul>
                            </div>
                            <div className="p-3 bg-blue-900/10 border border-blue-500/10 rounded-lg">
                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400/40 mb-2">Scoring Criteria</div>
                                <ul className="text-xs text-white/50 space-y-1">
                                    <li>• Waveform similarity to original: <span className="text-white/60">60%</span></li>
                                    <li>• Correct duration alignment: <span className="text-white/60">20%</span></li>
                                    <li>• Noise floor / artifacts: <span className="text-white/60">20%</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Management Table */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                        <h2 className="font-bold text-lg">Participant Registry</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-white/30 uppercase tracking-widest text-[10px] font-black border-b border-white/5">
                                <th className="px-6 py-4">Team Unit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">R1 Logic</th>
                                <th className="px-6 py-4">R2 Audio</th>
                                <th className="px-6 py-4 text-right">Final Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {teams.map(team => (
                                <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{team.team_name}</div>
                                        <div className="text-xs text-white/30 font-mono uppercase">{team.team_id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black tracking-tighter uppercase ${team.current_round === 1 ? 'bg-purple-500/20 text-purple-400' :
                                            team.current_round === 2 ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            Phase 0{team.current_round}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono">{team.score_round1}</span>
                                            <button
                                                onClick={() => setEditingScore({ id: team.id, round: 'round1', value: team.score_round1 })}
                                                className="text-white/20 hover:text-white"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono">{team.score_round2}</span>
                                            {submissions.find(s => s.team_uuid === team.id && s.round_number === 2) ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        title="Play Submission"
                                                        className="text-blue-400 hover:text-blue-300"
                                                        onClick={() => {
                                                            const sub = submissions.find(s => s.team_uuid === team.id && s.round_number === 2);
                                                            const { data } = supabase.storage.from('dj-submissions').getPublicUrl(sub.file_path);
                                                            window.open(data.publicUrl, '_blank');
                                                        }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const sub = submissions.find(s => s.team_uuid === team.id && s.round_number === 2);
                                                            autoJudgeTeam(team.id, sub.file_path);
                                                        }}
                                                        disabled={judgingTeamId === team.id}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${judgingTeamId === team.id ? 'animate-pulse text-yellow-400' : 'text-white/40'}`}
                                                    >
                                                        {judgingTeamId === team.id ? 'JUDGING...' : 'AUTO-SCORE'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-white/10">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        {team.total_score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Score Editor Modal (Pseudo-implementation) */}
                {editingScore && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm space-y-6">
                            <h3 className="text-xl font-bold uppercase tracking-tighter">Edit Score: {editingScore.round}</h3>
                            <input
                                type="number"
                                autoFocus
                                defaultValue={editingScore.value}
                                onChange={(e) => setEditingScore({ ...editingScore, value: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/20 px-6 py-4 rounded-xl text-3xl font-bold font-mono text-center focus:border-purple-500 outline-none"
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setEditingScore(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all uppercase text-xs tracking-widest">Cancel</button>
                                <button
                                    onClick={() => updateScore(editingScore.id, editingScore.round.replace('round', ''), editingScore.value)}
                                    className="flex-1 py-4 bg-white text-black hover:bg-purple-100 rounded-xl font-bold transition-all uppercase text-xs tracking-widest"
                                >
                                    Save Shift
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DJLayout>
    );
}
