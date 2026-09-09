const audioCtx = new (window.AudioContext)();

let _notes = {
    C: [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01, 8372.02],
    CS: [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92, 8869.84],
    D: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.63, 9397.27],
    DS: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03, 9956.06],
    E: [20.60, 41.20, 82.41, 164.81, 329.63, 659.25, 1318.51, 2637.02, 5274.04, 10548.08],
    F: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65, 11175.30],
    FS: [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96, 5919.91, 11839.82],
    G: [24.50, 49.00, 98.00, 196.00, 392.00, 784.00, 1568.00, 3136.00, 6272.00, 12544.00],
    GS: [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44, 6644.88, 13289.76],
    A: [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00, 14080.00],
    AS: [29.14, 58.28, 116.56, 233.13, 466.26, 932.51, 1865.02, 3729.95, 7459.90, 14919.80],
    B: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.06, 7902.12, 15804.24]
}

let playHappySound = octave => {
    _play("triangle", [
        {target: 'frequency', ramp: 'set', value: _notes.DS[octave], time: 0},
        {target: 'frequency', ramp: 'exponential', value: _notes.DS[octave + 1], time: 0.1},
        {target: 'frequency', ramp: 'exponential', value: _notes.DS[octave + 2], time: 0.25},
     ], 0.4);
}

let playNeutralSound = octave => {
    _play("sine", [
        {target: 'frequency', ramp: 'set', value: _notes.A[octave], time: 0},
        {target: 'gain', ramp: 'set', value: 0, time: 0},
        {target: 'gain', ramp: 'linear', value: 0.15, time: 0.02},
        {target: 'gain', ramp: 'exponential', value: 0.001, time: 0.08},
     ], 0.08);
}

let playSadSound = octave => {
    _play("triangle", [
        {target: 'frequency', ramp: 'set', value: _notes.DS[octave], time: 0},
        {target: 'frequency', ramp: 'linear', value: _notes.DS[octave - 1], time: 0.3},
        {target: 'frequency', ramp: 'exponential', value: _notes.DS[octave - 2], time: 0.6},
        {target: 'gain', ramp: 'set', value: 0.2, time: 0},
        {target: 'gain', ramp: 'exponential', value: 0.001, time: 0.6},
     ], 0.6);
}

let _play = (wave, ops, len) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    
    o.connect(g);
    g.connect(audioCtx.destination);
    o.type = wave; 
    const now = audioCtx.currentTime;
    ops.forEach(op => {
        if (op.target == 'frequency') {
            if (op.ramp === 'set') {
                o.frequency.setValueAtTime(op.value, now + op.time);
            } else if (op.ramp === 'linear') {
                o.frequency.linearRampToValueAtTime(op.value, now + op.time);
            } else {
                o.frequency.exponentialRampToValueAtTime(op.value, now + op.time);
            }
        } else {
            if (op.ramp === 'set') {
                g.gain.setValueAtTime(op.value, now + op.time);
            } else if (op.ramp === 'linear') {
                g.gain.linearRampToValueAtTime(op.value, now + op.time);
            } else {
                g.gain.exponentialRampToValueAtTime(op.value, now + op.time);
            }
        }
    });
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + len);
    o.start(now);
    o.stop(now + len);
}
