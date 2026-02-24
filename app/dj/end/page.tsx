'use client';

import React from 'react';
import DJLayout from '@/components/dj/DJLayout';
import Link from 'next/link';

export default function EndPage() {
    return (
        <DJLayout title="Session Terminated">
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Mission Complete</h1>
                    <p className="text-white/40 max-w-md mx-auto leading-relaxed">
                        All signal reconstruction protocols have been finalized.
                        Your data has been transmitted to the Central Frequency Authority for final evaluation.
                    </p>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 w-full max-w-lg">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">System Status</div>
                        <div className="text-sm font-mono text-green-400">SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                        <div className="text-sm font-mono text-green-400">PAYLOAD: TRANSMITTED</div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/dj/leaderboard"
                            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all uppercase text-xs tracking-widest text-center"
                        >
                            View Live Leaderboard
                        </Link>
                        <Link
                            href="/dj/login"
                            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest text-center"
                        >
                            Back to Start
                        </Link>
                    </div>
                </div>

                <p className="text-[10px] text-white/10 uppercase tracking-[0.5em] pt-12">
                    Joy of Engineering Lab • Signal Division 2026
                </p>
            </div>
        </DJLayout>
    );
}
