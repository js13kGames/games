let { canvas, context, text } = kontra.init();

let sprites = [];
let ls = window.localStorage;
let gameOver = false;
let level = 1;
let points = 0;
let maxLevel = ls.getItem('maxLevel') == null ? 0 : ls.getItem('maxLevel') ;
let maxPoints = ls.getItem('maxPoints') == null ? 0 : ls.getItem('maxPoints');

function ArcadeAudio() {
  this.sounds = {};
}

ArcadeAudio.prototype.add = function( key, count, settings ) {
  this.sounds[ key ] = [];
  settings.forEach( function( elem, index ) {
    this.sounds[ key ].push( {
      tick: 0,
      count: count,
      pool: []
    } );
    for( var i = 0; i < count; i++ ) {
      var audio = new Audio();
      audio.src = jsfxr( elem );
      this.sounds[ key ][ index ].pool.push( audio );
    }
  }, this );
};

ArcadeAudio.prototype.play = function( key ) {
  var sound = this.sounds[ key ];
  var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
  soundData.pool[ soundData.tick ].play();
  soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
};

var aa = new ArcadeAudio();

aa.add( 'powerup', 10,
  [
    [0,,0.01,,0.4384,0.2,,0.12,0.28,1,0.65,,,0.0419,,,,,1,,,,,0.3]
  ]
);

aa.add( 'laser', 5,
  [
    [0,,0.16,0.18,0.18,0.47,0.0084,-0.26,,,,,,0.74,-1,,-0.76,,1,,,,,0.15]
  ]
);

aa.add( 'damage', 3,
  [
    [3,,0.0138,,0.2701,0.4935,,-0.6881,,,,,,,,,,,1,,,,,0.25],
    [0,,0.0639,,0.2425,0.7582,,-0.6217,,,,,,0.4039,,,,,1,,,,,0.25],
    [3,,0.0948,,0.2116,0.7188,,-0.6372,,,,,,,,,,,1,,,0.2236,,0.25],
    [3,,0.1606,0.5988,0.2957,0.1157,,-0.3921,,,,,,,,,0.3225,-0.2522,1,,,,,0.25],
    [3,,0.1726,0.2496,0.2116,0.0623,,-0.2096,,,,,,,,,0.2665,-0.1459,1,,,,,0.25],
    [3,,0.1645,0.7236,0.3402,0.0317,,,,,,,,,,,,,1,,,,,0.25]
  ]
);

let menu = document.getElementById('game_over');
let menuContext = menu.getContext("2d");

function menuGameOver(){
  menuContext.clearRect(0, 0, menu.width, menu.height); 
  menuContext.fillStyle = "#f4511e";
  menuContext.globalAlpha=0.6;
  menuContext.font = "42px Arial";
  menuContext.textAlign = "center";
  menuContext.fillText("Game Over!", 150, 70);
}

function menuStart(time){
  menuContext.clearRect(0, 0, menu.width, menu.height); 
  menuContext.fillStyle = "#f4511e";
  menuContext.globalAlpha=0.6;
  menuContext.font = "42px Arial";
  menuContext.textAlign = "center";
  menuContext.fillText("Game Start in:", 150, 70);
  menuContext.fillText(time, 150, 150);
}


let btMenu = document.getElementById('btn_again');
let sTable = document.getElementById("data_canvas");
let scoreTable = sTable.getContext("2d");

function getRandomLetter() {
  let ran = Math.random() * (4 - 0) + 0;
  if (ran > 0 && ran < 2) {
    return "4";
  } else {
    return "0";
  }
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createAsteroid(x, y, radius, text) {
  let asteroid = kontra.Sprite({
    type: "asteroid",
    x,
    y,
    dx: Math.random() * 5 - 2,
    dy: Math.random() * 5 - 2,
    radius,
    text,
    render() {
      this.context.strokeStyle = "rgba(13, 13, 13, 1)";
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI * 2);
      this.context.stroke();
      this.context.textAlign = "center";
      this.context.strokeStyle = getRandomColor();
      this.context.font = radius + "px Arial";
      this.context.strokeText(this.text, 0, 5);
    },
  });
  sprites.push(asteroid);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function asteroidCreator(top) {
  for (let i = 0; i < top; i++) {
    let addPoints = 0;
    let ran = getRandomArbitrary(0, 2);
    if (ran > 1) {
      addPoints = 600;
    }
    createAsteroid(
      getRandomArbitrary(20, 900),
      getRandomArbitrary(50, 100) + addPoints,
      getRandomArbitrary(30, 50),
      "404",
    );
  }
}

asteroidCreator(6);

kontra.initKeys();

function createShip() {
  let ship = kontra.Sprite({
    type: "ship",
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 6,
    dt: 0,
    render() {
      this.context.strokeStyle = "yellow";
      this.context.beginPath();
      this.context.moveTo(-3, -5);
      this.context.lineTo(12, 0);
      this.context.lineTo(-3, 5);
      this.context.closePath();
      this.context.stroke();
    },
    update() {
      if (kontra.keyPressed("left") || kontra.keyPressed("a")) {
        this.rotation += kontra.degToRad(-4);
      } else if (kontra.keyPressed("right") || kontra.keyPressed("d")) {
        this.rotation += kontra.degToRad(4);
      }

      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);
      if (kontra.keyPressed("up") || kontra.keyPressed("w")) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
      } else {
        this.ddx = this.ddy = 0;
      }
      this.advance();

      if (this.velocity.length() > 3) {
        this.dx *= 0.95;
        this.dy *= 0.95;
      }

      this.dt += 1 / 60;
      if (kontra.keyPressed("space") && this.dt > 0.10) {
        this.dt = 0;
        let bullet = kontra.Sprite({
          color: "cyan ",

          x: this.x + cos * 20,
          y: this.y + sin * 20,

          dx: this.dx + cos * 5,
          dy: this.dy + sin * 5,

          ttl: 80,

          radius: 5,
          width: 5,
          height: 5,
        });
        let bullet2 = kontra.Sprite({
          color: "red",

          x: this.x + cos * 20,
          y: this.y + sin * 20,

          dx: this.dx - cos * 5,
          dy: this.dy - sin * 5,

          ttl: 40,

          radius: 5,
          width: 5,
          height: 5,
        });

        sprites.push(bullet);
        aa.play( 'laser' );
        sprites.push(bullet2);
      }
    },
  });
  sprites.push(ship);
}

createShip();

let top_ribbon = 300;

function checkBorder(sprite) {
  if (sprite.x < -sprite.radius) {
    sprite.x = canvas.width + sprite.radius;
  } else if (sprite.x > canvas.width + sprite.radius) {
    sprite.x = 0 - sprite.radius;
  }

  if (sprite.y < -sprite.radius) {
    sprite.y = canvas.height + sprite.radius;
  } else if (sprite.y > canvas.height + sprite.radius) {
    sprite.y = -sprite.radius;
  }
}

function checkCollision(sprites) {
  for (let i = 0; i < sprites.length; i++) {
    if (sprites[i].type === "asteroid") {
      for (let j = 0; j < sprites.length; j++) {
        if (sprites[j].type !== "asteroid") {
          let asteroid = sprites[i];
          let sprite = sprites[j];
          
          let dx = asteroid.x - sprite.x;
          let dy = asteroid.y - sprite.y;

          if (Math.hypot(dx, dy) < asteroid.radius + sprite.radius) {
            aa.play( 'damage' );
            asteroid.ttl = 0;
            sprite.ttl = 0;
            if (sprites[j].type === "ship") {
              gameOver = true;
            }

            if (asteroid.radius > 30) {
              aa.play( 'damage' );
              points += 20;
              for (let i = 0; i < 2; i++) {
                createAsteroid(
                  asteroid.x,
                  asteroid.y,
                  asteroid.radius / 1.5,
                  "404",
                );
              }
            } else if (asteroid.radius > 20 && asteroid.radius <= 30) {
              points += 50;
              aa.play( 'damage' );
              for (let i = 0; i < 2; i++) {
                createAsteroid(
                  asteroid.x,
                  asteroid.y,
                  asteroid.radius / 1.5,
                  getRandomLetter(),
                );
              }
            }

            break;
          }
        }
      }
    }
  }
}

function playerScore(){
  scoreTable.clearRect(0, 0, sTable.width, sTable.height); 
  scoreTable.lineWidth = "0.1";
  scoreTable.fillStyle = "rgba(13, 13, 13, 1)";
  scoreTable.strokeStyle = "white";
  scoreTable.rect(0, 0, sTable.width, sTable.height);
  scoreTable.font = "22px Arial";
  scoreTable.fillStyle = "#f4511e";
  scoreTable.textAlign = "left";
  scoreTable.fillText("Asteroids 404", 24, sTable.height/3);
  scoreTable.textAlign = "center";
  scoreTable.fillText("Level: " + level, sTable.width/2, sTable.height/3);
  scoreTable.fillText("Points: " + points, sTable.width/2, sTable.height/3 * 2+10);
  scoreTable.textAlign = "right";
  scoreTable.fillText("Record Level: " + maxLevel, sTable.width -24 , sTable.height/3);
  scoreTable.fillText("Record Points: " + maxPoints, sTable.width -24, sTable.height/3 * 2+10);
}




function checkLevel(sprites) {
  let remaining_asteroids = 0;
  for (let i = 0; i < sprites.length; i++) {
    if (sprites[i].type === "asteroid") {
      remaining_asteroids++;
    }
  }

  if (remaining_asteroids < 3) {
    level++;
    asteroidCreator(2 * level);
  }
}



let loop = kontra.GameLoop({
  update() {
    sprites.map((sprite) => {
      sprite.update();

      checkBorder(sprite);
    });

    checkCollision(sprites);

    sprites = sprites.filter((sprite) => sprite.isAlive());

    checkLevel(sprites);
    
    playerScore();

    if(gameOver){
      aa.play( 'powerup' );
      menuGameOver();
      menu.style.visibility = 'visible';
      btMenu.style.visibility = 'visible';
      if(maxPoints < points){
        ls.setItem('maxLevel', level);
        ls.setItem('maxPoints', points);
      }
      loop.stop();
    }

  },
  render() {
    sprites.map((sprite) => sprite.render());
  },
});

function startGame(){
  menu.style.visibility = 'visible';
  var timeleft = 10;
  var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      menu.style.visibility = 'hidden';
      aa.play( 'powerup' );
      loop.start();
    } else {
      menuStart(timeleft);
    }
    timeleft--;
  }, 1000);
}

btMenu.addEventListener("click", function() {
  menu.style.visibility = 'hidden';
  btMenu.style.visibility = 'hidden';
  sprites = [];
  gameOver = false;
  level = 1;
  points = 0;
  maxLevel = ls.getItem('maxLevel') == null ? 0 : ls.getItem('maxLevel') ;
  maxPoints = ls.getItem('maxPoints') == null ? 0 : ls.getItem('maxPoints');
  asteroidCreator(6);
  createShip();
  loop.start();
});

startGame();
