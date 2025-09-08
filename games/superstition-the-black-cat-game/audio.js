const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const GAIN = 0.025;
masterGainNode.gain.value = GAIN;

export const mute = () => {
    masterGainNode.gain.value = 0
}

export const unmute = () => {
    masterGainNode.gain.value = GAIN;
}

export function playTone(freq, duration = 500) {
    const osc = audioContext.createOscillator();
    osc.connect(masterGainNode);
    osc.type = 'square';
    osc.frequency.value = freq;
    osc.start();

    return new Promise(res => {
        setTimeout(() => {
            osc.stop();
            res();
        }, duration);
    });
}

export function playWonTune() {
    return playTone(440, 50)
        .then(() => playTone(0, 25))
        .then(() => playTone(440, 50))
        .then(() => playTone(0, 25))
        .then(() => playTone(400, 50))
        .then(() => playTone(0, 25))
        .then(() => playTone(700, 150));
}

export function playLooseTune() {
    return playTone(300, 200)
        .then(() => playTone(0, 50))
        .then(() => playTone(300, 200))
        .then(() => playTone(250, 100))
        .then(() => playTone(100, 125));
}

export function playBeep() {
    return playTone(400, 50);
}

export function playBeepBeep() {
    return playTone(400, 50).then(() => playTone(0, 50)).then(() => playTone(400, 50))
}

export async function playWooshSound(duration) {
    try {
        const now = audioContext.currentTime;

        // --- 1. Create White Noise Source ---
        // Create an AudioBuffer (a chunk of audio data)
        const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds of noise
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        // Fill the buffer with random noise values between -1 and 1
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1; // Generates white noise
        }

        // Create a BufferSourceNode to play our noise buffer
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = false; // Don't loop the noise

        // --- 2. Create a BiquadFilterNode to shape the sound ---
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = 'lowpass'; // A low-pass filter allows lower frequencies through

        // --- 3. Create a GainNode for volume control and envelope ---
        const gainNode = audioContext.createGain();

        // --- Connect the Nodes: Noise -> Filter -> Gain -> Destination ---
        noiseSource.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // --- Sound Parameters ---
        const filterStartFreq = 100; // Starting cutoff frequency for the filter
        const filterEndFreq = 2000; // Ending cutoff frequency for the filter (more high end)
        const peakVolume = 0.7; // Maximum volume of the sweep
        const attackTime = 0.02; // Very quick attack (initial burst)
        const decayTime = 0.08; // Quick decay from peak volume
        const sustainTime = 0.05; // Short sustain
        const releaseTime = 0.15; // Moderate release

        // --- Apply Filter Frequency Sweep ---
        // Start the filter frequency low
        filterNode.frequency.setValueAtTime(filterStartFreq, now);
        // Ramp up the filter frequency quickly over the duration
        filterNode.frequency.linearRampToValueAtTime(filterEndFreq, now + duration);


        // --- Apply Volume (Gain) Envelope (ADSR-like) ---
        gainNode.gain.setValueAtTime(0.001, now); // Start from near silent to avoid clicks
        // Attack: Rapid increase to peak volume
        gainNode.gain.linearRampToValueAtTime(peakVolume, now + attackTime);
        // Decay: Slightly drop from peak
        gainNode.gain.linearRampToValueAtTime(peakVolume * 0.6, now + attackTime + decayTime);
        // Sustain: Hold for a short period
        gainNode.gain.linearRampToValueAtTime(peakVolume * 0.5, now + attackTime + decayTime + sustainTime);
        // Release: Fade out to silence
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);


        // Start the noise source
        noiseSource.start(now);
        // Stop the noise source after the sound duration
        noiseSource.stop(now + duration + 0.1); // Add a small buffer after the sound finishes

        // // Clean up the audio context after the sound finishes
        // noiseSource.onended = () => {
        //     audioContext.close();
        // };

    } catch (e) {
        console.error("Error playing broom sweep sound:", e);
    }
}
