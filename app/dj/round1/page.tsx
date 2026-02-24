'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { useRouter } from 'next/navigation';
import { getDJTeamByToken, DJTeam, getEventState, isTimerActive } from '@/lib/dj-auth';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import CircuitSimulator from '@/components/dj/CircuitSimulator';
import { QUESTION_BANK, validateAnswer, assignRandomQuestions, type LogicQuestion, type ValidationResult } from '@/lib/dj-questions';

export default function Round1Page() {
    const router = useRouter();
    const { mentor } = useAuth();
    const [team, setTeam] = useState<DJTeam | null>(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<LogicQuestion[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>(['', '', '']);
    const [results, setResults] = useState<(ValidationResult | null)[]>([null, null, null]);
    const [submitting, setSubmitting] = useState(false);
    const [allCorrect, setAllCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [timerInactive, setTimerInactive] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [deadline, setDeadline] = useState<number | null>(null);

    useEffect(() => {
        async function init() {
            if (mentor) {
                // Mentor preview — show first 3 questions
                const qs = [0, 1, 2].map(i => QUESTION_BANK[i]);
                setQuestions(qs);
                setLoading(false);
                return;
            }

            const currentTeam = await getDJTeamByToken();
            if (!currentTeam) { router.push('/dj/login'); return; }
            if (currentTeam.current_round > 1) { router.push('/dj/round2'); return; }

            // Check R1 timer
            const state = await getEventState();
            if (!state || !isTimerActive(state.r1_start_time, state.r1_duration_mins)) {
                setTimerInactive(true);
                setLoading(false);
                return;
            }
            // Calculate deadline
            const start = new Date(state.r1_start_time!).getTime();
            setDeadline(start + state.r1_duration_mins * 60 * 1000);

            setTeam(currentTeam);

            // Check if team already has assigned questions
            let assignedIds: number[] = (currentTeam as any).assigned_questions;
            if (!assignedIds || assignedIds.length === 0) {
                // Assign 3 random questions
                assignedIds = assignRandomQuestions();
                await supabase
                    .from('dj_teams')
                    .update({ assigned_questions: assignedIds })
                    .eq('id', currentTeam.id);
            }

            const qs = assignedIds.map(id => QUESTION_BANK[id]).filter(Boolean);
            setQuestions(qs);
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

    const handleConvertToCode = useCallback((expression: string) => {
        setAnswers(prev => {
            const copy = [...prev];
            copy[currentQ] = expression;
            return copy;
        });
    }, [currentQ]);

    const validateCurrent = () => {
        if (!questions[currentQ]) return;
        setAttempts(prev => prev + 1);
        const result = validateAnswer(questions[currentQ].id, answers[currentQ]);
        setResults(prev => {
            const copy = [...prev];
            copy[currentQ] = result;
            return copy;
        });
    };

    const submitAll = async () => {
        // Validate all
        const newResults = questions.map((q, i) => validateAnswer(q.id, answers[i]));
        setResults(newResults);

        if (newResults.every(r => r?.correct)) {
            setAllCorrect(true);
            setSubmitting(true);

            if (team) {
                // Total score = sum of per-question scores (0-100 each, max 300)
                const totalScore = newResults.reduce((sum, r) => sum + (r?.score || 0), 0);
                // Apply attempt penalty: lose 2 points per extra attempt beyond 3
                const attemptPenalty = Math.max(0, (attempts - 3) * 2);
                const finalScore = Math.max(totalScore - attemptPenalty, 150);

                await supabase
                    .from('dj_teams')
                    .update({
                        current_round: 2,
                        round1_completed_at: new Date().toISOString(),
                        score_round1: finalScore,
                    })
                    .eq('id', team.id);

                setTimeout(() => router.push('/dj/round2'), 3000);
            }
        }
    };

    if (loading) return <DJLayout><div className="flex justify-center py-20">BOOTING SYSTEM...</div></DJLayout>;

    if (timerInactive) {
        return (
            <DJLayout title="Phase 01: Access Override">
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full border-2 border-red-500/30 flex items-center justify-center">
                        <span className="text-3xl">⏱</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Timer Inactive</h2>
                    <p className="text-white/40 max-w-sm">Phase 01 has not been started yet or has already ended. Contact an admin to begin.</p>
                    <button onClick={() => router.push('/dj/login')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        ← Back to Login
                    </button>
                </div>
            </DJLayout>
        );
    }

    const q = questions[currentQ];

    return (
        <DJLayout title="Phase 01: Access Override">
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

                {/* Question Navigation */}
                <div className="flex items-center gap-4">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQ(i)}
                            className={`flex-1 p-4 border rounded-xl transition-all text-center ${currentQ === i ? 'bg-purple-900/30 border-purple-500/40 text-purple-400' :
                                results[i]?.correct ? 'bg-green-900/20 border-green-500/30 text-green-400' :
                                    results[i] && !results[i]?.correct ? 'bg-red-900/20 border-red-500/30 text-red-400' :
                                        'bg-white/[0.02] border-white/10 text-white/40'
                                }`}
                        >
                            <div className="text-[10px] font-black uppercase tracking-widest">Challenge {i + 1}</div>
                            <div className="text-xs font-mono mt-1">
                                {results[i]?.correct ? `✓ ${results[i]?.score}pts` : results[i] && !results[i]?.correct ? '✗ WRONG' : 'PENDING'}
                            </div>
                            {results[i]?.correct && (
                                <div className={`text-[9px] mt-0.5 ${results[i]?.optimal ? 'text-yellow-400' : 'text-white/20'}`}>
                                    {results[i]?.optimal ? '★ OPTIMAL' : `${results[i]?.gateCount} gates`}
                                </div>
                            )}
                        </button>
                    ))}

                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Attempts</div>
                        <div className="text-lg font-bold font-mono text-blue-400">{attempts}</div>
                    </div>
                </div>

                {q && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Problem Statement */}
                        <div className="space-y-6">
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-black uppercase tracking-tighter text-purple-400">{q.outputName}</h2>
                                    <span className="text-xs font-mono text-white/20">Q#{q.id}</span>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed mb-6">{q.narrative}</p>

                                {/* Signal Labels */}
                                <div className="space-y-2 font-mono text-sm text-white/40 mb-4">
                                    <div className="flex justify-between border-b border-white/5 pb-1"><span>INPUT: VIBE (V)</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-1"><span>INPUT: CROWD (C)</span></div>
                                    <div className="flex justify-between"><span>INPUT: SECURITY (S)</span></div>
                                </div>
                            </div>

                            {/* Target Truth Table */}
                            <div className="p-6 bg-black border border-purple-500/20 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-4">Target Truth Table</h3>
                                <table className="w-full text-center font-mono text-sm">
                                    <thead>
                                        <tr className="text-white/40 border-b border-white/10">
                                            <th className="pb-2">V</th><th className="pb-2">C</th><th className="pb-2">S</th>
                                            <th className="pb-2 text-purple-400">{q.outputName}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {q.truthTable.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 last:border-0">
                                                <td className="py-1.5">{row[0]}</td>
                                                <td className="py-1.5">{row[1]}</td>
                                                <td className="py-1.5">{row[2]}</td>
                                                <td className={`py-1.5 font-bold ${row[3] ? 'text-green-400' : 'text-red-400'}`}>{row[3]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Required Software */}
                            <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                                <a href="https://github.com/logisim-evolution/logisim-evolution/releases" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-xs font-bold text-white/60 group-hover:text-purple-300 transition-colors">Logisim Evolution (Optional Reference)</div>
                                        <div className="text-[10px] text-white/30 mt-0.5">Use the circuit builder below, or verify in Logisim offline</div>
                                    </div>
                                    <svg className="w-4 h-4 text-white/20 group-hover:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Right: Circuit Builder + Answer */}
                        <div className="space-y-6">
                            {/* Circuit Simulator */}
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-4">Interactive Circuit Builder</h3>
                                <CircuitSimulator onConvertToCode={handleConvertToCode} />
                            </div>

                            {/* Answer Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Logic Expression</h3>
                                </div>
                                <div className="relative group">
                                    <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 transition duration-500 ${results[currentQ]?.correct ? 'opacity-100' : 'group-hover:opacity-40'}`}></div>
                                    <textarea
                                        value={answers[currentQ]}
                                        onChange={e => {
                                            const copy = [...answers];
                                            copy[currentQ] = e.target.value;
                                            setAnswers(copy);
                                        }}
                                        readOnly={results[currentQ]?.correct || !!mentor}
                                        placeholder="Build your circuit above, then click 'Convert to Code', or type directly: e.g. (V AND C)"
                                        className="relative w-full h-20 bg-black border border-white/10 rounded-xl px-6 py-4 font-mono text-sm focus:border-purple-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                {results[currentQ] && !results[currentQ]?.correct && (
                                    <div className="p-3 bg-red-900/10 border border-red-500/20 text-red-400 text-xs font-mono text-center animate-pulse">
                                        LOGIC OUTPUT DOES NOT MATCH TARGET TRUTH TABLE. TRY AGAIN.
                                    </div>
                                )}
                                {results[currentQ]?.correct && (
                                    <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-xl text-center space-y-1">
                                        <div className="text-green-400 text-xs font-bold uppercase tracking-widest">✓ CORRECT — GATE VERIFIED</div>
                                        <div className="flex items-center justify-center gap-4 text-[10px] font-mono">
                                            <span className="text-white/40">Score: <span className="text-green-400 font-bold">{results[currentQ]?.score}/100</span></span>
                                            <span className="text-white/40">Gates: <span className="text-white/60">{results[currentQ]?.gateCount}</span></span>
                                            {results[currentQ]?.optimal && <span className="text-yellow-400">★ OPTIMAL</span>}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={validateCurrent}
                                        disabled={!answers[currentQ] || results[currentQ]?.correct || !!mentor}
                                        className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30 uppercase text-xs tracking-widest"
                                    >
                                        Verify This Gate
                                    </button>
                                    {results.every(r => r?.correct) && !allCorrect && (
                                        <button
                                            onClick={submitAll}
                                            disabled={!!mentor}
                                            className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all disabled:opacity-30 uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                        >
                                            COMPLETE PHASE 01 →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {allCorrect && (
                                <div className="p-6 bg-green-900/10 border border-green-500/20 rounded-xl text-center space-y-2">
                                    <div className="text-green-400 font-black uppercase tracking-widest">ALL GATES VERIFIED — ACCESS GRANTED</div>
                                    <div className="text-green-400/50 text-xs font-mono uppercase tracking-widest">Generating Phase 02 Auth Key...</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DJLayout>
    );
}
