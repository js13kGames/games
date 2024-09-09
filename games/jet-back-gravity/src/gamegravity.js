

  (function() {
    kontra.init("game-canvas-10");
    var canvas = document.querySelector("#game-canvas-10");
    canvas.width = 600;
    canvas.height = 600;
    var context = canvas.getContext("2d");

    //context.font = "30px Arial";
    //context.fillText("Hello World", 10, 50);

    // exclude-code:start
  let { init, Sprite, GameLoop, initPointer, pointer , onPointerDown, pointerPressed} = kontra;
  // exclude-code:end

  initPointer();



  let sprites = [];

  function createAsteroid(x,y,radius) {
    let asteroid = kontra.Sprite({
      type:'asteroid',
      x: x,
      y: y,
      dx: (Math.random() * 2 - 1)/2,
      dy: (Math.random() * 2)/2,
      radius: radius,

      render() {
        this.context.strokeStyle = 'green';
        this.context.beginPath();  // start drawing a shape
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();     // outline the circle

      }
    });
    sprites.push(asteroid);
  }

  let planetX = kontra.Sprite();
  function createPlanet(x,y,radius,mass) {
    let planet = kontra.Sprite({
      type:'planet',
      x: x,
      y: y,
      dx: 0, // Math.random() * 0.5 - 0.25,
      dy: 0, // Math.random() * 0.5 - 0.25,
      radius: radius,
      width: radius, ///hack to make collision work simple
      mass: mass,  /// would measure attraction power
      damagetaken: 0, // how many asteroids damages

      render() {
        this.context.strokeStyle = 'blue';
        this.context.beginPath();  // start drawing a shape
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();     // outline the circle
        context.fill(); //fill the circle
      }
    });
    sprites.push(planet);
    planetX = planet; /// lazy global
  }
  createPlanet(300,300,10,0.005);

  let level=0;

  function moveToNewLevel(){
    if (ship.winner == 1){
      ///
    } else {
      level++;

      if (level == 1) {
        for (var i = 0; i < 4; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*50+5;
          createAsteroid(xa,ya,size);
        }
      }
      else if (level == 2) {
        for (var i = 0; i < 6; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*50+5;
          createAsteroid(xa,ya,size);
        }
      }
      else if (level == 3) {
        for (var i = 0; i < 10; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*50+5;
          createAsteroid(xa,ya,size);
        }
      }
      else if (level == 4) {
        for (var i = 0; i < 4; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*150+5;
          createAsteroid(xa,ya,size);
        }
      }
      else if (level == 5) {
        for (var i = 0; i < 6; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*200+5;
          createAsteroid(xa,ya,size);
        }
      }
      else if (level == 6) {
        for (var i = 0; i < 120; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*20+5;
          createAsteroid(xa,ya,size);
        }
      }

      else if (level == 7) {
        for (var i = 0; i < 120; i++) {
          let xa=Math.random()*canvas.width/4+canvas.width/4*3;
          let ya=Math.random()*canvas.height;
          let size = Math.random()*20+5;
          createAsteroid(xa,ya,size);
        }

      for (var i = 0; i < 6; i++) {
        let xa=Math.random()*canvas.width/4;
        let ya=Math.random()*canvas.height;
        let size = Math.random()*200+5;
        createAsteroid(xa,ya,size);
        }

      for (var i = 0; i < 6; i++) {
        let xa=Math.random()*canvas.width;
        let ya=Math.random()*canvas.height/4+canvas.height/4*3;
        let size = Math.random()*150+5;
        createAsteroid(xa,ya,size);
        }

      for (var i = 0; i < 10; i++) {
        let xa=Math.random()*canvas.width;
        let ya=Math.random()*canvas.height/4;
        let size = Math.random()*50+5;
        createAsteroid(xa,ya,size);
        }

      }
      else {
        ship.winner = 1;
      }
    }

  }



  let spriteX = Sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'red',  // fill color of the sprite rectangle
    width: 20,     // width and height of the sprite rectangle
    height: 40,
    dx: 2,          // move the sprite 2px to the right every frame
    dy: 2
  });
  /// no mre sprites
  ///sprites.push(spriteX);

  kontra.initKeys();
  // helper function to convert degrees to radians
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }


  let ship = kontra.Sprite({
    // all this overridden later function
    type:'ship',
    x: 150,
    y: 150,
    width: 6,  // we'll use this later for collision detection
    rotation: 120,  // 0 degrees is to the right
    dt: 0,
    kills: 0,
    damagetaken: 0,
    killmod:0,
    winner: 0,

    render() {
      this.context.save();

      // transform the origin and rotate around it
      // using the ships rotation
      this.context.translate(this.x, this.y);
      this.context.rotate(degreesToRadians(this.rotation));

      // draw a right facing triangle
      this.context.strokeStyle = 'red';
      this.context.beginPath();
      this.context.moveTo(-3, -5);
      this.context.lineTo(12, 0);
      this.context.lineTo(-3, 5);
      this.context.closePath();
      this.context.stroke();
      this.context.restore();
      this.context.fillText("Kills Count:  " + this.kills , 10, 30);
      this.context.fillText("Damage Taken: " + this.damagetaken , 10, 40);
      this.context.fillText("Weapon Power: " + this.killmod, 10, 50);
      this.context.fillText("Planet damaged: " + planetX.damagetaken, 10, 60);
      this.context.fillText("Asteroids Left: " + ship.asteroidleft, 10, 70);
      this.context.fillText("Level: " + level, 10, 80);


      /// Winning Message
      if (this.winner == 1) {
        this.context.fillText("!!!!!CONGRATULATIONS!!!!!!", 200, 250);
        this.context.fillText("Our Planet got " + planetX.damagetaken + " damage", 200, 270);
        if (planetX.damagetaken == 0) {
          this.context.fillText("It is perfect!!!", 200, 290);
        } else if (planetX.damagetaken < 1000) {
          this.context.fillText("It is very good!!", 200, 290);
        } else if (planetX.damagetaken < 6000) {
          this.context.fillText("It is not so bad!", 200, 290);
        } else if (planetX.damagetaken < 10000) {
          this.context.fillText("Well.... Hope we can handle that.", 200, 290);
        } else {
          this.context.fillText("We need to start looking for a new Planet soon ... This one is over.", 200, 290);
        }
      }

    },
    update() {
      // rotate the ship left or right
      if (kontra.keyPressed('left')) {
        this.rotation += -4
      }
      else if (kontra.keyPressed('right')) {
        this.rotation += 4
      }

      if(kontra.pointerPressed('left')) {
        this.rotation = Math.atan( (pointer.y - ship.y)/(+pointer.x - ship.x) )* 180 / Math.PI;
        if (pointer.x - ship.x < 0) {
          this.rotation+=180;
        }

        ///console.log(pointer.y - ship.y, "y", pointer.x - ship.x, "x", this.rotation,"r");
      }

      // move the ship forward in the direction it's facing
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));

      if (kontra.keyPressed('up') || kontra.keyPressed('space') || kontra.pointerPressed('left')) {
        let big_bullet = kontra.Sprite({
          type: 'big-bullet',
          // start the bullet on the ship at the end of the triangle
          x: this.x + cos * 12,
          y: this.y + sin * 12,
          // move the bullet slightly faster than the ship
          // and spread a little
          dx: this.dx + 2 * this.killmod * Math.cos(degreesToRadians(this.rotation + 2*this.killmod* (Math.random()-0.5))),
          dy: this.dy + 2* this.killmod * Math.sin(degreesToRadians(this.rotation + 2*this.killmod* (Math.random()-0.5))) ,
          // live only 50 frames
          ttl: 50,
          // bullets are small
          width: 2,
          height: 2,
          radius : this.killmod,
          power : this.killmod,
          color: 'red',
          render() {
            this.context.strokeStyle = 'black';
            this.context.beginPath();  // start drawing a shape
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            this.context.stroke();     // outline the circle
            context.fill(); //fill the circle
          }
        });
        sprites.push(big_bullet);

        /// aaaannd move back
        this.ddx = - cos * 0.01 * this.killmod;
        this.ddy = - sin * 0.01 * this.killmod;
      }
      else if (kontra.keyPressed('down')) {

      }
      else {
        this.ddx = this.ddy = 0;
      }

      this.advance();
      // set a max speed
      const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      if (magnitude > 5) {
        this.dx *= 0.95;
        this.dy *= 0.95;
      }


      // allow the player to fire no more than 1 bullet every 1/4 second
      this.dt += 1/60;

      this.killmod = Math.log10(Math.max(this.kills,1))/20 + 1;

      if (kontra.keyPressed('down') && this.dt > 0.25  ) {
        this.dt = 0;

        for (let i=0; i<this.killmod; i++) {

          let bullet = kontra.Sprite({
            type: 'bullet',
            // start the bullet on the ship at the end of the triangle
            x: this.x + cos * 12,
            y: this.y + sin * 12,
            // move the bullet slightly faster than the ship
            // and spread a little
            dx: this.dx + 2* this.killmod * Math.cos(degreesToRadians(this.rotation + 2*this.killmod* (Math.random()-0.5))),
            dy: this.dy + 2* this.killmod * Math.sin(degreesToRadians(this.rotation + 2*this.killmod* (Math.random()-0.5))) ,
            // live only 50 frames
            ttl: 50,
            // bullets are small
            width: 2,
            height: 2,
            power : this.killmod,
            color: 'red'
          });
          sprites.push(bullet);
        }


      }
    }
  });

  function createShip(){

    ship.init();
    ship.x = 180;
    ship.y = 180;
    ship.dx = 0.5;
    ship.dy = 0;
    ship.width = 6;  // we'll use this later for collision detection
    ship.rotation = 0;  // 0 degrees is to the right
    ship.dt = 0;
    ship.damagetaken = 0;
    ship.kills = 0;
    ship.asteroidleft = 1;

    sprites.push(ship);
  }

  createShip();

  ///start the game
  moveToNewLevel();

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state

      if (!ship.isAlive()) {
        createShip();
      }





      sprites.map(sprite => {



        sprite.update();

        // glue the borders
        // slow a bit after pass
        if (sprite.x > canvas.width) {
          sprite.x = 0;
          sprite.dx /= 2;
        }
        if (sprite.y > canvas.height) {
          sprite.y = 0;
          sprite.dy /= 2;
        }
        if (sprite.x < 0) {
          sprite.x = canvas.width;
          sprite.dx /= 2;
        }
        if (sprite.y < 0) {
          sprite.y = canvas.height;
          sprite.dy /= 2;
        }


        if (sprite.type == 'big-bullet'){
          sprite.radius *= 0.95;
        }

      // gravity attraction
        if (sprite.type !== 'planet') {
          let distanceSquared = (sprite.x - planetX.x)**2 + (sprite.y - planetX.y)**2
          let distance = Math.sqrt(distanceSquared);
          let force = planetX.mass / distanceSquared;
          //sprite.dx += (sprite.x - planetX.x) / distance;
          sprite.dx += planetX.mass * (-sprite.x + planetX.x) / distance;
          sprite.dy += planetX.mass * (-sprite.y + planetX.y) / distance;

        }
      });





      // collision detection
      for (let i = 0; i < sprites.length; i++) {

        // only check for collision against asteroids
        if (sprites[i].type === 'asteroid') {

          for (let j = 0; j < sprites.length; j++) {
            // don't check asteroid vs. asteroid collisions
            if (i!=j && sprites[j].type !== 'asteroid' ) {
              let asteroid = sprites[i];
              let sprite = sprites[j];
              // circle vs. circle collision detection
              let dx = asteroid.x - sprite.x;
              let dy = asteroid.y - sprite.y;
              if (Math.sqrt(dx * dx + dy * dy) < asteroid.radius + sprite.width) {
                asteroid.ttl = 0;

                if (sprite.type === 'bullet')
                  ship.kills++;

                if (sprite.type === 'big-bullet')
                    ship.kills++;

                if (sprite.type === 'ship') {
                  ship.kills++;
                  ship.damagetaken += asteroid.radius*3;
                }

                if (sprite.type === 'planet') {
                  sprite.damagetaken += asteroid.radius*3;
                }
                else if (asteroid.radius > sprite.width)
                  sprite.ttl = 0;

                // split the asteroid only if it's large enough
                if (asteroid.radius > 30) {
                  for (var x = 0; x < 3; x++) {
                    createAsteroid(asteroid.x, asteroid.y, asteroid.radius / 2.5);
                  }
                }


                break;
              }
            }
          }
        }
        let asteroidcount = 0;
        for (let i = 0; i < sprites.length; i++)
          if (sprites[i].type === 'asteroid')
            asteroidcount++;

        ship.asteroidleft = asteroidcount;

        if (asteroidcount == 0) {
          /// there is nothing more to do
          moveToNewLevel();
          //alert('GAME OVER!');
        } else {
          ship.winner = 0;
        }

      }

      sprites = sprites.filter(sprite => sprite.isAlive());
    },
    render: function() { // render the game state
        sprites.map(sprite => sprite.render());
    }


    //var canvas = document.getElementById("myCanvas");
    //var ctx = canvas.getContext("2d");
    //context.font = "30px Arial";
    //context.fillText("Hello World", 10, 50);

  });

  loop.start();    // start the game
  })();
