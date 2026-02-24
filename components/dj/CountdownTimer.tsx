'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetDate: string;
    onExpiry?: () => void;
}

export default function CountdownTimer({ targetDate, onExpiry }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ m: string, s: string }>({ m: '00', s: '00' });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ m: '00', s: '00' });
                if (onExpiry) onExpiry();
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                m: minutes < 10 ? `0${minutes}` : `${minutes}`,
                s: seconds < 10 ? `0${seconds}` : `${seconds}`
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, onExpiry]);

    return (
        <div className="flex gap-2 font-mono text-3xl font-bold">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 w-16 text-center">
                <span className="text-purple-400">{timeLeft.m}</span>
            </div>
            <div className="flex items-center text-white/20">:</div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 w-16 text-center">
                <span className="text-blue-400">{timeLeft.s}</span>
            </div>
        </div>
    );
}
