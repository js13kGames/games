const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);
masterGainNode.gain.value = 0.25;

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

export function play200sound() {
  return playTone(300, 200).then(() => playTone(500, 100));
}

export function play404sound() {
  return playTone(300, 150)
    .then(() => playTone(250, 200))
    .then(() => playTone(150, 250));
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

const synth = window.speechSynthesis;
const voices = synth.getVoices();
const voice = voices.find(({ lang }) => lang === 'en-US');

export function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voice;
  utterThis.pitch = 1;
  utterThis.rate = 1;
  utterThis.volume = 1;

  return new Promise(res => {
    utterThis.onend = res;
    synth.cancel();
    synth.speak(utterThis);
  });
}
