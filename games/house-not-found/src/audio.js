// create the audio context
var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext,
  // get the current Web Audio timestamp (this is when playback should begin)
  when = ac.currentTime,
  // set the tempo
  tempo = 160,
  // initialize some vars
  sequence1,
  sequence2,
  sequence3,
  walkSequence,
  knockSequence,
  elevatorSequence
  // create an array of "note strings" that can be passed to a sequence
  lead = [
    'G4 e',
    '-  e',
    'C4 e',
    'D4  e',
    'E4  e',
    'G5  e',
    'F4  e',
    'C4  e',
    'G4 e',
    '-  e',
    'C4 e',
    'D4  e',
    'E4  e',
    'G5  e',
    'F4  e',
    'C4  e',
    'G3  e',
    '-  e',
    'A3  e',
    '-  e',
    'B3  e',
    '-  e',
    'C4  e',
    '-  e',
    'D4  e',
    '-  e',
    'E4  e',
    '-  e',
    'C4  e',
    'D4  e',
    'E3  e',
    'C4  e',
    'C4  e',
  ],
  walk = ['D3  q']
  knock = ['D5  q']
  elevator = ['G5  q']
  select = ['C5  q']

// create 3 new sequences (one for lead, one for harmony, one for bass)
sequence1 = new TinyMusic.Sequence( ac, tempo, lead );
walkSequence = new TinyMusic.Sequence(ac,tempo, walk)
knockSequence = new TinyMusic.Sequence(ac,tempo, knock)
elevatorSequence = new TinyMusic.Sequence(ac,tempo, elevator)
selectSequence = new TinyMusic.Sequence(ac,tempo, select)
sequence1.gain.gain.value = .1;
walkSequence.gain.gain.value = .1
knockSequence.gain.gain.value = .1
elevatorSequence.gain.gain.value = .1
selectSequence.gain.gain.value = .1

function walkSoundPlay() {
  when = ac.currentTime;
  //start the lead part immediately
  walkSequence.play( when );

  setTimeout(() => walkSequence.stop(), 100)
}

function knockSoundPlay() {
  when = ac.currentTime;
  //start the lead part immediately
  knockSequence.play( when );

  setTimeout(() => knockSequence.stop(), 100)
}

function elevatorSoundPlay() {
  when = ac.currentTime;
  //start the lead part immediately
  elevatorSequence.play( when );

  setTimeout(() => elevatorSequence.stop(), 100)
}

function selectSoundPlay() {
  when = ac.currentTime;
  //start the lead part immediately
  selectSequence.play( when );

  setTimeout(() => selectSequence.stop(), 100)
}

function playFinalSound() {
  when = ac.currentTime;
  //start the lead part immediately
  sequence1.play( when );
}