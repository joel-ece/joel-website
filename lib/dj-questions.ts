// 10 Logic Gate Questions — 3 inputs (V, C, S), 1 output
// Each team is assigned 3 random questions from this pool
// Validation is done by evaluating the expression against the truth table (not pattern matching)

export interface LogicQuestion {
    id: number;
    outputName: string;
    narrative: string;
    truthTable: number[][]; // [V, C, S, Output] for each row
    correctExpression: string; // The "optimal" answer for reference
    optimalGateCount: number; // Minimum gates needed for optimal solution
}

// Helper: evaluate a boolean expression for given V, C, S
function evalExpr(v: boolean, c: boolean, s: boolean, fn: (v: boolean, c: boolean, s: boolean) => boolean): number {
    return fn(v, c, s) ? 1 : 0;
}

// Generate truth table for a given function
function makeTruthTable(fn: (v: boolean, c: boolean, s: boolean) => boolean): number[][] {
    const rows: number[][] = [];
    for (let vi = 0; vi <= 1; vi++) {
        for (let ci = 0; ci <= 1; ci++) {
            for (let si = 0; si <= 1; si++) {
                rows.push([vi, ci, si, evalExpr(!!vi, !!ci, !!si, fn)]);
            }
        }
    }
    return rows;
}

export const QUESTION_BANK: LogicQuestion[] = [
    {
        id: 0,
        outputName: 'STAGE_UNLOCK',
        narrative: 'The main stage lock requires VIBE and CROWD presence, OR SECURITY must be disabled.',
        truthTable: makeTruthTable((v, c, s) => (v && c) || !s),
        correctExpression: '(V AND C) OR (NOT S)',
        optimalGateCount: 3,
    },
    {
        id: 1,
        outputName: 'AMP_ENABLE',
        narrative: 'The amplifier activates when at least one of VIBE or CROWD is detected, but only if SECURITY is off.',
        truthTable: makeTruthTable((v, c, s) => (v || c) && !s),
        correctExpression: '(V OR C) AND (NOT S)',
        optimalGateCount: 3,
    },
    {
        id: 2,
        outputName: 'BASS_DROP',
        narrative: 'The bass drop triggers when VIBE is absent AND either CROWD or SECURITY is active.',
        truthTable: makeTruthTable((v, c, s) => !v && (c || s)),
        correctExpression: '(NOT V) AND (C OR S)',
        optimalGateCount: 3,
    },
    {
        id: 3,
        outputName: 'LIGHT_SYNC',
        narrative: 'The light show synchronizes when both VIBE and SECURITY are active, OR when CROWD is absent.',
        truthTable: makeTruthTable((v, c, s) => (v && s) || !c),
        correctExpression: '(V AND S) OR (NOT C)',
        optimalGateCount: 3,
    },
    {
        id: 4,
        outputName: 'MIXER_ARM',
        narrative: 'The mixer arms when VIBE is absent, OR when both CROWD and SECURITY are active.',
        truthTable: makeTruthTable((v, c, s) => !v || (c && s)),
        correctExpression: '(NOT V) OR (C AND S)',
        optimalGateCount: 3,
    },
    {
        id: 5,
        outputName: 'FX_TRIGGER',
        narrative: 'Effects trigger when VIBE or SECURITY is detected, but CROWD must be absent.',
        truthTable: makeTruthTable((v, c, s) => (v || s) && !c),
        correctExpression: '(V OR S) AND (NOT C)',
        optimalGateCount: 3,
    },
    {
        id: 6,
        outputName: 'DECK_POWER',
        narrative: 'The deck powers on when VIBE is detected without CROWD, OR when SECURITY is active.',
        truthTable: makeTruthTable((v, c, s) => (v && !c) || s),
        correctExpression: '(V AND (NOT C)) OR S',
        optimalGateCount: 3,
    },
    {
        id: 7,
        outputName: 'VOLUME_GATE',
        narrative: 'The volume gate opens only when both VIBE and CROWD are absent while SECURITY is active.',
        truthTable: makeTruthTable((v, c, s) => !v && !c && s),
        correctExpression: '(NOT V) AND (NOT C) AND S',
        optimalGateCount: 4,
    },
    {
        id: 8,
        outputName: 'EQ_BALANCE',
        narrative: 'The equalizer balances when VIBE is present or CROWD is absent, as long as SECURITY is active.',
        truthTable: makeTruthTable((v, c, s) => (v || !c) && s),
        correctExpression: '(V OR (NOT C)) AND S',
        optimalGateCount: 3,
    },
    {
        id: 9,
        outputName: 'CROSSFADE',
        narrative: 'Crossfade engages when neither VIBE nor SECURITY is active, OR CROWD is present.',
        truthTable: makeTruthTable((v, c, s) => (!v && !s) || c),
        correctExpression: '((NOT V) AND (NOT S)) OR C',
        optimalGateCount: 4,
    },
];

// ==================== EXPRESSION EVALUATOR ====================
// Parses and evaluates boolean expressions like "(V AND C) OR (NOT S)"
// Supports: AND, OR, NOT, parentheses, variables V/C/S

function tokenize(expr: string): string[] | null {
    const tokens: string[] = [];
    let i = 0;
    const s = expr.toUpperCase().trim();

    while (i < s.length) {
        if (s[i] === ' ' || s[i] === '\t' || s[i] === '\n') { i++; continue; }
        if (s[i] === '(' || s[i] === ')') { tokens.push(s[i]); i++; continue; }

        if (s.substring(i, i + 3) === 'AND' && (i + 3 >= s.length || !/[A-Z]/.test(s[i + 3]))) {
            tokens.push('AND'); i += 3; continue;
        }
        if (s.substring(i, i + 2) === 'OR' && (i + 2 >= s.length || !/[A-Z]/.test(s[i + 2]))) {
            tokens.push('OR'); i += 2; continue;
        }
        if (s.substring(i, i + 3) === 'NOT' && (i + 3 >= s.length || !/[A-Z]/.test(s[i + 3]))) {
            tokens.push('NOT'); i += 3; continue;
        }

        if (s[i] === 'V' || s[i] === 'C' || s[i] === 'S') {
            tokens.push(s[i]); i++; continue;
        }

        // Unknown character — invalid expression
        return null;
    }

    return tokens;
}

// Recursive descent parser
function parseExpression(tokens: string[], pos: { i: number }, vars: Record<string, boolean>): boolean | null {
    let left = parseTerm(tokens, pos, vars);
    if (left === null) return null;

    while (pos.i < tokens.length && tokens[pos.i] === 'OR') {
        pos.i++; // consume OR
        const right = parseTerm(tokens, pos, vars);
        if (right === null) return null;
        left = left || right;
    }
    return left;
}

function parseTerm(tokens: string[], pos: { i: number }, vars: Record<string, boolean>): boolean | null {
    let left = parseFactor(tokens, pos, vars);
    if (left === null) return null;

    while (pos.i < tokens.length && tokens[pos.i] === 'AND') {
        pos.i++; // consume AND
        const right = parseFactor(tokens, pos, vars);
        if (right === null) return null;
        left = left && right;
    }
    return left;
}

function parseFactor(tokens: string[], pos: { i: number }, vars: Record<string, boolean>): boolean | null {
    if (pos.i >= tokens.length) return null;

    if (tokens[pos.i] === 'NOT') {
        pos.i++;
        const val = parseFactor(tokens, pos, vars);
        if (val === null) return null;
        return !val;
    }

    if (tokens[pos.i] === '(') {
        pos.i++; // consume (
        const val = parseExpression(tokens, pos, vars);
        if (val === null) return null;
        if (pos.i < tokens.length && tokens[pos.i] === ')') {
            pos.i++; // consume )
        }
        return val;
    }

    const token = tokens[pos.i];
    if (token === 'V' || token === 'C' || token === 'S') {
        pos.i++;
        return vars[token];
    }

    return null;
}

// Evaluate a user expression for given variable values
function evaluateUserExpression(expr: string, v: boolean, c: boolean, s: boolean): boolean | null {
    const tokens = tokenize(expr);
    if (!tokens || tokens.length === 0) return null;

    const pos = { i: 0 };
    const result = parseExpression(tokens, pos, { V: v, C: c, S: s });
    return result;
}

// Count operations (AND, OR, NOT) in an expression
export function countGates(expr: string): number {
    const tokens = tokenize(expr);
    if (!tokens) return 999;
    return tokens.filter(t => t === 'AND' || t === 'OR' || t === 'NOT').length;
}

// ==================== VALIDATION ====================
// Validates by evaluating the expression against the truth table
// Returns { correct: boolean, score: number }

export interface ValidationResult {
    correct: boolean;
    score: number; // 0-100 per question
    gateCount: number;
    optimal: boolean;
}

export function validateAnswer(questionId: number, userExpression: string): ValidationResult {
    const question = QUESTION_BANK[questionId];
    if (!question) return { correct: false, score: 0, gateCount: 0, optimal: false };

    // Evaluate the expression for all 8 input combinations
    for (const row of question.truthTable) {
        const [vi, ci, si, expected] = row;
        const result = evaluateUserExpression(userExpression, !!vi, !!ci, !!si);

        if (result === null) {
            return { correct: false, score: 0, gateCount: 0, optimal: false };
        }

        const actual = result ? 1 : 0;
        if (actual !== expected) {
            return { correct: false, score: 0, gateCount: 0, optimal: false };
        }
    }

    // Correct! Now score based on optimization
    const gateCount = countGates(userExpression);
    const optimal = gateCount <= question.optimalGateCount;

    let score: number;
    const diff = gateCount - question.optimalGateCount;
    if (diff <= 0) {
        score = 100; // Optimal or better
    } else if (diff === 1) {
        score = 85;
    } else if (diff === 2) {
        score = 70;
    } else if (diff === 3) {
        score = 60;
    } else {
        score = 50; // Still correct, minimum score
    }

    return { correct: true, score, gateCount, optimal };
}

// Assign 3 random questions to a team (returns array of question IDs)
export function assignRandomQuestions(): number[] {
    const indices = Array.from({ length: QUESTION_BANK.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 3);
}
