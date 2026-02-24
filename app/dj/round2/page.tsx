'use client';

import React, { useEffect, useState } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { useRouter } from 'next/navigation';
import { getDJTeamByToken, DJTeam, getEventState, isTimerActive } from '@/lib/dj-auth';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import AudioEditor from '@/components/dj/AudioEditor';

// Path to the corrupted audio file — place your file here:
const CORRUPTED_AUDIO_PATH = '/assets/dj/corrupted_heatwaves.mp3';

export default function Round2Page() {
    const router = useRouter();
    const { mentor } = useAuth();
    const [team, setTeam] = useState<DJTeam | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timerInactive, setTimerInactive] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [deadline, setDeadline] = useState<number | null>(null);

    useEffect(() => {
        async function init() {
            if (mentor) {
                setLoading(false);
                return;
            }
            const currentTeam = await getDJTeamByToken();
            if (!currentTeam) { router.push('/dj/login'); return; }
            if (currentTeam.current_round < 2) { router.push('/dj/round1'); return; }

            // Check R2 timer
            const state = await getEventState();
            if (!state || !isTimerActive(state.r2_start_time, state.r2_duration_mins)) {
                setTimerInactive(true);
                setLoading(false);
                return;
            }
            // Calculate deadline
            const start = new Date(state.r2_start_time!).getTime();
            setDeadline(start + state.r2_duration_mins * 60 * 1000);

            setTeam(currentTeam);

            // Check for existing submission
            const { data } = await supabase
                .from('dj_submissions')
                .select('id')
                .eq('team_uuid', currentTeam.id)
                .eq('round_number', 2)
                .limit(1);

            if (data && data.length > 0) setSubmitted(true);
            setLoading(false);
        }
        init();
    }, [router, mentor]);

    // Countdown timer
    useEffect(() => {
        if (!deadline) return;
        const interval = setInterval(() => {
            const remaining = deadline - Date.now();
            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    const formatCountdown = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleExport = async (blob: Blob) => {
        if (!team || mentor) return;
        setUploading(true);
        setError(null);

        try {
            const fileName = `${team.team_id}_R2_${Date.now()}.wav`;
            const filePath = `round2/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('dj-submissions')
                .upload(filePath, blob, { contentType: 'audio/wav' });

            if (uploadError) throw uploadError;

            // Record submission in database
            const { error: subError } = await supabase
                .from('dj_submissions')
                .insert({
                    team_uuid: team.id,
                    round_number: 2,
                    file_path: filePath,
                    submission_content: { size: blob.size, type: 'audio/wav' },
                });

            if (subError) throw subError;
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'UPLOAD FAILED. RETRY.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <DJLayout><div className="flex justify-center py-20">SYNCING SIGNAL DATA...</div></DJLayout>;

    if (timerInactive) {
        return (
            <DJLayout title="Phase 02: Signal Reconstruction">
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full border-2 border-red-500/30 flex items-center justify-center">
                        <span className="text-3xl">⏱</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Timer Inactive</h2>
                    <p className="text-white/40 max-w-sm">Phase 02 has not been started yet or has already ended. Contact an admin to begin.</p>
                    <button onClick={() => router.push('/dj/login')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        ← Back to Login
                    </button>
                </div>
            </DJLayout>
        );
    }

    return (
        <DJLayout title="Phase 02: Signal Repair">
            <div className="space-y-8 py-8">
                {/* Countdown Timer */}
                {timeLeft !== null && !mentor && (
                    <div className={`p-4 rounded-xl text-center font-mono text-sm border ${timeLeft <= 60000 ? 'bg-red-900/20 border-red-500/30 text-red-400 animate-pulse' :
                            timeLeft <= 300000 ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' :
                                'bg-white/[0.02] border-white/10 text-white/50'
                        }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest mr-3">Time Remaining:</span>
                        <span className="text-lg font-bold">{timeLeft <= 0 ? 'TIME UP' : formatCountdown(timeLeft)}</span>
                    </div>
                )}
                {/* Mentor Banner */}
                {mentor && (
                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl text-yellow-400 text-xs font-bold uppercase tracking-widest text-center">
                        ⚡ Mentor Preview Mode — Submissions Disabled
                    </div>
                )}

                {/* Mission Briefing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-blue-400">Signal Reconstruction</h2>
                        <p className="text-white/60 leading-relaxed mb-4">
                            The primary audio feed has been corrupted by a rogue signal processor. Using the repair toolkit below,
                            restore the <span className="text-white font-bold">SOURCE SIGNAL</span> to its original form.
                            The corrupted audio is pre-loaded in the editor — your job is to reverse the damage.
                        </p>
                        <div className="space-y-2 text-sm text-white/40">
                            <div className="flex items-start gap-2">
                                <span className="text-blue-400">▸</span>
                                <span>The original track is <span className="text-white font-bold">&quot;Heat Waves&quot; by Glass Animals</span>. You may listen to the original on YouTube for reference.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-400">▸</span>
                                <span>Use the editing tools provided below to fix the corrupted signal. <span className="text-white/60 font-bold">You must not leave this page.</span></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-400">▸</span>
                                <span>When you&apos;re satisfied with your repair, click <span className="text-white font-bold">&quot;Export &amp; Submit&quot;</span>.</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Important Notes */}
                        <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400/60">⚠ Important Notes</h3>
                            <ul className="space-y-3 text-xs text-white/50">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">🎧</span>
                                    <span><span className="text-white/70 font-bold">Use your own headphones.</span> Audio evaluation requires precise listening.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">▶</span>
                                    <span>Refer to the <a href="https://youtu.be/mRD0-GxqHVo?si=1llauS05q-Tc9lB2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">original song on YouTube</a> to compare.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">📤</span>
                                    <span>Only your <span className="text-white/70 font-bold">latest submission</span> will be evaluated.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Submission Status */}
                        {submitted && (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-xl">
                                    <div className="text-xs font-black uppercase tracking-widest text-green-400 mb-1">✓ Submission Received</div>
                                    <p className="text-[10px] text-white/30">You may re-submit to update your entry.</p>
                                </div>
                                <button
                                    onClick={() => router.push('/dj/end')}
                                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                >
                                    Exit & Finalize Event →
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono">
                                {error}
                            </div>
                        )}

                        {uploading && (
                            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                                TRANSMITTING SIGNAL DATA...
                            </div>
                        )}
                    </div>
                </div>

                {/* Audio Editor */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Signal Repair Workstation</h3>
                        <div className="text-[10px] font-mono text-white/20">TOOLKIT v2.0</div>
                    </div>
                    <AudioEditor
                        audioUrl={CORRUPTED_AUDIO_PATH}
                        onExport={handleExport}
                    />
                </div>

                {/* Status Bar */}
                <div className="pt-4 border-t border-white/5 space-y-4 opacity-50">
                    <div className="flex items-center justify-between text-xs text-white/30 font-bold uppercase tracking-widest">
                        <span>Bandwidth Status</span>
                        <span className="text-blue-500">Optimized</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%] animate-pulse" />
                    </div>
                </div>
            </div>
        </DJLayout>
    );
}
