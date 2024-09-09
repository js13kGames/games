(function () {

const ctx = new (window.AudioContext || window.webkitAudioContext);
var started = false;
var muted = false;
const oscillator = ctx.createOscillator();


var gainNode = ctx.createGain();
oscillator.connect(gainNode);

gainNode.connect(ctx.destination);

function sound(freq, ms) {
    if (muted) return new Promise(()=>{});
    if (!started) oscillator.start();
    started = true;
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.value = 1;
    return new Promise((resolve) => {
        setTimeout(() => {
            gainNode.gain.value = 0.4;
            setTimeout(() => {
                gainNode.gain.value = 0.0;
            }, 200);
            resolve();
        }, ms);
    });
}
let t0 = +new Date;
let index = 0;

function next() {
    const note = data[index++];
    if (!note) {
        return
    };
    sound(note[0], note[1]).then(next);
}

function melody(m) {
    data = m;
    index = 0;
    next();
}
window.toggleSound = () => {
    muted = !muted;
    if (muted) {
        gainNode.gain.value = 0.0;
    }

};
window.sound = sound;
window.melody = melody;

})();
