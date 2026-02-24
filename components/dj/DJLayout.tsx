'use client';

import React from 'react';
import Link from 'next/link';

interface DJLayoutProps {
    children: React.ReactNode;
    title?: string;
    showNav?: boolean;
}

export default function DJLayout({ children, title = "DJ Control: System Recovery", showNav = true }: DJLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            {showNav && (
                <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dj" className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                {title.toUpperCase()}
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium text-white/60">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                SYSTEM ONLINE
                            </span>
                        </div>
                    </div>
                </header>
            )}

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>

            {/* Security Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-white/30 tracking-widest uppercase">
                    Authorization Level: 4 // Restricted Laboratory Protocol
                </div>
            </footer>
        </div>
    );
}
