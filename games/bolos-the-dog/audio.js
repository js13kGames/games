/*
Inspired by: https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js 
*/

var grab = []
function initAudio() {
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source;
  var stream;

  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;  

  var gainNode = audioCtx.createGain();
  var sndCanvas = document.getElementById('visualizer');
  var sndCanvasCtx = sndCanvas.getContext("2d");
  var intendedWidth = document.querySelector('.wrapper').clientWidth;
  sndCanvas.setAttribute('width', intendedWidth)
  
  var intendedHeight = document.querySelector('.wrapper').clientHeight;
  //sndCanvas.setAttribute('height', intendedHeight)

  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    var constraints = {audio: true}
    navigator.mediaDevices.getUserMedia (constraints)
      .then(function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(gainNode);
        gainNode.connect(analyser);
        visualize();
      }).catch( function(err) { console.log('The following gUM error occured: ' + err);})
  } else {
    console.log('getUserMedia not supported on your browser!');
  }

  function visualize() {
    var WIDTH = sndCanvas.width;
    var HEIGHT = sndCanvas.height;

    analyser.fftSize = 512;
    var bufferLengthAlt = analyser.frequencyBinCount;
    
    var dataArrayAlt = new Uint8Array(bufferLengthAlt);
    sndCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    // exponential averages uset to detect atack
    // fast
    var fea = 0
    // slow
    var sea = 0
    var atack = false
    var startAtack = false

    var drawAlt = function() {
      drawVisual = requestAnimationFrame(drawAlt);

      analyser.getByteFrequencyData(dataArrayAlt);

      sndCanvasCtx.fillStyle = 'rgb(0, 0, 0)';
      sndCanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
      var barHeight;

      lags = sndProc(dataArrayAlt)

      fea = fea * (1 - 0.7) + dataArrayAlt.reduce((a, c) => c > a ? c : a, 0) * 0.7
      sea = sea * (1 - 0.3) + dataArrayAlt.reduce((a, c) => c > a ? c : a, 0) * 0.3
      
      if (fea > parseFloat(document.getElementById('threshold').value)) {

        if (fea > sea) {
          startAtack = true
        }        

        if (fea < sea && startAtack) {
          atack = true          
          startAtack = false
          
          // use this grab training data
          //grab.push(Array.from(dataArrayAlt).slice(0, 30))

          let pred = predictBayes(lags, window.MODEL)
          let bindex = pred[0]
          let score = pred[1]
          
          if (isFinite(score) && (score > -1000) ) {
            // detect `SNDFIU`
            if (bindex === 0) {
              console.log('fiu', score)
              dog.speed = DOGSPEED*3
              dog.greedy = false
              msgel.innerText = randomPick(["Run, Forrest, Run! 🏃", "Fast and furious! 😎", "WEEE-OOOO-WEEE-OOOO! 🚒"])
            }

            // detect `SNDNOISE`
            if (bindex === 1) {
              //console.log('noise', score)
              msgel.innerText = "Error 404: Sound command not found!"
            }

            // detect `SNDTAC`
            if (bindex === 2 && (score > 100)) {
              //console.log('tac', score)
              msgel.innerText = "Error 404: Sound not recognized!"
            }
          }
        }
      }
      // plot
      var x = 0;
      for(var i = 0; i < bufferLengthAlt; i++) {
        barHeight = dataArrayAlt[i];

        if (fea > sea && startAtack) {
          sndCanvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        } else {
          sndCanvasCtx.fillStyle = 'rgb(50,50,' + (barHeight+100) + ')';
        }
        sndCanvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

        x += barWidth + 1;
      }
    };

    drawAlt();
  }
}