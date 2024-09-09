// MAIN JS - CORE CUSTUM CODE FOR Superposition VR by Chris Godber

// Game variables
let gamestarted = false;
//green winspheres
let amountofWinBoxes = Math.floor(420);
// amount of red decrement scores spheres
let amountofBadBoxes = Math.floor(340);
//init score and game state variables
let score = 0;
let totalTime = 150;
let TimeDisplay = 150;
//score to win game
const winScore = 100;
// boolean to prevent looping append of win message on win condition
let winScoreShown = false;

//run begin Game routines on new game started
window.onload = function () {
  //setup and populate game scene
  beginGame();
};

// AFRAME Componenets

// change color and increment score on player gaze / mouse and reset on gaze / mouse leave
AFRAME.registerComponent('change-color-on-hover', {
  schema: {
    color: {default: 'white'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>
    var defaultColor = el.getAttribute('material').color;

    el.addEventListener('mouseenter', function () {
      score++;
      document.getElementById('score').play();
      el.setAttribute('color', data.color);
    });

    el.addEventListener('mouseleave', function () {
      el.setAttribute('color', defaultColor);
    });
  }
});

// comonponent for minus score if gazing at a red sphere
AFRAME.registerComponent('minus-score', {
  schema: {
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>
    el.addEventListener('mouseenter', function () {
      score--;
      document.getElementById('lose').play();
    });
  }
});

// update score to UI Text Componenet every second
AFRAME.registerComponent('update-score-every-second', {
  init: function () {
    const el = this.el;
    setInterval(function () {
      el.setAttribute('text', 'value', score.toString());
    }, 1000);
  }
});

// update time to UI Text Componenet every second
AFRAME.registerComponent('update-time-every-second', {
  init: function () {
    const el = this.el;
    setInterval(function () {
      TimeDisplay--;
      el.setAttribute('text', 'value', TimeDisplay.toString());
    }, 1000);
  }
});

// Begin Game Loop - Genereate atoms normal and bad - and begin update GameState
// to check for winconditions and update timer
function beginGame() {
  gamestarted = true;
  createWinBoxes(amountofWinBoxes);
  createBadBoxes(amountofBadBoxes);
  updateGameState(totalTime);
}

//Checking for win conditional and decrement timer update every second
function updateGameState(totalTime) {
  setInterval(function () {
    // decrement timer
    totalTime--;
    // check for game lose or win conditions
    if (totalTime === 0) {
      restart();
    }
    if (score>=winScore && winScoreShown == false) {
      winMsg();
      winScoreShown = true;
    }
  }, 1000);
}

//Function to restart game loop
function restart() {
  location.reload();
}

// Utililty function to generate reandom int with min / max params
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a win message on player getting to the set score
function winMsg(){
  let textWin = document.createElement('a-entity');
  textWin.setAttribute('position', {x: 0.6, y: 0, z: -1});
  textWin.setAttribute('text', 'value', 'YOU WON!', 'color', 'white', 'width','80');
  document.getElementById('player').appendChild(textWin);

  const scene = document.querySelector('a-scene')
  // pause the game after win msg presented
  scene.pause();
  //restart game after 4 seconds
  setInterval(function () {
    restart();
  }, 4000);
}

//function to generate good atoms with random positiong and animaions  with a for loop
function createWinBoxes() {
  let i;
  for (i = 0; i < amountofWinBoxes; i++) {
    let winbox = document.createElement('a-sphere');
    let posx = getRandomInt(-400,400);
    let posz = getRandomInt(-550, 500);
    let posy = getRandomInt(-400, 450);
    let scale = getRandomInt(8, 10);

    let randPosX = getRandomInt(-400, 400);
    let randposZ = getRandomInt(-400,400);
    let randposY = getRandomInt(1,450);

    winbox.setAttribute('position', {x: posx, y: posy, z: posz});
    winbox.object3D.scale.set(scale, scale, scale);
    winbox.setAttribute('material', 'color', '#ADD8E6');
    winbox.setAttribute('name', 'winbox');
    winbox.setAttribute('winbox', '');
    winbox.setAttribute('change-color-on-hover', 'color', 'green');
    winbox.setAttribute('class', 'winbox');
    winbox.setAttribute('animation', 'dur: 1200; easing: linear; loop: true; property: position; to:'+randPosX, randposY, randposZ);
    document.querySelector('a-scene').appendChild(winbox);
  }
}

//function to generate bad atoms with random positiong and animaions  with a for loop
function createBadBoxes() {
  let i;
  for (i = 0; i < amountofBadBoxes; i++) {
    let badbox = document.createElement('a-sphere');
    let posx = getRandomInt(-400,400);
    let posz = getRandomInt(-550, 500);
    let posy = getRandomInt(-400, 450);
    let scale = getRandomInt(8, 10);

    let randPosX = getRandomInt(-400, 400);
    let randposZ = getRandomInt(-400,400);
    let randposY = getRandomInt(1,450);

    badbox.setAttribute('position', {x: posx, y: posy, z: posz});
    badbox.object3D.scale.set(scale, scale, scale);
    badbox.setAttribute('material', 'color', 'red');
    badbox.setAttribute('name', 'badbox');
    badbox.setAttribute('badbox', '');
    badbox.setAttribute('minus-score', '');
    badbox.setAttribute('class', 'badbox');
    badbox.setAttribute('animation', 'dur: 1200; easing: linear; loop: true; property: position; to:'+randPosX, randposY, randposZ);
    document.querySelector('a-scene').appendChild(badbox);
  }
}