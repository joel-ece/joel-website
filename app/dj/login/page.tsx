'use client';

import React, { useState } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { useRouter } from 'next/navigation';
import { loginDJTeam, getEventState, isTimerActive } from '@/lib/dj-auth';

export default function DJLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const team_id = formData.get('team_id') as string;
        const password = formData.get('password') as string;

        const { team, error: loginError } = await loginDJTeam(team_id, password);

        if (loginError) {
            setError(loginError);
            setLoading(false);
            return;
        }

        if (team) {
            const state = await getEventState();
            if (!state) {
                setError('System error. Contact admin.');
                setLoading(false);
                return;
            }

            const rd = team.current_round || 1;
            const startTime = rd === 1 ? state.r1_start_time : state.r2_start_time;
            const duration = rd === 1 ? state.r1_duration_mins : state.r2_duration_mins;

            if (!isTimerActive(startTime, duration)) {
                setError(`Phase 0${rd} timer is inactive. Contact an admin.`);
                setLoading(false);
                return;
            }

            router.push(rd === 1 ? '/dj/round1' : '/dj/round2');
        }
    };

    return (
        <DJLayout title="Session Recall">
            <div className="max-w-md mx-auto py-24">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Recall Session</h1>
                    <p className="text-white/40 text-sm">Resume your active system recovery protocol.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Team ID</label>
                            <input name="team_id" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors font-mono" placeholder="DJ-XXXX" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Password</label>
                            <input name="password" type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors" />
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-100 transition-all disabled:opacity-50"
                    >
                        {loading ? 'RECALLING...' : 'RESUME PROTOCOL'}
                    </button>
                </form>
            </div>
        </DJLayout>
    );
}
