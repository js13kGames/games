const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

// Get images
const boat = new Image();

// Timers
let timerId, introTimer, retryTimer;


// Sky
const grdTop = ctx.createLinearGradient(0, 245, 800, -400);
  grdTop.addColorStop(0,"#FFB210");
  grdTop.addColorStop(0.3,"#64d2f6");
  grdTop.addColorStop(1,"#fff");

// Reverse Sky
const grdReverse = ctx.createLinearGradient(0, -400, 800, 245)
grdReverse.addColorStop(0,"#fff");
grdReverse.addColorStop(0.7,"#64d2f6");
grdReverse.addColorStop(1,"#FFB210");

// Ocean
const grdBottom = ctx.createLinearGradient(0, 245, 0, 450);
grdBottom.addColorStop(0,"#5DC9D4");
grdBottom.addColorStop(1,"#3066b5");

boat.src = "boat.png";

// Variables
var boatX = 200, boatY = 200;
var gravity = 0.3;
const boatWidth = 60, boatHeight = 60;
let yVector = 0;
let base = 200;
var drawY = 0;

// Row options
var rowRange = 0;
var waveRange = 0.5;
var friction = 0.004;

// Status
let status = {
  stay: true,
  left: false,
  right: false,
  jump: false,
  dive: false,
  row: false
}

// Progress
var progress = 0;

// Obstacle
var obs = {
  width: 50,
  height: 245,
  gap: 344,
}
var obsArr = [];

// Reset
function reset() {
  boatX = 200; boatY = 200; progress = 0; rowRange = 0; yVector = 0; gravity = 0.3; score = 0; comingHome = 0;
  status = {stay: true, left: false, right: false, jump: false, dive: false, row: false};
  reverse = false;
  for (let i = 0; i < 4; i++) {
    obsArr[i].x = cvs.width + (obs.gap * i);
    obsArr[i].y = drawY;
    obsArr[i].z = Math.floor(Math.random() * 2);
    paperArr[i].x = cvs.width + (obs.gap * i) + paperSize;
    paperArr[i].y = drawY + paperHeight;
  };
}

var changeColor = false;

// Key down event
function keyDown(e) {
  // Up
  if(e.keyCode === 38){
    if(status.stay && !status.jump){
    yVector= -9;
    status.jump = true;
    }
  }

  // Dive
    if(e.keyCode === 40){
      if(!status.dive && !status.jump){
      yVector= 1;
      status.stay = false;
      status.dive = true;
    }
  }

}

// Key up event
function keyUp(e) {

  // Dive
  if(e.keyCode === 40){
    status.dive = false;
    yVector= 3;
  }

  // Row
  if(e.keyCode === 82 && introTimer === false) {
    status.row = true;
    rowRange = 3.7;
  }

  // Start game
  if(e.keyCode === 32 && introTimer !== false) {
    clearInterval(introTimer);
    introTimer = false;
    timerId = setInterval(loop, 11);
  }

  // Retry game
  if(e.keyCode === 32 && timerId === false) {
    reset();
    timerId = setInterval(loop, 11);
  }
}


// Obstacles coordinates
for (let i = 0; i < 4; i++) {
  obsArr.push({
    x: cvs.width + (obs.gap * i),
    y: drawY,
    z: Math.floor(Math.random() * 2)
  })
}
// Paper
var paperHeight = 75;
var paperSize = 20;
var paperArr = [];
for (let i = 0; i < 4; i++) {
  paperArr.push({
    x: cvs.width + (obs.gap * i) + paperSize,
    y: drawY + paperHeight,
  })
}

var waveX = 25;
// Obstacles
function drawObs(i) {

  // obstacle top
  if(obsArr[i].z === 0 ) {
    ctx.fillStyle = '#4ABDDC';
    obsArr[i].y = 15;
    ctx.fillRect(obsArr[i].x, obsArr[i].y, obs.width, obs.height);
    ctx.font = "45px serif";
    ctx.fillText('🌊', obsArr[i].x + waveX, 254);
    ctx.fillText('🐬', obsArr[i].x + waveX, 205);
    ctx.fillText('🌊', obsArr[i].x + waveX, 154);
    ctx.fillText('🐬', obsArr[i].x + waveX, 105);
    ctx.fillText('🌊', obsArr[i].x + waveX, 54);

  // obstacle bottom
  } else {
    ctx.fillStyle = '#b9cc5d';
    obsArr[i].y = 200;
    ctx.fillRect(obsArr[i].x, obsArr[i].y, obs.width, obs.height);
    ctx.font = "45px serif";
    ctx.fillText('🦀', obsArr[i].x + waveX, obsArr[i].y + 35);
    ctx.fillText('🌑', obsArr[i].x + waveX, obsArr[i].y + 85);
    ctx.fillText('🦀', obsArr[i].x + waveX, obsArr[i].y + 135);
    ctx.fillText('🌑', obsArr[i].x + waveX, obsArr[i].y + 185);
    ctx.fillText('🦀', obsArr[i].x + waveX, obsArr[i].y + 235);
  }
}

// Paper to collect
function drawPaper(i){
  if(paperArr[i].y === 1000){
  } else {
      paperArr[i].y = obs.height + paperHeight * 1.5;
  }
  if (reverse === false){
    ctx.fillStyle = '#000';
    ctx.font = paperSize + "px serif";
    ctx.fillText('📜', paperArr[i].x, paperArr[i].y);
    }
}

var reverse = false;
var reversePoint = 0;
var comingHome = 0;
var proLocation = 250;
var miniboatSize = 25;

// Progress bar
function drawProgress(proX) {
  ctx.moveTo(proLocation, 40);
  if (!reverse){
    ctx.lineTo(proLocation + proX, 40);
  } else {
    ctx.lineTo(proLocation + proX - comingHome, 40);
  }

  ctx.globalAlpha = "0.4";
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = "5";
  ctx.stroke();
  ctx.globalAlpha = "1.0";


  // Mini boat
  if(score === 10 && reverse === false) {
    reversePoint = proLocation + proX + miniboatSize;
    reverse = true;
  }
  if(score === 10 && reverse === true) {
    // ctx.save();
    ctx.translate(reversePoint, miniboatSize);
    ctx.scale(-1 , 1);
    ctx.drawImage(boat, comingHome, 0, miniboatSize, miniboatSize);
    // ctx.restore();
    ctx.setTransform(1,0,0,1,0,0);
  }
  else {
    ctx.drawImage(boat, proLocation + proX, miniboatSize, miniboatSize, miniboatSize);
  }

  // Mini Destination
  ctx.font = "20px Arial";
  ctx.fillText('🏝️', proLocation, 44);
}


// Key draws
function drawKeys() {
  ctx.fillStyle = "#000000";
  ctx.globalAlpha = "0.4";
  ctx.font = "105px fantasy";
  ctx.fillText('®️', 70, 400);

  ctx.font = "35px fantasy";
  ctx.fillText('⬆️', 140, 350)
  ctx.fillText('⬇️', 140, 395)
  ctx.globalAlpha = "1.0";
}

// Score
var score = 0;
function drawScore() {
  ctx.fillStyle = "#000000";
  ctx.font = "16px Cursive";
  ctx.fillText("Mission", 114, 40);
  
  if(!reverse) {
    ctx.fillStyle = "#ff0000";
  } else {
    ctx.fillStyle = "#1bc301";
  }
  ctx.fillText('Find 📜 : ' + score + "/10", 114 , 64);
  if(reverse) {
    ctx.fillStyle = "#ff0000";
    ctx.font = "22px Cursive";
    ctx.fillText("Get home safe!", 404, 75);
  } 
}

// Retry Display
function retry() {
  ctx.fillStyle = "#000000"
  ctx.globalAlpha = "0.4";
  ctx.fillRect(0, 0, 800, 450);
  ctx.globalAlpha = "1.0";

  ctx.font = "bolder 50px cursive";
  ctx.fillStyle = '#fff';
  ctx.textAlign = "center";
  ctx.fillText("Press [SPACEBAR] to Retry", cvs.width/2, cvs.height/2);
}

function finish() {
  ctx.fillStyle = "#DFC499";
  ctx.fillRect(0, 0, 800, 450);

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.font = "bolder 30px cursive";
  ctx.fillText("Truly thanks 😌", cvs.width/2, cvs.height/2);
  ctx.font = "bold 16px cursive";
  ctx.fillText("- 404 -", cvs.width/2, 400);
}

// Loop
function loop() {
  if(!reverse) {
    ctx.fillStyle = grdTop;
  } else {
    ctx.fillStyle = grdReverse;    
  }
  ctx.fillRect(0, 0, 800, 245);

  ctx.fillStyle = grdBottom;
  ctx.fillRect(0, 245, 800, 205);

  // Jump
  if(status.jump) {
    yVector += gravity;
    boatY += yVector;
    status.stay = false;
    if(boatY > base) {
      status.jump = false;
      status.stay = true;
      boatY = base;
    }
  }

  // Dive
  if(status.dive === true) {
    boatY += yVector;
    if(boatY > 340) {
      yVector = 0;
    }
  } else if(!status.dive && !status.stay && !status.jump){
    boatY -= yVector;
    if(boatY < base) {
      yVector = 0;
      status.stay = true;
    }
  }
  // Draw Obstacles AND Paper
  for (let i = 0; i < obsArr.length; i++) {
    drawObs(i);
    drawPaper(i);

    // Waving forward
    if(!status.row) {
      obsArr[i].x -= waveRange;
      paperArr[i].x -= waveRange;
      progress += waveRange / 100;
      if(reverse === true) {
        comingHome += waveRange / 100;
      }
    }

    //Rowing Forward
    if(status.row) {
      obsArr[i].x -= rowRange;
      paperArr[i].x -= rowRange;
      rowRange -= friction;
      if(rowRange <= 0.5) {
        status.row = false;
      }
      progress += rowRange / 100;
      if(reverse === true) {
        comingHome += rowRange / 100;
      }
    }

    // Obstacle, Paper merry go round
    if(obsArr[i].x <= 0 - obs.width) {
      obsArr[i].x = obs.gap * 4 - obs.width;
      obsArr[i].z = Math.floor(Math.random() * 2);
      paperArr[i].x = obs.gap * 4 - paperSize - 10;
      paperArr[i].y = 0;
    }

    // Collect paper
    if(obsArr[i].z === 0 && !reverse && paperArr[i].y <= boatY + boatHeight && boatY <= paperArr[i].y &&
      paperArr[i].x <= boatX + boatWidth && boatX <= paperArr[i].x)
      {
        paperArr[i].y = 1000;
        score++;
    }
    
    // Obstacles collision
    // 15 is for better collision look
    if(obsArr[i].y + 15<= boatY + boatHeight && boatY <= obsArr[i].y + obs.height -15 && 
      obsArr[i].x <= boatX + boatWidth && boatX <= obsArr[i].x + obs.width){
        clearInterval(timerId);
        timerId = false;
      }
  }

  drawKeys();
  drawProgress(progress);
  drawScore();
  ctx.drawImage(boat, boatX, boatY, boatWidth, boatHeight);

  if(!timerId) {setTimeout(retry(), 100)};
  if(Math.floor(progress) - Math.floor(comingHome) === Math.floor(comingHome) && comingHome !== 0) {
    clearInterval(timerId);
    setTimeout(finish(), 100);
  }
}

// Intro loop
function introLoop() {
  ctx.fillStyle = "#BB8456";
  ctx.fillRect(0, 0, 800, 450);
  
  // Title
  ctx.font = "bolder 44px monospace";
  ctx.fillStyle = '#660A00';
  ctx.textAlign = "center";
  ctx.fillText("Stolen Happiness", cvs.width/2, 100);

  // Story
  ctx.font = "italic 24px cursive";
  ctx.fillStyle = '#660A00';
  ctx.fillText("According to legend, a page of our island book was stolen", cvs.width/2, 175);
  ctx.fillText("It was 404th page that tells 'hapiness'", cvs.width/2, 210);
  ctx.fillText("Rumor says that the page was torn and sunk in the sea", cvs.width/2, 245);
  ctx.fillText("I'll find it and bring it back to the island!", cvs.width/2, 280);

  ctx.font = "bolder 34px monospace";
  ctx.fillStyle = '##b31100';
  ctx.textAlign = "center";
  ctx.fillText("Press [SPACEBAR] to Voyage", cvs.width/2, 360);
}

introTimer = setInterval(introLoop, 500);

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
