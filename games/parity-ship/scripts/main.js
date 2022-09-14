console.log('main.js');

//////////////////////////////////////////////////////////////////////

/*
 * Returns an integer between min and max (both inclusive)
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}

/*
 * returns random value between {number} min (inclusive) and {number} max (exclusive)
 */
function randomInInterval(min, max) {
    return Math.random() * (max-min) + min;
}

var Vector2 = {};
Vector2.distance = function(v1, v2) {
	return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
};

// 3 functions about changing a rule of a css class
// http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
// which was mentioned at
// http://stackoverflow.com/questions/1409225/changing-a-css-rule-set-from-javascript

// 70 slashes
//////////////////////////////////////////////////////////////////////

function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/*
 * Returns a random color object
 * @param {number} [alpha=1] - alpha value of color
 */
Color.random = function(alpha) {
    var r = randomInt(0, 255);
    var g = randomInt(0, 255);
    var b = randomInt(0, 255);

    var a;
    if (typeof alpha == 'number') {
        a = alpha;
    }
    else {
        a = 1;
    }

    return new Color(r, g, b, a);
}

Color.prototype.toString = function(excludeA) {
    if (excludeA) {
        return 'rgb('+this.r+','+this.g+','+this.b+')';
    }

    return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
};

Color.prototype.floored = function(includeA) {
	var c = new Color(Math.floor(this.r), Math.floor(this.g), Math.floor(this.b), this.a);

	if (includeA) {
		c.a = Math.floor(c.a);
	}

	return c;
};

Color.prototype.inverse = function(invertA) {
    if (invertA) {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b, 1 - this.a);
    }

    return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
};

Color.prototype.invert = function(invertA) {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;

    if (invertA) {
        this.a = 1 - this.a;
    }
};

Color.prototype.clamp = function() {
    // console.log('clamp');
    var self = this;
    ['r', 'g', 'b'].forEach(function(letter, index, letters) {
        // console.log(letter, Math.min(this[letter], 255), Math.max(Math.min(this[letter], 255), 0));
        self[letter] = Math.max(Math.min(self[letter], 255), 0);
    });

    this.a = Math.max(Math.min(this.a, 1), 0);
};

Color.prototype.clone = function() {
	return new Color(this.r, this.g, this.b, this.a);
};

//////////////////////////////////////////////////////////////////////

function Game() {
    this.aspectRatioWidth = 16;
    this.aspectRatioHeight = 9;

    this.canvasContainer = document.querySelector('body');

    this.menus = {};
    this.currentMenu;
    this.menuShowDuration = '0.5s';
    this.menuHideDuration = '0.2s';

    this.shootInterval = 400;// min time between shots in milliseconds
    this.shootTime = 0;

    this.newShipInterval = 140;// time between new ship spawned in milliseconds
    this.newShipTime = 0;

	this.fadeBarTime = 800;
	this.cpFadeTime = 300;

    this.minShipSpeed = 0.060;
    this.maxShipSpeed = 0.140;
	this.shipTopSpeed = this.maxShipSpeed;
	// max ship speed will be lowered at start of game and raised back up
	// to shipTopSpeed in increments over time

    this.minShipRadius = 2;
    this.maxShipRadius = 5;

	this.newPlanetInterval = 90;
	this.newPlanetTime = 0;

	this.minPlanetLength = 2;
	this.maxPlanetLength = 6;

    this.highScore = 0;
}

Game.prototype.hideMenu = function(menu) {
    var buttons = menu.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    menu.style['transition-duration'] = this.menuHideDuration;

    menu.style.top = '-100%';
    menu.style.bottom = '100%';
};

Game.prototype.showMenu = function(menu) {
    var buttons = menu.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }

    menu.style['transition-duration'] = this.menuShowDuration;

    menu.style.top = '0';
    menu.style.bottom = '0';
};

/*
 * Change the menu. Hides current menu if menu arg is undefined
 */
Game.prototype.changeMenu = function(menu) {
    if (this.currentMenu != undefined) {
        this.hideMenu(this.currentMenu);
    }

    if (menu != undefined) {
        this.showMenu(menu);

        this.currentMenu = menu;
    }
};

Game.prototype.aspectRatio = function() {
    return this.aspectRatioWidth / this.aspectRatioHeight;
};

// coordinates are in vh, so this returns bottom y value of canvas in vh
Game.prototype.maxY = function() {
    return this.canvas.height / this.vh;
}

Game.prototype.isVhPosOnCanvas = function(pos) {
    if (pos.x >= 0 && pos.x <= 100 && pos.y >= 0 && pos.y <= this.maxY()) {
        return true;
    }

    return false;
};

Game.prototype.tryShoot = function(pos) {
    // console.log('tryShoot');
    var currentTime = new Date().getTime();

    if (currentTime - this.shootTime > this.shootInterval) {
        var packet = new CleanPacket(pos);

        this.cleanPackets.push(packet);

        this.shootTime = currentTime;
    }
};

Game.prototype.startGame = function() {
    this.changeMenu();//hide current menu

    this.player = new Player();

    this.ships = [];
    this.cleanPackets = [];//shot by player
    this.corrPackets = [];//shot by ships
	this.colorChangers = [];
    this.fadeBars = [];
	this.planets = [];

	//check if planets should had shadow
	this.blurCheckbox = document.querySelector('#planet-blur');
	this.planetBlur = this.blurCheckbox.checked;

	this.shipSpeedStepUps = [];
	// ^ array of setTimeouts that will ramp up maxShipSpeed.
	//   A list of these must be kept so that they can be stopped if
	//   game ends before all have happened

    this.score = 0;

    this.canvas = document.createElement('canvas');
    this.canvasCont = document.querySelector('#canvas-container');
    this.canvasContAspRatio = this.canvasCont.offsetWidth / this.canvasCont.offsetHeight;

    if (this.aspectRatio() == this.canvasContAspRatio) {
        this.canvas.width = this.canvasCont.offsetWidth;
        this.canvas.height = this.canvasCont.offsetHeight;
    }
    else if (this.aspectRatio() < this.canvasContAspRatio) {
        this.canvas.height = this.canvasCont.offsetHeight;
        this.canvas.width = this.canvas.height * this.aspectRatio();
    }
    else if (this.aspectRatio > this.canvasContAspRatio) {
        this.canvas.width = this.canvasCont.offsetWidth;
        this.canvas.height = this.canvas.width / this.aspectRatio();
    }

    this.canvas.style.width = this.canvas.width;
    this.canvas.style.height = this.canvas.height;

    this.ctx = this.canvas.getContext('2d');

    // clear canvas container and add canvas
    this.canvasCont.innerHTML = '';
    this.canvasCont.appendChild(this.canvas);

    game.vh = game.canvas.width/100;

    // game.ctx.save();
    // game.ctx.scale(game.vh, game.vh);
    //
    // game.player.draw(game.ctx);
    //
    // game.ctx.restore();
    document.addEventListener('mousemove', TrackMouse);
	setTimeout(function(){document.addEventListener('click', ShootMouse);}, 100);

    game.currentTime = new Date().getTime();

	game.looping = true;

	//////////// Ease up max ship speed
	//game.maxShipSpeed
	var interval = 1000;//milliseconds between step ups
	var deltaSpeed = 0.012;
	var numIntervals = Math.floor( (game.shipTopSpeed - game.minShipSpeed) / deltaSpeed );

	game.maxShipSpeed = game.shipTopSpeed - (numIntervals * deltaSpeed);

	// numIntervals-1 because the final interval will set game.maxShipSpeed t0 game.shipTopSpeed
	for (var i = 0; i < numIntervals-1; i++) {
		var to = window.setTimeout(function() {
			game.maxShipSpeed += deltaSpeed;

			// console.log('g.mSS', game.maxShipSpeed);
		}, (i+1) * interval);

		game.shipSpeedStepUps.push(to);
		// ^ these will be cleared when game ends in case
		//   game ended before all steps done
	}

	var to = window.setTimeout(function() {
		game.maxShipSpeed = game.shipTopSpeed;
	}, numIntervals * interval);

	game.shipSpeedStepUps.push(to);

	////////////

    loop();
};

// debug ship
//var ship = new Ship({x: 50, y: 50}, 5, 3, new Color(99, 99, 99, 1), {x: -0.002, y: 0});
function loop() {
    game.newTime = new Date().getTime();
    game.dt = game.newTime - game.currentTime;

    // check if should make new ship
    if (game.newTime - game.newShipTime > game.newShipInterval) {
        // make new ship
        var x = Math.random() * (3+game.maxShipRadius) + 100;
        var y = Math.random() * game.maxY();

        var radius = randomInInterval(game.minShipRadius, game.maxShipRadius);
        var sideLength = randomInInterval(0.3, 1.2) * radius;

        var speed = randomInInterval(game.minShipSpeed, game.maxShipSpeed);
        speed *= -1;//so that ship goes to left;

        // console.log('ship', x, y);

        var ship = new Ship({x: x, y: y}, radius, sideLength, Color.random(randomInInterval(0.7, 0.9)), {x: speed, y: 0});

        game.ships.push(ship);

        game.newShipTime = game.newTime;
    }

	// check if should make new planet
	if (game.newTime - game.newPlanetTime > game.newPlanetInterval) {
		// make a new planet

		var x = Math.random() * (3+game.maxPlanetLength) + 100;
        var y = Math.random() * game.maxY();

		var sideLength = randomInInterval(game.minPlanetLength, game.maxPlanetLength);
		var color = Color.random(1);

		var mult = 0.25;
		color.r *= mult;
		color.g *= mult;
		color.b *= mult;

		var speed = 0.010 * sideLength;
		speed *= -1;// so planet goes to left

		var planet = new Planet({x: x, y: y}, sideLength, color, {x: speed, y: 0});

		game.planets.push(planet);

		game.newPlanetTime = game.newTime;
	}

	// move planets
	game.planets.forEach(function(planet, index, planets) {
		var dx = planet.speed.x * game.dt;
        var dy = planet.speed.y * game.dt;

        planet.pos.x += dx;
        planet.pos.y += dy;
	});

    // move ships
    game.ships.forEach(function(ship, index, ships) {
        var dx = ship.speed.x * game.dt;
        var dy = ship.speed.y * game.dt;

        ship.pos.x += dx;
        ship.pos.y += dy;
    });

	// move clean packets
	game.cleanPackets.forEach(function(packet, index, packets) {
		var dx = packet.speed.x * game.dt;

		packet.pos.x += dx;
	});

    // remove ships out of bounds
    game.ships.forEach(function(ship, index, ships) {
        // if ship is left of screen or (ship is right and screen and has been hit)
        if (ship.pos.x < 0 || (ship.pos.x > 100 && ship.hits > 0)) {
            game.ships.splice(game.ships.indexOf(ship), 1);
        }
    });

	//remove planets out of bounds
	game.planets.forEach(function(planet, index, planets) {
		if (planet.pos.x < 0){
			game.planets.splice(game.planets.indexOf(planet), 1);
		}
	});

	// check for CleanPacket-ship collisions;
	game.cleanPackets.forEach(function(packet, packetIndex, packets) {
		if (!packet.hit) {
			game.ships.some(function(ship, shipIndex, ships) {
				if (!ship.hit) {
					var distance = Vector2.distance(packet.pos, ship.pos);
					var colDistance = packet.radius + ship.radius;

					if (distance < colDistance) {
						// a ship is contacted!
						ship.hit = true;
						ship.speed.x *= -1.1;

						setTimeout(function() {
							ship.speed.x *= 1.8;
						}, 150);

						packet.hit = true;
						packet.speed.x *= 0.3;

						// packet fades away
						var cc = new ColorChanger(packet.color.clone(), new Color(0, 0, 0, 0), game.cpFadeTime, packet);

						cc.callback = function() {
							game.colorChangers.splice(game.colorChangers.indexOf(this), 1);

							game.cleanPackets.splice(game.cleanPackets.indexOf(packet), 1);
						};

						game.colorChangers.push(cc);

						var f = new FadeBar(game.player, ship, 2.5, ship.innerColor.clone());

						var fFinalColor = new Color(
							(ship.innerColor.r + 255)/2,
							(ship.innerColor.g + 255)/2,
							(ship.innerColor.b + 255)/2,
							0);

						// fadeBar fades
						var ccFadeBar = new ColorChanger(ship.innerColor.clone(), fFinalColor, game.fadeBarTime, f);

						ccFadeBar.callback = function() {
							game.colorChangers.splice(game.colorChangers.indexOf(this), 1);

							game.fadeBars.splice(game.fadeBars.indexOf(this.target), 1);
						};

						game.fadeBars.push(f);
						game.colorChangers.push(ccFadeBar);

						// player changes color;
						var ccPlayer = new ColorChanger(game.player.color.clone(), ship.innerColor.clone(), game.fadeBarTime, game.player);

						ccPlayer.callback = function() {
							game.colorChangers.splice(game.colorChangers.indexOf(this), 1);
						};

						game.colorChangers.push(ccPlayer);

						game.score += 1;

						return true;//break. no need to check rest of ships
					}
				}
			});
		}
	});

	//check for player-ship collisions
	game.ships.some(function(ship, index, ships) {
		var distance = Vector2.distance(game.player.pos, ship.pos);
		var colDistance = game.player.radius + ship.radius;

		// console.log(distance, colDistance);
		if (distance < colDistance) {
			//game over
			console.log('Game over!');
			game.looping = false;

			document.removeEventListener('mousemove', TrackMouse);
			document.removeEventListener('click', ShootMouse);

			// stop ship speed step ups that are left
			game.shipSpeedStepUps.forEach(function(step, index, steps) {
				// console.log('clearTimeout');
				window.clearTimeout(step);
			});

			if (game.score > game.highScore) {
				game.highScore = game.score;
				document.querySelector('#new').innerHTML = 'New&nbsp;';
			}
			else {
				document.querySelector('#new').innerHTML = '';
			}

			document.querySelector('#score').innerHTML = game.score;
			document.querySelector('#high-score').innerHTML = game.highScore;

			var interval = 10;//milliseconds
			var numIntervals = 100;
			// red overlay
			for (var i = 0; i < numIntervals; i++) {
				setTimeout(function() {
					game.ctx.save();
					game.ctx.fillStyle = 'rgba(230, 54, 60, 0.01)';
					game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
					game.ctx.restore();
				}, i * interval);
			}

			setTimeout(function() {
				game.changeMenu(game.menus.end);
			}, interval * numIntervals + 500);

			// make canvas overlay closer to menu color
			for (var i = 0; i < numIntervals; i++) {
				setTimeout(function() {
					game.ctx.save();
					game.ctx.fillStyle = 'rgba(80, 100, 255, 0.01)';
					game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
					game.ctx.restore();
				}, (interval * numIntervals + 500) + i * interval);
			}

			return true;//stop checking ships
		}
	});

	game.colorChangers.forEach(function(cc, index, ccs) {
		// console.log(cc.target.color.toString());
		cc.change(game.dt);
	});

	//invert inner color of player before drawing
	game.player.innerColor = game.player.color.inverse();

    game.ctx.save();
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.ctx.scale(game.vh, game.vh);

	game.planets.forEach(function(planet, index, planets) {
		planet.draw(game.ctx, game.planetBlur);
	});

	game.cleanPackets.forEach(function(packet, index, packets) {
        packet.draw(game.ctx);
    });

	game.fadeBars.forEach(function(bar, index, bars) {
		bar.draw(game.ctx);
	});

    game.player.draw(game.ctx);

    game.ships.forEach(function(ship, index, ships) {
        ship.draw(game.ctx);
    });

    game.ctx.restore();

    // game.currentTime = new Date().getTime();
	game.currentTime = game.newTime;

	if (game.looping) {
    	window.requestAnimationFrame(loop);
	}
}
// Return event position relative to canvas in vh unit
function EventPos(e) {
    var pos = {};
    pos.x = e.clientX-game.canvas.offsetLeft;
    pos.y = e.clientY-game.canvas.offsetTop;

    // convert to vh
    pos.x = pos.x / game.vh;
    pos.y = pos.y / game.vh;

    return pos;
}

function TrackMouse(e) {
    // console.log('mouse', e.clientX, e.clientY);//mouse position
    // http://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    // console.log('mouse', e.clientX-game.canvas.offsetLeft, e.clientY-game.canvas.offsetTop);

    var pos = EventPos(e);

    if (game.isVhPosOnCanvas(pos)) {
        game.player.pos = pos;
    }
}

function ShootMouse(e) {
    var pos = EventPos(e);

    game.tryShoot(pos);
}

/*
 * @param {number} time - in milliseconds
 */
function ColorChanger(initColor, finalColor, time, target) {
	this.initColor = initColor;
	this.finalColor = finalColor;

    // value to change the applicable color component by per millisecond
    // this.dr = finalColor.r - initColor.r / time;//replaced by forEach
    var self = this;
    ['r', 'g', 'b', 'a'].forEach(function(letter, index, letters) {
        self['d'+letter] = (finalColor[letter] - initColor[letter]) / time;
    });

    this.totalTime = time;
    this.timeLeft = this.totalTime;
	this.target = target;

	// to call when totalTime changed
	this.callback = function() {console.log('Done');};
}

/*
 * @param {number} dt - in milliseconds
 */
ColorChanger.prototype.change = function(dt) {
	if (this.timeLeft > 0) {
		// console.log('dt', dt);

		if (dt < this.timeLeft) {
			var self = this;
		    ['r', 'g', 'b', 'a'].forEach(function(letter, index, letters) {
				self.target.color[letter] += self['d'+letter] * dt;
			});

			// console.log('bc', this.target.color);
			this.target.color.clamp();
			// console.log('ac', this.target.color);

			this.timeLeft -= dt;
		}
		else {//dt is greater than or equal to timeLeft
			this.target.color = this.finalColor;

			this.timeLeft = 0;

			this.callback();
		}
	}
};

function FadeBar(obj1, obj2, width, color) {
    this.obj1 = obj1;
	this.obj2 = obj2;
    this.width = width;

	this.color = color;
}

FadeBar.prototype.draw = function(ctx) {
	ctx.save();

	ctx.beginPath();
	ctx.moveTo(this.obj1.pos.x, this.obj1.pos.y);
	ctx.lineTo(this.obj2.pos.x, this.obj2.pos.y);

	ctx.lineWidth = this.width;
	ctx.strokeStyle = this.color.floored().toString();
	// console.log('fs', this.color.floored().toString());

	ctx.stroke();

	ctx.restore();
};

function Player() {
    this.pos = {}
    this.pos.x = 10;
    this.pos.y = (100/16) * (9/2);// halfway down
    // this.pos.x = 0;
    // this.pos.y = 0;

    this.radius = 5;
    this.sideLength = 3;//side length of inner triangle
    this.color = new Color(255, 255, 255, 1);//outer color
    this.innerColor = this.color.inverse();

    this.hits = 0;//number of times hit by corrupt data
}
/*
 * @param {number} vh - 1% of horizontal length of canvas
 */
Player.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    // ctx.scale(1/ratio, 1/ratio);
    this._draw(ctx);

    ctx.restore();
};

Player.prototype._draw = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color.floored().toString();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    // Half distance across triangle horizontally
    var halfHorizontal = (this.sideLength / 2) * Math.sqrt(3) / 2;
    ctx.moveTo(-halfHorizontal, -this.sideLength / 2);
    ctx.lineTo(halfHorizontal, 0);
    ctx.lineTo(-halfHorizontal, this.sideLength / 2);
    ctx.fillStyle = this.innerColor.floored().toString();
    ctx.fill();
    ctx.closePath();

    ctx.restore();
};
// speed is vector2d with speeds per millisecond
function Ship(pos, radius, sideLength, color, speed) {
    this.pos = pos;
    this.radius = radius;
    this.sideLength = sideLength;
    this.outerColor = color;
    this.innerColor = color.inverse();
    this.innerColor.a = 1;//make inner fully opaque

    this.speed = speed;
    this.hit = false;
}

Ship.prototype.draw = function(ctx) {
    //console.log('draw');
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    this._draw(ctx);

    ctx.restore();
}

Ship.prototype._draw = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.outerColor.toString();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(-this.sideLength/2, -this.sideLength/2, this.sideLength, this.sideLength);
    ctx.fillStyle = this.innerColor.toString();
    ctx.fill();
    ctx.closePath();

    ctx.restore();
};

function CleanPacket(pos) {
    this.pos = pos;

	this.radius = 2;
	this.speed = {x: 0.060, y: 0};
	this.color = new Color(240, 70, 96, 0.9);

	this.hit = false;
}

CleanPacket.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    this._draw(ctx);
    ctx.restore();
};

CleanPacket.prototype._draw = function(ctx) {
    // console.log('cl pa _draw');
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color.floored().toString();
	// console.log('fs', ctx.fillStyle);
	// console.log('cpc', this.color.toString());
    ctx.fill();

    ctx.restore();
}

function Planet(pos, sideLength, color, speed) {
	this.pos = pos;
	this.sideLength = sideLength;
	this.color = color;
	this.speed = speed;
}

Planet.prototype.draw = function(ctx, drawShadow) {
	ctx.save();
	ctx.fillStyle = this.color.floored().toString();

	if (drawShadow) {
		ctx.shadowColor = this.color.floored().toString();
		ctx.shadowBlur = 4 * this.sideLength;
	}

	ctx.fillRect(this.pos.x, this.pos.y, this.sideLength, this.sideLength);
	ctx.restore();
};

//////////////////////////////////////////////////////////////////////

var game = new Game();

['main', 'about', 'pause', 'end'].forEach(function(term, index, array) {
    game.menus[term] = document.querySelector('#'+term+'-menu');
});

document.querySelector('#play-button').addEventListener('click', function() {
    game.startGame();
});

document.querySelector('#about-button').addEventListener('click', function() {
    game.changeMenu(game.menus.about);
});
document.querySelector('#back-button').addEventListener('click', function() {
    game.changeMenu(game.menus.main);
});

document.querySelector('#again-button').addEventListener('click', function() {
	game.startGame();
});

document.querySelector('#return-button').addEventListener('click', function() {
	game.changeMenu(game.menus.main);
});

game.changeMenu(game.menus.main);
