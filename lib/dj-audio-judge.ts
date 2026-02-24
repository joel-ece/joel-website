/**
 * Audio Judging Logic for Phase 02
 * Compares a processed AudioBuffer against an original reference AudioBuffer
 */

export interface AudioScore {
    total: number;
    similarity: number;
    alignment: number;
    cleanliness: number;
    metrics: {
        durationDiff: number;
        rmsError: number;
        noiseLevel: number;
    };
}

export async function judgeAudio(
    processed: AudioBuffer,
    original: AudioBuffer
): Promise<AudioScore> {
    // 1. DURATION ALIGNMENT (20%)
    const durationDiff = Math.abs(processed.duration - original.duration);
    // Max penalty at 5 seconds difference
    let alignmentScore = Math.max(0, 1 - durationDiff / 5) * 100;

    // 2. WAVEFORM SIMILARITY (60%)
    // We compare the amplitude envelopes of both tracks in chunks
    const similarityScore = compareEnvelopes(processed, original);

    // 3. NOISE FLOOR / CLEANLINESS (20%)
    // We check for signals in the processed file where the original is near silent
    const cleanlinessScore = calculateCleanliness(processed, original);

    const total = (similarityScore * 0.6) + (alignmentScore * 0.2) + (cleanlinessScore * 0.2);

    return {
        total: Math.round(total),
        similarity: Math.round(similarityScore),
        alignment: Math.round(alignmentScore),
        cleanliness: Math.round(cleanlinessScore),
        metrics: {
            durationDiff: Number(durationDiff.toFixed(2)),
            rmsError: 0, // Simplified envelope comparison used instead
            noiseLevel: 0,
        }
    };
}

function compareEnvelopes(buf1: AudioBuffer, buf2: AudioBuffer): number {
    const data1 = buf1.getChannelData(0);
    const data2 = buf2.getChannelData(0);

    // Resample comparison to ~1000 points for speed
    const samples = 1000;
    const step1 = Math.floor(data1.length / samples);
    const step2 = Math.floor(data2.length / samples);

    let totalDiff = 0;
    let maxAmp = 0;

    for (let i = 0; i < samples; i++) {
        // Get RMS energy for this window
        let rms1 = 0;
        for (let j = 0; j < step1; j++) rms1 += data1[i * step1 + j] ** 2;
        rms1 = Math.sqrt(rms1 / step1);

        let rms2 = 0;
        const offset2 = i * step2;
        if (offset2 < data2.length) {
            for (let j = 0; j < step2 && (offset2 + j) < data2.length; j++) {
                rms2 += data2[offset2 + j] ** 2;
            }
            rms2 = Math.sqrt(rms2 / step2);
        }

        totalDiff += Math.abs(rms1 - rms2);
        maxAmp = Math.max(maxAmp, rms1, rms2);
    }

    // Normalize score: if totalDiff is 0, score is 100. 
    // If avg diff is same as max amp, score is 0.
    const avgDiff = totalDiff / samples;
    const score = Math.max(0, 1 - (avgDiff / (maxAmp || 1))) * 100;

    return score;
}

function calculateCleanliness(processed: AudioBuffer, original: AudioBuffer): number {
    const dataP = processed.getChannelData(0);
    const dataO = original.getChannelData(0);

    // Find silences in original (< 0.01 amp)
    // Check if processed has high signal (> 0.05 amp) during those parts
    const samples = 500;
    const step = Math.floor(original.length / samples);
    let noiseSamples = 0;
    let silentRegions = 0;

    for (let i = 0; i < samples; i++) {
        const start = i * step;
        let originalRMS = 0;
        for (let j = 0; j < step && (start + j) < dataO.length; j++) {
            originalRMS += dataO[start + j] ** 2;
        }
        originalRMS = Math.sqrt(originalRMS / step);

        if (originalRMS < 0.02) {
            silentRegions++;
            let processedRMS = 0;
            const pStart = Math.floor((start / original.length) * dataP.length);
            const pStep = Math.floor(dataP.length / samples);
            for (let j = 0; j < pStep && (pStart + j) < dataP.length; j++) {
                processedRMS += dataP[pStart + j] ** 2;
            }
            processedRMS = Math.sqrt(processedRMS / pStep);

            if (processedRMS > 0.05) noiseSamples++;
        }
    }

    if (silentRegions === 0) return 100;
    return Math.max(0, 1 - (noiseSamples / silentRegions)) * 100;
}
