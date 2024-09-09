function resetVariables() {
  infiniteMode = true;

  selected = false;
  nextDot = {};
  dotSelected = { x: 0, y: 0 };
  mouseX = mouseY = 0;
  mX = mY = 0;
  message = description = "";
  level = 0;
  dots = [];
  lines = [];
}
function draw() {
  if (!infiniteMode) {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  lines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = colors.line;
    ctx.stroke();
  });

  if (selected) {
    ctx.beginPath();
    ctx.moveTo(dotSelected.x, dotSelected.y);
    ctx.lineTo(mX, mY);
    ctx.strokeStyle = colors.line;
    ctx.stroke();
  }
  ctx.fillStyle = obstacle.color;
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  
}

function update() {
  if (level1) {
    if (dots.every((dot) => dot.flag)) { selected = false }
  }
  else if (infiniteMode) {
    if (dots.every((dot) => dot.flag) && level > 0) nextLevel();

    if (!selected) {
      ctx.font = "20px Georgia";
      ctx.fillStyle = colors.selectedDot;
      ctx.fillText(
        message,
        canvas.width / 2 - ctx.measureText(message).width / 2,
        canvas.height / 2
      );
      description.forEach((desc,i) => {
        ctx.fillText(
          desc,
          canvas.width / 2 - ctx.measureText(desc).width / 2,
          canvas.height / 2 + 64 * (i+1)
        );
      })
    }
  }
}

function loop() {
  draw();
  update();
  requestAnimationFrame(loop);
}

function checkColision(dot) {
  //if (dotSelected.x > obstacle.x
}

function getDistance(obj1, obj2) {
  return Math.floor(
    Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2))
  );
}

function getNextDot(dot) {
  let distances = [];
  for (let i = 0; i < dots.length; i++) {
    let distance = getDistance(dot, dots[i]);
    if (distance != 0) distances.push([distance, i]);
  }
  distances.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < distances.length; i++) {
    if (!dots[distances[i][1]].flag) {
      nextDot = dots[distances[i][1]];
      return nextDot;
    }
  }
}

window.onmousedown = (event) => {
  if (message == "Game Over") {
    isMenu = true;
  }
  if (!selected) {
    level++;
    newGame();
  }
  dots.forEach((dot) => {
    if (
      event.clientX > dot.x - 10 &&
      event.clientX < dot.x + 10 &&
      event.clientY > dot.y - 10 &&
      event.clientY < dot.y + 10
    ) {
      if (selected && !dot.flag) {
        let line = {
          x1: dotSelected.x,
          y1: dotSelected.y,
          x2: dot.x,
          y2: dot.y,
        };
        dotSelected.flag = true;
        dot.flag = true;
        selectNewDot(dot, event);
        lines.push(line);
      } else if (!dot.flag) {
        selectNewDot(dot, event);
      }
    }
  });
};

function selectNewDot(dot, event) {
  if (dot.x == nextDot.x && dot.y == nextDot.y) {
    dot.color = colors.selectedDot;
    //dotSelected.x = dot.x
    //dotSelected.y = dot.y
    dotSelected = dot;
    mX = event.clientX;
    mY = event.clientY;
    selected = true;
    getNextDot(dotSelected);
  } else {
    gameOver();
  }
}

window.onmousemove = (event) => {
  dots.forEach((dot) => {
    if (
      event.clientX > dot.x - 10 &&
      event.clientX < dot.x + 10 &&
      event.clientY > dot.y - 10 &&
      event.clientY < dot.y + 10
    ){
      if (!dot.flag) dot.radius =  15
    } else {
      dot.radius =  10
    }
  })
  if (selected) {
    mX = event.clientX;
    mY = event.clientY;
  }
};

window.onresize = (event) => {
  canvas.height = event.target.innerHeight
  canvas.width = event.target.innerWidth

}

function gameOver() {
  selected = false;
  if (level > highScore) {localStorage.setItem("JS13DOT", JSON.stringify(level)); highScore = level }
  message = "Game Over";
  description[0] = `You made until level ${level}`;
  description[1] = `Your high score is ${highScore}`
  description[2] = `Click to start a new game`;
  level = 0;
  //isMenu = true
}

function nextLevel() {
  description = []
  selected = false;
  message = "Congratulations";
  description[0] = "Go to the next level";
}

function newGame() {
  highScore = localStorage.getItem("JS13DOT") ? localStorage.getItem("JS13DOT") : 0
  dots = [];
  lines = [];
  for (let i = 0; i < level * 2; i++) {
    dots.push(dot());
  }
  dotSelected = dots[0];
  dotSelected.color = colors.selectedDot;
  dotSelected.flag = true
  selected = true;
  nextDot = getNextDot(dotSelected);
  loop();
}
level++;
newGame()