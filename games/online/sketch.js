var p = new Player();
var t = new Track();
var o = new Obstacle();
var obst = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var frameCount = 0;
var points = 0;
var totalPoints = Math.floor((points / 2) + 1);
var dx = p.x - o.x;
var dy = p.y - o.y;
var distance = Math.sqrt(dx * dx + dy * dy);
var left = -canvas.width / (lineCount + 1);
var right = canvas.width / (lineCount + 1);
var time = canvas.height / 7.5;
var trackWidth = 5;
var emptySpace = 0;
var lineCount = 3;

emptySpace = respaceLines();
obst.push(new Obstacle());

window.main = function() {
  window.requestAnimationFrame(main);
  frameCount++
  ctx.clearRect(0, 0, 400, 600);
  t.show();
  p.show();
  for (var i = obst.length - 1; i >= 0; i--) {
    obst[i].show();
    obst[i].update();
    obst[i].addObst();
    obst[i].remove();
    obst[i].hit();
  }
  score();
  // This is the main loop (framebyframe animations)
};

main();


function Player() {
  this.x = 200;
  this.y = 550;
  this.rad = 12;

  this.show = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, -90, 1.5 * Math.PI);
    ctx.fillStyle = "#eee8d5";
    ctx.fill();

    if (this.x > canvas.width - emptySpace) {
      this.x = canvas.width - emptySpace;
      //Game will end if you go Offline
    }
    if (this.x < emptySpace) {
      this.x = emptySpace;
      //Game will end if you go Offline
    }
  }
};

function Track() {
  this.show = function() {
    right = respaceLines();
    left = -right;
    emptySpace = respaceLines();
    for (var i = 0; i < lineCount; i++) {
      ctx.beginPath();
      ctx.moveTo(emptySpace * i + emptySpace, canvas.height);
      ctx.lineTo(emptySpace * i + emptySpace, 0);
      ctx.strokeStyle = "#268bd2";
      ctx.lineWidth = trackWidth;
      ctx.stroke();
    }
  }
};

function Obstacle() {
  var placement = Math.floor(Math.random() * lineCount) + 1;
  this.x = placement * emptySpace;
  this.y = 0;
  this.rad = 15;
  this.speed = 10;

  this.remove = function() {
    if (obst.length > 2) {
      obst.splice(0, 1);
    }
  }

  this.show = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, -90, 1.5 * Math.PI);
    ctx.fillStyle = "#dc322f";
    ctx.fill();
  }
  this.update = function() {
    var totalPoints = Math.floor(points / 2);
    this.y += this.speed;
    if (totalPoints > 9) {
      this.speed = 15;
    }
    if (totalPoints > 35) {
      this.speed = 20;
    }
    if (totalPoints > 100) {
      this.speed = 25;
    }
  }

  this.hit = function() {
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < p.rad + this.rad) {
      this.speed = 0;
      box = true;
      ctx.font = "2rem Oswald";
      ctx.fillStyle = "#eee8d5";
      ctx.fillText("YOU WERE KNOCKED OFFLINE!", canvas.width / 16, canvas.height / 2);
      ctx.fillText("Press 'r' to Restart", canvas.width / 4.25, canvas.height / 5 * 3);
      left = 0;
      right = 0;
      hit = false;
      time = 0;
    }
  }
  document.onkeydown = checkKey;

  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
      // left arrow
      if (p.x != emptySpace) {
        p.x += left;
      }
    } else if (e.keyCode == '39') {
      // right arrow
      if (p.x != canvas.width - emptySpace) {
        p.x += right;
      }
    } else if (e.keyCode == '82') {
      // restart
      reset();
    };
  };

  this.addObst = function() {
    if (frameCount % time == 0) {
      points++;
      var totalPoints = Math.floor(points / 2);
      obst.push(new Obstacle());
    }
  }
};

function reset() {
  document.location.reload();
}

function score() {
  var totalPoints = Math.floor((points / 2) + 1);
  ctx.beginPath;
  ctx.rect(0, canvas.height / 4, canvas.width, canvas.height / 4 * 3);
  ctx.fillStyle = "#2aa198";
  ctx.stroke;
  ctx.closePath;
  ctx.font = "2rem Dosis";
  ctx.fillStyle = "#eee8d5";
  ctx.fillText(totalPoints, 30, 40);
}

function respaceLines() {
  var a = lineCount + 1;
  return canvas.width / a;
}
