// @ts-check


const frequencies = {
  C2: 65.41,
  "C#2": 69.30,
  D2: 73.42,
  "D#2": 77.78,
  E2: 82.41,
  F2: 87.31,
  "F#2": 92.50,
  G2: 98.00,
  "G#2": 103.83,
  A2: 110.00,
  "A#2": 116.54,
  B2: 123.47,

  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.00,
  G3: 196.00,
  "G#3": 207.65,
  A3: 220.00,
  "A#3": 233.08,
  B3: 246.94,

  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.00,
  "G#4": 415.30,
  A4: 440.00,
  "A#4": 466.16,
  B4: 493.88,

  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.26,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880.00,
  "A#5": 932.33,
  B5: 987.77,

  C6: 1046.50
};

const ac = new AudioContext();

const playSequence = (sequence, tempo, reverb) => {
	let totalLength = 0;
	sequence.forEach((note) => {
		const noteArray = note.split(' ');
		const length = (60 / tempo) * noteArray[1]
		window.setTimeout(() => {
			if (noteArray[0] !== '-') {
				n(frequencies[noteArray[0]], length * 4, ac, 0.4);
				if (reverb) {
					window.setTimeout(() => {
						n(frequencies[noteArray[0]], length * 4, ac, 0.15);
					}, 180);
					/*
					window.setTimeout(() => {
						n(frequencies[noteArray[0]], length * 4, ac, 0.1);
					}, 120);
					*/
				}
			}
		}, totalLength * 1000);
		totalLength += length;
	});
	return totalLength;
};

const tempo = 180;
const sequenceLH = [
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
  'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'D#3 2', 'A#3 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'C#4 2', 'F#3 2', 'D4 2',
];
const sequenceRH = [
  '- 32',
  'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 4', '- 8', 'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 4', '- 8', 
  'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 4', '- 8', 'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 4', '- 8',
  '- 32',
  'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 2', 'D#5 2', 'A#4 4', '- 4', 'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 2', 'C#5 2', 'C5 2', 'B4 2', 'A#4 2', 'A4 2',
  'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 2', 'D#5 2', 'A#4 4', '- 4', 'D#4 1', 'F4 1', 'F#4 1', 'G#4 1', 'A#4 4', '- 8',
  //'- 1', 'C#5 4', 'C#5 3', 'C5 1', 'C#5 4', 'C#5 3',
  //'- 1', 'C#5 4', 'C#5 3', 'G#4 1', 'G#4 1', 'G4 1', 'G4 1', 'F#4 1', 'F#1 4'
];

document.body.addEventListener('click', () => {
	const totalLength = playSequence(sequenceLH, tempo, true);
	playSequence(sequenceRH, tempo, true);
	// loop:
	window.setInterval(() => {
		playSequence(sequenceLH, tempo, true);
    playSequence(sequenceRH, tempo, true);
	}, totalLength * 1000);
	
}, { once: true });
