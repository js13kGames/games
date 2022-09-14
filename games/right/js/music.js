/*
AUDIO HANDLING
This part is partially copied from the TinyMusic example.
*/

// create the audio context
var ac = new AudioContext(),
    // initialize some vars
    sequence1,//start
    sequence2,//bg
    wrong,
    right,
    // create an array of "note strings" that can be passed to a sequence

    wr = [
        "E4 e",
        "E3 q"
    ],
    rt = [
        "B3 e",
        "D4b e"
    ],
    bg = [
      'E0 e',
      'A1b e',
      'B0 e',
      'E1 e',
      'E0 e',
      'A1b e',
      'B0 e',
      'E1 e',
      'E0 e',
      'A1b e',
      'B0 e',
      'E1 e',
      'D2 e',
      'D3 e',
      'A1 e',
      'D3 e',
      'D2 e',
      'D3 e',
      'A1 e',
      'D3 e',
        "D4 e",
        "A4 e",
        "D4 e",
        "D4 e",
        "E4 e",
        "D4 e",
        "E4 e",
        "D4 e",
        "F4 e",
        "E4 e",
        "G4 e",
        "F4 e",
        "G4 e",
        "F4 e"
        ],
    start = [
      'D3  q',
      '-   h',
      'D3  q',

      'A2  q',
      '-   h',
      'A2  q',

      'Bb2 q',
      '-   h',
      'Bb2 q',

      'F2  h',
      'A2  h'
],

sequence1 = new TinyMusic.Sequence(ac, 100, start);
sequence2 = new TinyMusic.Sequence(ac, 100, bg);

wrong = new TinyMusic.Sequence(ac, 100, wr);
wrong.loop = false;
wrong.tempo = 300;
wrong.staccato = 0.55;

right = new TinyMusic.Sequence(ac, 100, rt);
right.loop = false;
right.tempo = 300;
right.staccato = 0.55;


// set staccato values for maximum coolness
sequence1.staccato = 0.55;
sequence2.staccato = 0.55;
// adjust the levels
sequence1.gain.gain.value = 0.05;
sequence2.gain.gain.value = 0.03;
wrong.gain.gain.value = 0.1;
right.gain.gain.value = 0.1;

/*
  Audio utilities
*/
//sequence1.play(ac.currentTime);
function wrongSound() {
    wrong.play(ac.currentTime);
}
function rightSound() {
    right.play(ac.currentTime);
}
function startSound(){
    sequence1.play(ac.currentTime);
}
function bgSound() {
    sequence2.play(ac.currentTime);
}
