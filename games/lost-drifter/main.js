var canvas = document.getElementById('c')
var ctx = canvas.getContext('2d');
var roundValue = document.getElementById('round-value')
var gameActive
var gamePaused
var roundCount

var b = [];
b[0] = new Image();
b[1] = new Image();
b[2] = new Image();
b[3] = new Image();

var bg = new Image();

window.onload = function()
{
	b[0].src = 'd.png'
	b[1].src = 'l.png'
	b[2].src = 'r.png'
	b[3].src = 'u.png'

	bg.src = 'b.png'
}

var background =
{
	x: 0,
	y: 0,
	speed: 0.5
}

function updateBackground()
{
	background.y += background.speed

	if (background.y > canvas.height)
		background.y = 0;
}

function drawBackground()
{
	// ctx.fillStyle = "#2B2B2B"
	// ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(bg, background.x, background.y)
	ctx.drawImage(bg, background.x, background.y - canvas.height+1)

}

//shorthand
var rand = Math.random
var floor = Math.floor
var min = Math.min
var max = Math.max

function randInt(min, max) 
{ 
	return floor(rand() * (max - min + 1)) + min 
}

// All accepted keys in the game
KEY_CODES = 
{
	//MOVEMENT INPUT

	37: 'left',     // LEFT ARROW
	38: 'up',       // UP ARROW
	39: 'right',    // RIGHT ARROW
	40: 'down',     // DOWN ARROW
	65: 'left',     // A KEY
	87: 'up',       // W KEY
	68: 'right',    // D KEY
	83: 'down',     // S KEY

	//MISC OTHER STUFF
	82: 'r',
	80: 'p'
}

// Input code
KEY_STATUS = {};
for (code in KEY_CODES) 
{
	KEY_STATUS[KEY_CODES[code]] = false;
}

//Note:  Firefox and Opera use charCode instead of keyCode to return which key was pressed apparently
document.onkeydown = function(e) 
{
	var keyCode =  e.keyCode || e.charCode
	
	if (KEY_CODES[keyCode]) 
	{
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = true;
	}

	if (keyCode = 80) {
		pauseGame()
	}
}

document.onkeyup = function(e) 
{
	var keyCode = e.keyCode || e.charCode
	if (KEY_CODES[keyCode]) 
	{
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = false;
	}
}

// Hero setup
var hero = 
{
	x: 0,
	y: 0,
	w: 20,
	h: 20,
	vX: 0,
	vY: 0,
	aX: 0.05,
	aY: 0.05,
}

//Hero movement
function updateHero() 
{
	//loop x axis
	if (hero.x > canvas.width) hero.x = 0
	else if (hero.x < 0) hero.x = canvas.width

	//no leaving canvas or looping on y axis (would go into spawning enemies)
	if (hero.y >= canvas.height - hero.h) {
		hero.y = canvas.height - hero.h
		hero.vY = 0 //avoids having to accelerate out of wall and being trapped then flying away once gained enough
	}
	else if (hero.y <= 0) {
		hero.y = 0
		hero.vY = 0
	}

	//movement input, utilises acceleration for more fluid, shiplike movement
	if (KEY_STATUS.left)
	{
		hero.vX -= hero.aX
	}
	if (KEY_STATUS.right)
	{
		hero.vX += hero.aX
	}
	if (KEY_STATUS.up)
	{
		hero.vY -= hero.aY
	}
	if (KEY_STATUS.down)
	{
		hero.vY += hero.aY
	}

	//actual movement of player
	hero.x += hero.vX
	hero.y += hero.vY
}

var enemies = []

function drawHero() 
{
	//rectangle is used for the player for simple collision detection
	ctx.globalAlpha = 1
	ctx.fillStyle = "rgb(255,255,255)"
	ctx.fillRect(hero.x, hero.y, hero.w, hero.h);

	//booster graphic for player
	if (!gamePaused) {
		if (KEY_STATUS.down) ctx.drawImage(b[0], hero.x+7, hero.y-8)
		if (KEY_STATUS.left) ctx.drawImage(b[1], hero.x+20, hero.y+6)
		if (KEY_STATUS.right) ctx.drawImage(b[2], hero.x-8, hero.y+6)
		if (KEY_STATUS.up) ctx.drawImage(b[3], hero.x+6, hero.y+20)
	}
}

function createEnemy(speed)
{
	//spawn location
	var sX = randInt(-20, canvas.width + 20) //includes a bit off canvas since it 'aims' towards player anyway
	var sY = -3*(rand())	//add a little bit of variance in height i guess for staggering enemies. only above canvas

	//find the angle to use for proportional x and y movement
	var angle = Math.atan2(hero.y - sY, hero.x - sX)

	return {
		x: sX,
		y: sY,

		//non variable direction
		//vX: speed * Math.cos(angle),
		//vY: speed * Math.sin(angle),

		//utilise random speed values to create variance in angle. so everything doesnt just go to where player was at creation
		//vX: randInt(speed-0.5, speed+1.5) * Math.cos(angle),
		// vY: randInt(speed-0.5, speed+1.5) * Math.sin(angle),

		//weighted against angled movement. both varaible in speeds
		vX: rand() > 0.8 ? randInt(speed-0.5, speed+1.5) * Math.cos(angle) : randInt(speed-0.5, speed+1.5),
		vY: rand() > 0.8 ? randInt(speed-0.5, speed+1.5) * Math.sin(angle) : randInt(speed-0.5, speed+1.5),

		w: 20,
		h: 20,
		color: ['#AA3846','#E88E4F', '#E3A922'][randInt(0,2)],	//random colours not grey like actual asteroids as it looked too dull

		//old code for reference
		// y: rand() > 0.5 ? -2 : canvas.height +2,   //was previously going to both up and down areas but decided on above only
		//vX: this.x > hero.x ? -(randInt(speed-1, speed)) : randInt(speed-0.5, speed+1.5),
		//vY: this.y > hero.y ? -(randInt(speed-0.5, speed+1.5)) : randInt(speed-0.5, speed+1.5)//,
		//angle: Math.atan2(this.y - hero.y, this.x - hero.x)
	}
}

function updateEnemy(enemy) 
{
	//removes all enemies off screen from the array
	enemies = enemies.filter(function(e){ if(e.y < canvas.height) return e }); 
	//moves the enemy based on velocity components
	enemy.x += enemy.vX
	enemy.y += enemy.vY
}

function drawEnemy(enemy) 
{
	ctx.globalAlpha = 0.8
	ctx.fillStyle = enemy.color
	ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
	ctx.globalAlpha = 1
}

function update() 
{	
	if (!document.hasFocus() && !gamePaused && gameActive) {
		gamePaused = true
	}

	if (KEY_STATUS.r) startNewGame()

	if (gameActive && !gamePaused) {
		updateBackground()
		updateHero()
		enemies.forEach(updateEnemy)
		enemies.forEach(checkForHeroHit)
	}
}

//basic checking if two rectangles are within eachother
//could be used for projecticles as well
function colliding(rect1, rect2) 
{
	return (rect1.x < rect2.x + rect2.w &&
	rect1.x + rect1.w > rect2.x &&
	rect1.y < rect2.y + rect2.h &&
	rect1.h + rect1.y > rect2.y)
}

function checkForHeroHit(enemy) 
{
	if (enemy && colliding(enemy, hero)) lose()
}

function draw() 
{	
	//sets text on page to the current round number
	roundValue.innerText = roundCount
	// Reset the canvas
	if(!gamePaused) ctx.clearRect(0, 0, canvas.width, canvas.height)
	
	drawBackground()
	if (gameActive  && !gamePaused) //playing
	{
		drawHero()
		enemies.forEach(drawEnemy)
	} 
	else if (!gameActive && !gamePaused) //died, Draw lose screen
	{
		ctx.fillStyle = "#000000"
		ctx.globalAlpha = 0.5
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Better luck next time pilot", 32, 32);
		ctx.font = "14px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText('You survied ' + roundCount + ' waves of asteroids!', 32, 60);
		ctx.font = "16px Helvetica";
		ctx.fillText('Press R to restart', 32, 150);
	}
	else if (gamePaused) //draw pause screen
	{
		//filter on screen
		ctx.fillStyle = "#FFF"
		ctx.globalAlpha = 0.05
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalAlpha = 1
		ctx.fillStyle = "#2B2B2B"
		ctx.fillRect( 20, 20, 200, 75)


		ctx.globalAlpha = 1
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "20px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Paused", 32, 32);
		ctx.font = "12px Helvetica";
		ctx.fillText("Press P to unpause", 32, 55);

		//draw the player and enemies such that the user can tell what to do when unpaused
		drawHero()
		enemies.forEach(drawEnemy)
	}
}

function startNewGame() //basic resetting of variables
{
	roundCount = 0
	enemies = []
	roundValue.innerText = '0'

	hero.x = (canvas.width / 2) - 10
	hero.y = canvas.height - 50
	hero.vX = 0
	hero.vY = 0

	gamePaused = false
	gameActive = true
}

function loop() 
{
	var now = Date.now()
	var delta = now - then

	update()
	draw()

	then = now

	requestAnimationFrame(loop)
}

function lose() { gameActive = false }

//roundcount increases every second, number and speed of enemies is reliant on this
setInterval(function() {
	if (gameActive && !gamePaused) {
		var enemiesToCreate
		var speed

		if (roundCount > 2) enemiesToCreate = floor(roundCount / 2)
		else enemiesToCreate = 3
		if (roundCount > 15) speed = 3
		else if (roundCount > 10) speed = 2.5
		else if (roundCount > 5) speed = 2
		else if (roundCount > 2) speed = 1.75
		else speed = 1.5

		for (var i = 0; i < enemiesToCreate; i++) enemies.push(createEnemy(speed))
		roundCount++
	}
}, 1000)

function pauseGame() {
	if (gameActive) {
		if (!gamePaused) if (KEY_STATUS.p) {
			gamePaused = !gamePaused
			return
		}
	
		if (gamePaused) if(KEY_STATUS.p) {
			gamePaused = !gamePaused
			return
		}
	}
}

var then = Date.now()
startNewGame()
loop()



//Things that could've been added / changed

//potentially add max to enemies spawnable

//spawn at top and left off screen
//either aim at player or bottom of canvas (random target or player, weighted towards random bottom of canvas)

//music