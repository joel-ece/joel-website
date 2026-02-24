'use client';

import React from 'react';
import DJLayout from '@/components/dj/DJLayout';
import Link from 'next/link';
import { DJ_TEAM_TOKEN_KEY } from '@/lib/dj-auth';

export default function DJLanding() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem(DJ_TEAM_TOKEN_KEY));
    }, []);

    return (
        <DJLayout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative px-8 py-4 bg-black rounded-full border border-white/10 leading-none flex items-center divide-x divide-gray-600">
                        <span className="pr-6 text-purple-400 text-sm font-medium tracking-widest uppercase">Emergency Protocol</span>
                        <span className="pl-6 text-blue-400 text-sm font-medium tracking-widest uppercase">Lab Access Level 4</span>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                    DJ CONTROL:<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-blue-400 animate-gradient-x">
                        SYSTEM RECOVERY
                    </span>
                </h1>

                <p className="max-w-2xl text-white/50 text-lg leading-relaxed">
                    The main signal has been corrupted. The DJ booth is in lockdown.
                    Your task: Override security, repair the signal, and demonstrate total system resonance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {isLoggedIn ? (
                        <Link
                            href="/dj/round1"
                            className="px-10 py-4 bg-white text-black font-bold rounded-lg hover:bg-purple-100 transition-colors tracking-tight"
                        >
                            RESUME MISSION
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/dj/register"
                                className="px-10 py-4 bg-white text-black font-bold rounded-lg hover:bg-purple-100 transition-colors tracking-tight"
                            >
                                FORM TEAM
                            </Link>
                            <Link
                                href="/dj/login"
                                className="px-10 py-4 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-white/40 transition-colors tracking-tight"
                            >
                                RECALL SESSION
                            </Link>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full max-w-5xl">
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
                        <div className="text-purple-400 font-bold mb-2 uppercase text-xs tracking-widest">Phase 01</div>
                        <h3 className="text-xl font-bold mb-2">Access Override</h3>
                        <p className="text-sm text-white/40">Solve the logic matrix to bypass the VIBE security core.</p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl opacity-50">
                        <div className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-widest">Phase 02</div>
                        <h3 className="text-xl font-bold mb-2">Signal Repair</h3>
                        <p className="text-sm text-white/40">Reconstruct the corrupted audio spectrum from fragments.</p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl opacity-50">
                        <div className="text-pink-400 font-bold mb-2 uppercase text-xs tracking-widest">Final Phase</div>
                        <h3 className="text-xl font-bold mb-2">Demonstration</h3>
                        <p className="text-sm text-white/40">Live playback and synchronicity test in the lab environment.</p>
                    </div>
                </div>
            </div>
        </DJLayout>
    );
}
