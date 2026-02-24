'use client';

import React, { useState, useCallback, useMemo } from 'react';

// Gate types
type GateType = 'AND' | 'OR' | 'NOT';

interface Gate {
    id: string;
    type: GateType;
    inputA: string; // 'V', 'C', 'S', or gate id like 'G1'
    inputB: string; // only for AND/OR
}

interface CircuitSimulatorProps {
    onConvertToCode: (expression: string) => void;
}

const INPUTS = ['V', 'C', 'S'];

export default function CircuitSimulator({ onConvertToCode }: CircuitSimulatorProps) {
    const [gates, setGates] = useState<Gate[]>([]);
    const [outputGate, setOutputGate] = useState<string>('');

    const addGate = (type: GateType) => {
        const id = `G${gates.length + 1}`;
        const newGate: Gate = {
            id,
            type,
            inputA: 'V',
            inputB: type === 'NOT' ? '' : 'C',
        };
        setGates([...gates, newGate]);
        if (!outputGate) setOutputGate(id);
    };

    const updateGate = (id: string, field: keyof Gate, value: string) => {
        setGates(gates.map(g => g.id === id ? { ...g, [field]: value } : g));
    };

    const removeGate = (id: string) => {
        const newGates = gates.filter(g => g.id !== id);
        // Fix any references to this gate
        const fixed = newGates.map(g => ({
            ...g,
            inputA: g.inputA === id ? 'V' : g.inputA,
            inputB: g.inputB === id ? 'C' : g.inputB,
        }));
        setGates(fixed);
        if (outputGate === id) setOutputGate(fixed.length > 0 ? fixed[fixed.length - 1].id : '');
    };

    const clearAll = () => {
        setGates([]);
        setOutputGate('');
    };

    // Get available sources for a gate's input (no circular refs)
    const getAvailableSources = useCallback((gateId: string): string[] => {
        const gateIndex = gates.findIndex(g => g.id === gateId);
        const priorGates = gates.slice(0, gateIndex).map(g => g.id);
        return [...INPUTS, ...priorGates];
    }, [gates]);

    // Evaluate the circuit for given input values
    const evaluate = useCallback((v: boolean, c: boolean, s: boolean): boolean | null => {
        if (!outputGate || gates.length === 0) return null;

        const values: Record<string, boolean> = { V: v, C: c, S: s };

        for (const gate of gates) {
            const a = values[gate.inputA];
            if (a === undefined) return null;

            if (gate.type === 'NOT') {
                values[gate.id] = !a;
            } else {
                const b = values[gate.inputB];
                if (b === undefined) return null;

                if (gate.type === 'AND') {
                    values[gate.id] = a && b;
                } else {
                    values[gate.id] = a || b;
                }
            }
        }

        return values[outputGate] ?? null;
    }, [gates, outputGate]);

    // Compute truth table from current circuit
    const computedTruthTable = useMemo(() => {
        const rows: { v: number; c: number; s: number; result: number | null }[] = [];
        for (let vi = 0; vi <= 1; vi++) {
            for (let ci = 0; ci <= 1; ci++) {
                for (let si = 0; si <= 1; si++) {
                    const result = evaluate(!!vi, !!ci, !!si);
                    rows.push({ v: vi, c: ci, s: si, result: result === null ? null : (result ? 1 : 0) });
                }
            }
        }
        return rows;
    }, [evaluate]);

    // Generate boolean expression from circuit
    const generateExpression = useCallback((): string => {
        if (!outputGate || gates.length === 0) return '';

        const exprs: Record<string, string> = { V: 'V', C: 'C', S: 'S' };

        for (const gate of gates) {
            const a = exprs[gate.inputA] || gate.inputA;

            if (gate.type === 'NOT') {
                exprs[gate.id] = `(NOT ${a})`;
            } else {
                const b = exprs[gate.inputB] || gate.inputB;
                exprs[gate.id] = `(${a} ${gate.type} ${b})`;
            }
        }

        let result = exprs[outputGate] || '';
        // Strip unnecessary outer parentheses from the final expression
        if (result.startsWith('(') && result.endsWith(')')) {
            // Check if the outer parens are actually wrapping the whole thing
            let depth = 0;
            let isOuter = true;
            for (let i = 0; i < result.length - 1; i++) {
                if (result[i] === '(') depth++;
                if (result[i] === ')') depth--;
                if (depth === 0 && i < result.length - 1) {
                    isOuter = false;
                    break;
                }
            }
            if (isOuter) {
                result = result.slice(1, -1);
            }
        }
        return result;
    }, [gates, outputGate]);

    const handleConvert = () => {
        const expr = generateExpression();
        if (expr) onConvertToCode(expr);
    };

    // Gate type colors
    const gateColor = (type: GateType) => {
        switch (type) {
            case 'AND': return { bg: 'bg-purple-900/30', border: 'border-purple-500/30', text: 'text-purple-400' };
            case 'OR': return { bg: 'bg-blue-900/30', border: 'border-blue-500/30', text: 'text-blue-400' };
            case 'NOT': return { bg: 'bg-red-900/30', border: 'border-red-500/30', text: 'text-red-400' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center">
                <span className="text-xs font-black uppercase tracking-widest text-white/30">Add Gate:</span>
                <button onClick={() => addGate('AND')} className="px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-bold uppercase tracking-widest hover:bg-purple-900/40 transition-all">+ AND</button>
                <button onClick={() => addGate('OR')} className="px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold uppercase tracking-widest hover:bg-blue-900/40 transition-all">+ OR</button>
                <button onClick={() => addGate('NOT')} className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all">+ NOT</button>
                {gates.length > 0 && (
                    <button onClick={clearAll} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all ml-auto">Clear All</button>
                )}
            </div>

            {/* Gate Cards */}
            {gates.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/20 text-sm">
                    Add gates to build your circuit. Connect inputs (V, C, S) through logic gates to produce the required output.
                </div>
            ) : (
                <div className="space-y-3">
                    {gates.map((gate, idx) => {
                        const colors = gateColor(gate.type);
                        const sources = getAvailableSources(gate.id);
                        return (
                            <div key={gate.id} className={`p-4 ${colors.bg} border ${colors.border} rounded-xl`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono text-xs font-bold ${colors.text}`}>{gate.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${colors.text} ${colors.bg}`}>{gate.type}</span>
                                        {gate.id === outputGate && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-green-900/30 text-green-400 border border-green-500/30">FINAL OUTPUT</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {gate.id !== outputGate && (
                                            <button onClick={() => setOutputGate(gate.id)} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-green-400 transition-colors">Set Output</button>
                                        )}
                                        <button onClick={() => removeGate(gate.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Input A:</span>
                                        <select
                                            value={gate.inputA}
                                            onChange={(e) => updateGate(gate.id, 'inputA', e.target.value)}
                                            className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs font-mono focus:border-purple-500 outline-none"
                                        >
                                            {sources.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    {gate.type !== 'NOT' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Input B:</span>
                                            <select
                                                value={gate.inputB}
                                                onChange={(e) => updateGate(gate.id, 'inputB', e.target.value)}
                                                className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs font-mono focus:border-purple-500 outline-none"
                                            >
                                                {sources.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">→ Output:</span>
                                        <span className="font-mono text-xs font-bold text-white/60">{gate.id}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Live Circuit Visualization (SVG) */}
            {gates.length > 0 && (
                <div className="p-4 bg-black/50 border border-white/5 rounded-2xl overflow-x-auto">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Live Circuit Diagram</div>
                    <svg viewBox="0 0 600 200" className="w-full h-auto min-h-[120px]" style={{ maxHeight: '200px' }}>
                        {/* Input nodes */}
                        {INPUTS.map((inp, i) => (
                            <g key={inp}>
                                <circle cx={40} cy={40 + i * 60} r={16} fill="none" stroke="#a855f7" strokeWidth={1.5} opacity={0.5} />
                                <text x={40} y={44 + i * 60} textAnchor="middle" fill="#a855f7" fontSize={12} fontWeight="bold" fontFamily="monospace">{inp}</text>
                            </g>
                        ))}

                        {/* Gate nodes */}
                        {gates.map((gate, idx) => {
                            const x = 160 + idx * 120;
                            const y = 100;
                            const fill = gate.type === 'AND' ? '#7c3aed' : gate.type === 'OR' ? '#3b82f6' : '#ef4444';
                            const isOutput = gate.id === outputGate;

                            return (
                                <g key={gate.id}>
                                    {/* Gate body */}
                                    <rect x={x - 30} y={y - 22} width={60} height={44} rx={8} fill={fill} fillOpacity={0.15} stroke={fill} strokeWidth={isOutput ? 2 : 1} />
                                    <text x={x} y={y - 6} textAnchor="middle" fill={fill} fontSize={10} fontWeight="bold" fontFamily="monospace">{gate.type}</text>
                                    <text x={x} y={y + 10} textAnchor="middle" fill="white" fillOpacity={0.4} fontSize={9} fontFamily="monospace">{gate.id}</text>

                                    {/* Input lines */}
                                    {[gate.inputA, gate.inputB].filter(Boolean).map((inp, pi) => {
                                        const inputIdx = INPUTS.indexOf(inp);
                                        if (inputIdx >= 0) {
                                            const sx = 56;
                                            const sy = 40 + inputIdx * 60;
                                            const ex = x - 30;
                                            const ey = y + (gate.type === 'NOT' ? 0 : (pi === 0 ? -8 : 8));
                                            return <path key={pi} d={`M${sx},${sy} C${(sx + ex) / 2},${sy} ${(sx + ex) / 2},${ey} ${ex},${ey}`} fill="none" stroke="white" strokeOpacity={0.15} strokeWidth={1} />;
                                        }
                                        // Connection from another gate
                                        const srcGate = gates.find(g => g.id === inp);
                                        if (srcGate) {
                                            const srcIdx = gates.indexOf(srcGate);
                                            const sx = 160 + srcIdx * 120 + 30;
                                            const sy = 100;
                                            const ex = x - 30;
                                            const ey = y + (gate.type === 'NOT' ? 0 : (pi === 0 ? -8 : 8));
                                            return <path key={pi} d={`M${sx},${sy} C${(sx + ex) / 2},${sy} ${(sx + ex) / 2},${ey} ${ex},${ey}`} fill="none" stroke="white" strokeOpacity={0.25} strokeWidth={1.5} />;
                                        }
                                        return null;
                                    })}

                                    {/* Output marker */}
                                    {isOutput && (
                                        <>
                                            <line x1={x + 30} y1={y} x2={x + 60} y2={y} stroke="#22c55e" strokeWidth={2} opacity={0.5} />
                                            <circle cx={x + 68} cy={y} r={8} fill="none" stroke="#22c55e" strokeWidth={1.5} />
                                            <text x={x + 68} y={y + 4} textAnchor="middle" fill="#22c55e" fontSize={8} fontWeight="bold">OUT</text>
                                        </>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}

            {/* Your Circuit's Truth Table */}
            {gates.length > 0 && (
                <div className="p-4 bg-black/50 border border-white/5 rounded-2xl">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Your Circuit&apos;s Output</div>
                    <div className="grid grid-cols-8 gap-2 text-center font-mono text-xs">
                        {computedTruthTable.map((row, i) => (
                            <div key={i} className={`p-2 rounded ${row.result === 1 ? 'bg-green-900/20 text-green-400' : row.result === 0 ? 'bg-red-900/20 text-red-400' : 'bg-white/5 text-white/20'}`}>
                                <div className="text-[9px] text-white/30">{row.v}{row.c}{row.s}</div>
                                <div className="font-bold">{row.result === null ? '?' : row.result}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expression + Convert */}
            {gates.length > 0 && (
                <div className="flex items-center gap-4">
                    <div className="flex-1 p-3 bg-black/50 border border-white/10 rounded-lg font-mono text-sm text-white/60 truncate">
                        {generateExpression() || 'Build your circuit...'}
                    </div>
                    <button
                        onClick={handleConvert}
                        disabled={!generateExpression()}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-30 whitespace-nowrap"
                    >
                        Convert to Code →
                    </button>
                </div>
            )}
        </div>
    );
}
