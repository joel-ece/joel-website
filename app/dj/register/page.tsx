'use client';

import React, { useState } from 'react';
import DJLayout from '@/components/dj/DJLayout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { DJ_TEAM_TOKEN_KEY } from '@/lib/dj-auth';

export default function DJRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const team_name = formData.get('team_name') as string;
        const member1 = formData.get('member1') as string;
        const member2 = formData.get('member2') as string;
        const email = formData.get('email') as string;
        const team_id = formData.get('team_id') as string;
        const password = formData.get('password') as string;

        try {
            const { data, error: insertError } = await supabase
                .from('dj_teams')
                .insert({
                    team_id,
                    password,
                    team_name,
                    member1_name: member1,
                    member2_name: member2,
                    contact_email: email,
                    current_round: 1
                })
                .select()
                .single();

            if (insertError) {
                if (insertError.code === '23505') {
                    setError('Team ID already taken. Choose another.');
                } else {
                    setError(insertError.message);
                }
                return;
            }

            localStorage.setItem(DJ_TEAM_TOKEN_KEY, data.team_id);
            router.push('/dj/round1');
        } catch (err: any) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DJLayout title="Team Registration">
            <div className="max-w-md mx-auto py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Form Team</h1>
                    <p className="text-white/40 text-sm">Initialize your unit for system recovery.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Team Name</label>
                            <input name="team_name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors" placeholder="e.g. CORE_LEAK" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Member 1</label>
                                <input name="member1" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Member 2</label>
                                <input name="member2" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Contact Email</label>
                            <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors" />
                        </div>

                        <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Unique Team ID</label>
                                <input name="team_id" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors font-mono" placeholder="DJ-XXXX" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Security Password</label>
                                <input name="password" type="password" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 outline-none transition-colors" />
                            </div>
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'INITIALIZING...' : 'START MISSION'}
                    </button>
                </form>
            </div>
        </DJLayout>
    );
}
