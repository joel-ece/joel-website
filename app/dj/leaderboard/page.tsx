'use client';

import React, { useEffect, useState } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { supabase } from '@/lib/supabase';
import { DJTeam, getEventState, DJEventState } from '@/lib/dj-auth';

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<DJTeam[]>([]);
    const [eventState, setEventState] = useState<DJEventState | null>(null);
    const [loading, setLoading] = useState(true);
    const [projectionMode, setProjectionMode] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const { data: teamData } = await supabase
                .from('dj_teams')
                .select('*')
                .order('total_score', { ascending: false });

            const state = await getEventState();

            setTeams(teamData || []);
            setEventState(state);
            setLoading(false);
        }
        fetchData();

        // Live updates for leaderboard
        const sub = supabase.channel('leaderboard_live')
            .on('postgres_changes', { event: '*', table: 'dj_teams', schema: 'public' }, () => fetchData())
            .on('postgres_changes', { event: '*', table: 'dj_event_state', schema: 'public' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(sub); };
    }, []);

    if (loading) return <DJLayout><div className="flex justify-center py-20">CALCULATING RESONANCE...</div></DJLayout>;

    // If frozen and not in projection mode, show 'Standby' for participants
    if (eventState?.is_leaderboard_frozen && !projectionMode) {
        return (
            <DJLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Scoreboard Frozen</h2>
                    <p className="text-white/40 max-w-sm">The judges are calculating the final signal alignment. Standby for demonstration.</p>
                </div>
            </DJLayout>
        );
    }

    if (projectionMode) {
        return (
            <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center select-none overflow-hidden">
                <div className="fixed inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%),_repeating-linear-gradient(0deg,_transparent_0px,_transparent_1px,_rgba(255,255,255,0.03)_1px,_rgba(255,255,255,0.03)_2px)] bg-[size:100%_100%,100%_4px]" />
                </div>

                <div className="relative z-10 w-full max-w-6xl space-y-12">
                    <div className="flex justify-between items-end border-b-2 border-white/10 pb-8">
                        <div>
                            <div className="text-purple-400 font-black uppercase tracking-[0.5em] text-sm mb-2">Resonance Overview</div>
                            <h1 className="text-7xl font-black tracking-tighter uppercase italic">Global Standings</h1>
                        </div>
                        <button onClick={() => setProjectionMode(false)} className="text-white/10 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest mb-2">Exit Projection</button>
                    </div>

                    <div className="space-y-4">
                        {teams.slice(0, 10).map((team, index) => (
                            <div key={team.id} className={`group relative flex items-center gap-8 p-6 rounded-2xl border transition-all duration-500 ${index === 0 ? 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'bg-white/[0.02] border-white/10'}`}>
                                <div className={`text-5xl font-black italic w-20 ${index === 0 ? 'text-black' : 'text-white/20'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-4xl font-black uppercase tracking-tighter ${index === 0 ? 'text-black' : 'text-white'}`}>
                                        {team.team_name}
                                    </div>
                                    <div className={`text-sm font-mono uppercase tracking-widest ${index === 0 ? 'text-black/40' : 'text-white/30'}`}>
                                        Unit ID: {team.team_id}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-6xl font-black tracking-tighter italic ${index === 0 ? 'text-black' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'}`}>
                                        {team.total_score}
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${index === 0 ? 'text-black/30' : 'text-white/20'}`}>
                                        Cumulative Resonance
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DJLayout title="Leaderboard: System Resonance">
            <div className="max-w-4xl mx-auto py-8 space-y-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Standings</h1>
                        <p className="text-white/40 text-sm">Real-time signal alignment metrics across all units.</p>
                    </div>
                    <button
                        onClick={() => setProjectionMode(true)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        Enter Projection Mode
                    </button>
                </div>

                <div className="space-y-3">
                    {teams.map((team, index) => (
                        <div key={team.id} className="group flex items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:border-white/20">
                            <div className="w-10 text-xl font-black text-white/10 italic">{index + 1}</div>
                            <div className="flex-1">
                                <div className="font-bold text-lg">{team.team_name}</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{team.team_id}</div>
                            </div>
                            <div className="flex gap-4 text-center">
                                <div className="w-16">
                                    <div className="text-[9px] text-white/20 uppercase font-bold mb-1">Phase 1</div>
                                    <div className="text-xs font-mono">{team.score_round1}</div>
                                </div>
                                <div className="w-16">
                                    <div className="text-[9px] text-white/20 uppercase font-bold mb-1">Phase 2</div>
                                    <div className="text-xs font-mono">{team.score_round2}</div>
                                </div>
                            </div>
                            <div className="w-24 text-right">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{team.total_score}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DJLayout>
    );
}
