const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const GAIN = 0.25;
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
  return playTone(440, 100)
    .then(() => playTone(0, 50))
    .then(() => playTone(440, 100))
    .then(() => playTone(0, 50))
    .then(() => playTone(400, 100))
    .then(() => playTone(0, 50))
    .then(() => playTone(700, 300));
}

export function playLooseTune() {
  return playTone(300, 400)
    .then(() => playTone(0, 100))
    .then(() => playTone(300, 400))
    .then(() => playTone(250, 200))
    .then(() => playTone(100, 250));
}

export function playBeep() {
  return playTone(400, 50);
}

export function playBeepBeep() {
  return playTone(400, 50).then(() => playTone(0, 50)).then(() => playTone(400, 50))
}
