var canvas = document.getElementById('canvas').getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("click", function(e){
  if (currentScene.click) {
    currentScene.click();
  }
});

document.addEventListener("mousemove", function(e){
  if (currentScene.moveShip) {
    currentScene.moveShip(e);
  }
});

var currentScene = {};
function changeScene(scene){
  currentScene = scene;
};

var sound = new Audio("assets/sounds/tiro.mp3");

var score = 0;
var nBullets = 1;

var groupShoot = [];
var shoots = {
  draw(){
    groupShoot.forEach((shoot) => {
      shoot.draw();
    });
  },
  update(){
    groupShoot.forEach((shoot) => {
      shoot.move();

      if (shoot.y <= -100) {
        groupShoot.splice(shoot[0], 1)
      }

    });
  },
};

var groupMeteors = [];
var meteors = {
  time: 0,
  spawMeteors(){
    this.time += 1;

    size = Math.random() * (80 - 50) + 50;
    posx = Math.random() * (450 - 10) + 10;

    if (this.time >= 60) {
      this.time = 0;
      groupMeteors.push(new Meteors(posx, -100,size,size,"assets/meteoro.png"));
    }
  },

  destroyMeteors(){
    groupShoot.forEach((shoot) => {
      groupMeteors.forEach((meteors) => {
        if (shoot.collide(meteors)) {
          groupShoot.splice(groupShoot.indexOf(shoot), 1);
          groupMeteors.splice(groupMeteors.indexOf(meteors), 1);
          score += 1;
          nBullets  = 1;
        }
      });

    });

  },

  draw(){
    groupMeteors.forEach((m) => {
      m.draw();
    });

  },

  update(){
    this.spawMeteors();
    this.destroyMeteors();
    groupMeteors.forEach((m) => {
      m.move();
      if (m.y > 900) {
        changeScene(gameover);
      }
    });
  },
}

var infityBg = {
  bg : new Obj(0,0,500,900,"assets/fundo.png"),
  bg2 : new Obj(0,-900,500,900,"assets/fundo.png"),

  draw(){
    this.bg.draw();
    this.bg2.draw();
  },

  moveBg(){
    this.bg.y += 1;
    this.bg2.y += 1;

    if (this.bg.y >= 900) {
      this.bg.y = 0;
    }
    if (this.bg2.y >= 0) {
      this.bg2.y = -900;
    }
  },
};

var menu = {

  title: new Text("SpaceShip 13K"),
  label: new Text("Click to Play"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),

  score : new Text("Score: "),
  pts : new Text(score),

  click(){
    changeScene(game);
  },

  draw(){
    infityBg.draw();
    this.title.draw_text(60, "Arial", 50, 300, "white");
    this.label.draw_text(20, "Arial", 200, 400, "white");
    this.ship.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
    this.pts.draw_text(30,"arial", 140, 40, "white");

  },
  update(){
    infityBg.moveBg();
  },
};

var game = {
  score : new Text("Score: "),
  pts : new Text("0"),
  bullets : new Text("Bullets: "),
  shoot : new Text("1"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),
  earth: new Obj(180, 800, 180, 180, "assets/terra.png"),

  gameOver(){
    groupMeteors.forEach((m) => {
      if (this.ship.collide(m)) {
        changeScene(gameover);
      }
    });

  },

  click(){

    if (nBullets <= 0) {
      nBullets = 0;
    }
    if (nBullets > 0) {
      nBullets -= 1;
      sound.play();
      groupShoot.push(new Shoot(this.ship.x + this.ship.width / 2,this.ship.y,2,10,"assets/tiro.png"));
    }
  },

  moveShip(event){
    this.ship.x = event.offsetX  - this.ship.width / 2;
    this.ship.y = event.offsetY - 30;
  },

  draw(){
    infityBg.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
    this.pts.draw_text(30,"arial", 140, 40, "white");
    this.bullets.draw_text(30,"arial", 320, 40, "white");
    this.shoot.draw_text(30,"arial", 430, 40, "white");
    this.earth.draw();
    this.ship.draw();
    shoots.draw();
    meteors.draw();

  },

  update(){
    infityBg.moveBg();
    shoots.update();
    meteors.update();
    this.pts.update(score);
    this.shoot.update(nBullets);
    this.gameOver();
  },
};

var gameover = {

  score : new Text("Score: "),
  pts : new Text(score),
  title: new Text("SpaceShip 13K"),
  label: new Text("Click to Restart"),

  draw(){
    infityBg.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
    this.pts.draw_text(30,"arial", 140, 40, "white");
    this.title.draw_text(60, "Arial", 50, 300, "white");
    this.label.draw_text(20, "Arial", 190, 400, "white");
  },
  update(){
    infityBg.moveBg();
    this.pts.update(score);
  },
  cleanMeteors(){
    groupMeteors = [];
  },

  click(){
    this.cleanMeteors();
    score = 0;
    nBullets = 1;
    changeScene(menu);
  }
};

function main(){
  canvas.clearRect(0,0,500,900);
  currentScene.draw();
  currentScene.update();
  requestAnimationFrame(main);
}

changeScene(gameover);
main();
