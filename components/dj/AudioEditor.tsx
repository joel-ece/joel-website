'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AudioEditorProps {
    audioUrl: string;
    onExport: (blob: Blob) => void;
}

export default function AudioEditor({ audioUrl, onExport }: AudioEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [undoStack, setUndoStack] = useState<AudioBuffer[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const playbackRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const [playPosition, setPlayPosition] = useState(0); // in seconds
    const playStartTimeRef = useRef(0); // audioContext.currentTime when play started
    const playOffsetRef = useRef(0); // offset into buffer when play started
    const animRef = useRef<number>(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    // Tool values
    const [gainValue, setGainValue] = useState(1.0);
    const [speedValue, setSpeedValue] = useState(1.0);
    const [fadeInDuration, setFadeInDuration] = useState(0.5);
    const [fadeOutDuration, setFadeOutDuration] = useState(0.5);
    const [bassBoost, setBassBoost] = useState(0); // dB
    const [trebleBoost, setTrebleBoost] = useState(0); // dB

    // Initialize audio context and load file
    useEffect(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        fetch(audioUrl)
            .then(res => {
                if (!res.ok) throw new Error('Audio file not found. Place your corrupted audio at the expected path.');
                return res.arrayBuffer();
            })
            .then(data => ctx.decodeAudioData(data))
            .then(buffer => {
                setAudioBuffer(buffer);
                setDuration(buffer.duration);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load audio');
                setLoading(false);
            });

        return () => {
            cancelAnimationFrame(animRef.current);
            ctx.close();
        };
    }, [audioUrl]);

    // Draw waveform
    const drawWaveform = useCallback((buffer: AudioBuffer, currentPos?: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const data = buffer.getChannelData(0);
        const step = Math.ceil(data.length / width);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // Waveform
        const mid = height / 2;
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;

        for (let i = 0; i < width; i++) {
            let min = 1.0, max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[i * step + j];
                if (datum === undefined) break;
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            ctx.moveTo(i, mid + min * mid * 0.9);
            ctx.lineTo(i, mid + max * mid * 0.9);
        }
        ctx.stroke();

        // Center line
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(0, mid);
        ctx.lineTo(width, mid);
        ctx.stroke();

        // Playback position indicator
        if (currentPos !== undefined && currentPos >= 0) {
            const posX = (currentPos / buffer.duration) * width;
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(posX, 0);
            ctx.lineTo(posX, height);
            ctx.stroke();

            // Position triangle
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(posX - 5, 0);
            ctx.lineTo(posX + 5, 0);
            ctx.lineTo(posX, 8);
            ctx.fill();
        }
    }, []);

    // Redraw when buffer changes
    useEffect(() => {
        if (audioBuffer) drawWaveform(audioBuffer, isPlaying ? playPosition : playPosition);
    }, [audioBuffer, drawWaveform, isPlaying, playPosition]);

    // Animation loop for playback position
    const updatePlayPosition = useCallback(() => {
        if (!audioContextRef.current || !audioBuffer) return;
        const elapsed = audioContextRef.current.currentTime - playStartTimeRef.current;
        const pos = playOffsetRef.current + elapsed;

        if (pos >= audioBuffer.duration) {
            setIsPlaying(false);
            setPlayPosition(0);
            return;
        }

        setPlayPosition(pos);
        drawWaveform(audioBuffer, pos);
        animRef.current = requestAnimationFrame(updatePlayPosition);
    }, [audioBuffer, drawWaveform]);

    // Click on waveform to seek
    const handleCanvasClick = (e: React.MouseEvent<HTMLElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !audioBuffer) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e as React.MouseEvent).clientX - rect.left;
        const ratio = x / rect.width;
        const seekTime = ratio * audioBuffer.duration;

        if (isPlaying) {
            stopPlayback();
            setPlayPosition(seekTime);
            // Auto-resume from new position
            setTimeout(() => startPlayback(seekTime), 50);
        } else {
            setPlayPosition(seekTime);
            drawWaveform(audioBuffer, seekTime);
        }
    };

    // Playback controls
    const startPlayback = (fromOffset?: number) => {
        if (!audioBuffer || !audioContextRef.current) return;
        stopPlayback();

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 1;
        gainNodeRef.current = gainNode;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        const offset = fromOffset !== undefined ? fromOffset : playPosition;
        playOffsetRef.current = offset;
        playStartTimeRef.current = ctx.currentTime;

        source.start(0, offset);
        playbackRef.current = source;
        setIsPlaying(true);

        source.onended = () => {
            setIsPlaying(false);
            cancelAnimationFrame(animRef.current);
        };

        animRef.current = requestAnimationFrame(updatePlayPosition);
    };

    const stopPlayback = () => {
        cancelAnimationFrame(animRef.current);
        if (playbackRef.current) {
            try { playbackRef.current.stop(); } catch (e) { /* already stopped */ }
            playbackRef.current = null;
        }
        setIsPlaying(false);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            // Pause: remember position
            const elapsed = audioContextRef.current!.currentTime - playStartTimeRef.current;
            const pos = playOffsetRef.current + elapsed;
            stopPlayback();
            setPlayPosition(pos);
        } else {
            startPlayback();
        }
    };

    // Save state for undo
    const pushUndo = () => {
        if (audioBuffer) setUndoStack(prev => [...prev.slice(-8), audioBuffer]);
    };

    // Clone buffer
    const cloneBuffer = (buf: AudioBuffer): AudioBuffer => {
        const ctx = audioContextRef.current!;
        const newBuf = ctx.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
        for (let ch = 0; ch < buf.numberOfChannels; ch++) {
            newBuf.getChannelData(ch).set(buf.getChannelData(ch));
        }
        return newBuf;
    };

    // ===== EFFECTS =====

    // Apply gain to entire track
    const applyGain = () => {
        if (!audioBuffer) return;
        pushUndo();
        const newBuf = cloneBuffer(audioBuffer);
        for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
            const data = newBuf.getChannelData(ch);
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.max(-1, Math.min(1, data[i] * gainValue));
            }
        }
        setAudioBuffer(newBuf);
    };

    // Normalize
    const applyNormalize = () => {
        if (!audioBuffer) return;
        pushUndo();
        const newBuf = cloneBuffer(audioBuffer);
        let maxAmp = 0;
        for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
            const data = newBuf.getChannelData(ch);
            for (let i = 0; i < data.length; i++) {
                if (Math.abs(data[i]) > maxAmp) maxAmp = Math.abs(data[i]);
            }
        }
        if (maxAmp > 0) {
            const scale = 0.95 / maxAmp;
            for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
                const data = newBuf.getChannelData(ch);
                for (let i = 0; i < data.length; i++) data[i] *= scale;
            }
        }
        setAudioBuffer(newBuf);
    };

    // Change speed (resample)
    const applySpeed = () => {
        if (!audioBuffer || !audioContextRef.current) return;
        pushUndo();
        const ctx = audioContextRef.current;
        const newLength = Math.floor(audioBuffer.length / speedValue);
        const newBuf = ctx.createBuffer(audioBuffer.numberOfChannels, newLength, audioBuffer.sampleRate);
        for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
            const oldData = audioBuffer.getChannelData(ch);
            const newData = newBuf.getChannelData(ch);
            for (let i = 0; i < newLength; i++) {
                const srcIdx = i * speedValue;
                const idx = Math.floor(srcIdx);
                const frac = srcIdx - idx;
                const a = oldData[idx] || 0;
                const b = oldData[idx + 1] || 0;
                newData[i] = a + (b - a) * frac;
            }
        }
        setAudioBuffer(newBuf);
        setDuration(newBuf.duration);
        setPlayPosition(0);
    };

    // Fade In
    const applyFadeIn = () => {
        if (!audioBuffer) return;
        pushUndo();
        const newBuf = cloneBuffer(audioBuffer);
        const fadeSamples = Math.floor(fadeInDuration * audioBuffer.sampleRate);
        for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
            const data = newBuf.getChannelData(ch);
            for (let i = 0; i < fadeSamples && i < data.length; i++) {
                data[i] *= i / fadeSamples;
            }
        }
        setAudioBuffer(newBuf);
    };

    // Fade Out
    const applyFadeOut = () => {
        if (!audioBuffer) return;
        pushUndo();
        const newBuf = cloneBuffer(audioBuffer);
        const fadeSamples = Math.floor(fadeOutDuration * audioBuffer.sampleRate);
        const startSample = newBuf.length - fadeSamples;
        for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
            const data = newBuf.getChannelData(ch);
            for (let i = Math.max(0, startSample); i < data.length; i++) {
                data[i] *= (data.length - i) / fadeSamples;
            }
        }
        setAudioBuffer(newBuf);
    };

    // Simple Bass Boost / Treble Boost using sample-level filtering
    const applyEQ = () => {
        if (!audioBuffer) return;
        pushUndo();
        const newBuf = cloneBuffer(audioBuffer);
        const bassGain = Math.pow(10, bassBoost / 20);
        const trebleGain = Math.pow(10, trebleBoost / 20);

        for (let ch = 0; ch < newBuf.numberOfChannels; ch++) {
            const data = newBuf.getChannelData(ch);
            // Simple low-pass / high-pass decomposition
            const lowPass = new Float32Array(data.length);
            const alpha = 0.05; // smoothing factor

            // Extract low frequencies (bass)
            lowPass[0] = data[0];
            for (let i = 1; i < data.length; i++) {
                lowPass[i] = lowPass[i - 1] + alpha * (data[i] - lowPass[i - 1]);
            }

            // Reconstruct with adjusted gains
            for (let i = 0; i < data.length; i++) {
                const bass = lowPass[i];
                const treble = data[i] - bass;
                data[i] = Math.max(-1, Math.min(1, bass * bassGain + treble * trebleGain));
            }
        }
        setAudioBuffer(newBuf);
    };

    // Undo
    const undo = () => {
        if (undoStack.length === 0) return;
        const prev = undoStack[undoStack.length - 1];
        setUndoStack(undoStack.slice(0, -1));
        setAudioBuffer(prev);
        setDuration(prev.duration);
        setPlayPosition(0);
    };

    // Export as WAV
    const exportAndSubmit = () => {
        if (!audioBuffer) return;
        setExporting(true);

        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length;
        const bytesPerSample = 2;
        const blockAlign = numChannels * bytesPerSample;
        const dataSize = length * blockAlign;
        const bufferSize = 44 + dataSize;
        const ab = new ArrayBuffer(bufferSize);
        const view = new DataView(ab);

        const writeStr = (offset: number, str: string) => {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };

        writeStr(0, 'RIFF');
        view.setUint32(4, bufferSize - 8, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
                view.setInt16(offset, sample * 0x7FFF, true);
                offset += 2;
            }
        }

        const blob = new Blob([ab], { type: 'audio/wav' });
        setExporting(false);
        onExport(blob);
    };

    const formatTime = (t: number) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <div className="p-12 text-center text-white/30 font-mono text-sm animate-pulse">LOADING AUDIO SIGNAL...</div>;
    }

    if (error) {
        return (
            <div className="p-8 border border-red-500/20 bg-red-900/10 rounded-2xl text-center space-y-2">
                <div className="text-red-400 font-bold text-sm">{error}</div>
                <div className="text-white/30 text-xs">Place your corrupted audio file at: <code className="text-white/50">public/assets/dj/corrupted_heatwaves.mp3</code></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Waveform Display */}
            <div className="relative bg-black rounded-2xl border border-white/10 overflow-hidden cursor-pointer" onClick={handleCanvasClick}>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={160}
                    className="w-full h-40"
                />
                {/* Time display */}
                <div className="absolute bottom-2 left-3 text-[10px] text-white/30 font-mono bg-black/50 px-2 py-0.5 rounded">
                    {formatTime(playPosition)} / {formatTime(duration)}
                </div>
                <div className="absolute top-2 right-3 text-[10px] text-white/20 font-mono">
                    Click anywhere to seek
                </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    onClick={togglePlayPause}
                    className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isPlaying
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        }`}
                >
                    {isPlaying ? '❚❚ Pause' : '▶ Play'}
                </button>

                <button
                    onClick={() => { stopPlayback(); setPlayPosition(0); if (audioBuffer) drawWaveform(audioBuffer, 0); }}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                    ■ Stop
                </button>

                <button
                    onClick={undo}
                    disabled={undoStack.length === 0}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 transition-colors ml-auto"
                >
                    ↩ Undo ({undoStack.length})
                </button>
            </div>

            {/* Tool Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gain */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400/60">🔊 Gain / Volume</div>
                    <p className="text-[10px] text-white/25">Multiply the amplitude of the entire track.</p>
                    <div className="flex items-center gap-3">
                        <input type="range" min="0.1" max="3" step="0.05" value={gainValue} onChange={e => setGainValue(parseFloat(e.target.value))} className="flex-1 accent-purple-500 h-1.5" />
                        <span className="text-xs font-mono text-white/50 w-12 text-right">{gainValue.toFixed(2)}x</span>
                    </div>
                    <button onClick={applyGain} className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-purple-400 text-xs font-bold uppercase tracking-widest hover:bg-purple-900/50 transition-all">
                        Apply Gain
                    </button>
                </div>

                {/* Normalize */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-yellow-400/60">📊 Normalize</div>
                    <p className="text-[10px] text-white/25">Scale audio so the loudest peak reaches 95% amplitude.</p>
                    <div className="h-7" />
                    <button onClick={applyNormalize} className="w-full px-4 py-2 bg-yellow-900/30 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold uppercase tracking-widest hover:bg-yellow-900/50 transition-all">
                        Normalize
                    </button>
                </div>

                {/* Speed */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-green-400/60">⚡ Speed Adjust</div>
                    <p className="text-[10px] text-white/25">Change playback speed (also affects pitch).</p>
                    <div className="flex items-center gap-3">
                        <input type="range" min="0.5" max="2" step="0.01" value={speedValue} onChange={e => setSpeedValue(parseFloat(e.target.value))} className="flex-1 accent-green-500 h-1.5" />
                        <span className="text-xs font-mono text-white/50 w-12 text-right">{speedValue.toFixed(2)}x</span>
                    </div>
                    <button onClick={applySpeed} className="w-full px-4 py-2 bg-green-900/30 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold uppercase tracking-widest hover:bg-green-900/50 transition-all">
                        Apply Speed
                    </button>
                </div>

                {/* EQ - Bass/Treble */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">🎛️ Equalizer</div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 w-10">Bass</span>
                            <input type="range" min="-12" max="12" step="1" value={bassBoost} onChange={e => setBassBoost(parseInt(e.target.value))} className="flex-1 accent-blue-500 h-1.5" />
                            <span className="text-[10px] font-mono text-white/40 w-10 text-right">{bassBoost > 0 ? '+' : ''}{bassBoost}dB</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 w-10">Treble</span>
                            <input type="range" min="-12" max="12" step="1" value={trebleBoost} onChange={e => setTrebleBoost(parseInt(e.target.value))} className="flex-1 accent-blue-500 h-1.5" />
                            <span className="text-[10px] font-mono text-white/40 w-10 text-right">{trebleBoost > 0 ? '+' : ''}{trebleBoost}dB</span>
                        </div>
                    </div>
                    <button onClick={applyEQ} className="w-full px-4 py-2 bg-blue-900/30 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold uppercase tracking-widest hover:bg-blue-900/50 transition-all">
                        Apply EQ
                    </button>
                </div>

                {/* Fade In */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">📈 Fade In</div>
                    <p className="text-[10px] text-white/25">Gradually increase volume from silence at the start.</p>
                    <div className="flex items-center gap-3">
                        <input type="range" min="0.1" max="5" step="0.1" value={fadeInDuration} onChange={e => setFadeInDuration(parseFloat(e.target.value))} className="flex-1 accent-cyan-500 h-1.5" />
                        <span className="text-xs font-mono text-white/50 w-10 text-right">{fadeInDuration.toFixed(1)}s</span>
                    </div>
                    <button onClick={applyFadeIn} className="w-full px-4 py-2 bg-cyan-900/30 border border-cyan-500/20 rounded-lg text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-cyan-900/50 transition-all">
                        Apply Fade In
                    </button>
                </div>

                {/* Fade Out */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-orange-400/60">📉 Fade Out</div>
                    <p className="text-[10px] text-white/25">Gradually decrease volume to silence at the end.</p>
                    <div className="flex items-center gap-3">
                        <input type="range" min="0.1" max="5" step="0.1" value={fadeOutDuration} onChange={e => setFadeOutDuration(parseFloat(e.target.value))} className="flex-1 accent-orange-500 h-1.5" />
                        <span className="text-xs font-mono text-white/50 w-10 text-right">{fadeOutDuration.toFixed(1)}s</span>
                    </div>
                    <button onClick={applyFadeOut} className="w-full px-4 py-2 bg-orange-900/30 border border-orange-500/20 rounded-lg text-orange-400 text-xs font-bold uppercase tracking-widest hover:bg-orange-900/50 transition-all">
                        Apply Fade Out
                    </button>
                </div>
            </div>

            {/* Export / Submit */}
            <div className="p-6 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Finalize & Submit</div>
                        <p className="text-[10px] text-white/25">Export your processed audio as WAV and submit for evaluation.</p>
                    </div>
                    <button
                        onClick={exportAndSubmit}
                        disabled={exporting}
                        className="px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        {exporting ? 'ENCODING...' : '📤 Export & Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
